import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import DailyIframe from '@daily-co/daily-js';

const CHAT_MESSAGE_TYPE =
  'meeting-chat';

const AUTO_RECORDING_DELAY =
  700;

function getErrorMessage(
  error,
  fallbackMessage,
) {
  if (
    typeof error === 'string'
  ) {
    return error;
  }

  return (
    error?.errorMsg ??
    error?.message ??
    fallbackMessage
  );
}

function getParticipants(
  callObject,
) {
  if (!callObject) {
    return [];
  }

  const participantMap =
    callObject.participants?.() ??
    {};

  return Object.values(
    participantMap,
  );
}

function createMessageId() {
  if (
    typeof crypto !==
      'undefined' &&
    typeof crypto.randomUUID ===
      'function'
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function useDailyCall(roomUrl) {
  const callObjectRef =
    useRef(null);

  const autoRecordingAttemptedRef =
    useRef(false);

  const [
    participants,
    setParticipants,
  ] = useState([]);

  const [
    chatMessages,
    setChatMessages,
  ] = useState([]);

  const [
    isJoining,
    setIsJoining,
  ] = useState(false);

  const [
    isJoined,
    setIsJoined,
  ] = useState(false);

  const [
    isMicOn,
    setIsMicOn,
  ] = useState(false);

  const [
    isCameraOn,
    setIsCameraOn,
  ] = useState(false);

  const [
    isSharing,
    setIsSharing,
  ] = useState(false);

  const [
    isRecording,
    setIsRecording,
  ] = useState(false);

  const [
    isRecordingStarting,
    setIsRecordingStarting,
  ] = useState(false);

  const [
    isRecordingStopping,
    setIsRecordingStopping,
  ] = useState(false);

  const [
    recordingError,
    setRecordingError,
  ] = useState(null);

  const [
    error,
    setError,
  ] = useState(null);

  const syncParticipants =
    useCallback(
      (callObject) => {
        const nextParticipants =
          getParticipants(
            callObject,
          );

        setParticipants(
          nextParticipants,
        );

        const localParticipant =
          nextParticipants.find(
            (participant) =>
              participant.local,
          );

        if (
          !localParticipant
        ) {
          setIsMicOn(
            false,
          );

          setIsCameraOn(
            false,
          );

          setIsSharing(
            false,
          );

          return;
        }

        const audioTrack =
          localParticipant
            ?.tracks
            ?.audio;

        const videoTrack =
          localParticipant
            ?.tracks
            ?.video;

        const screenTrack =
          localParticipant
            ?.tracks
            ?.screenVideo;

        setIsMicOn(
          audioTrack?.state ===
            'playable' ||
            audioTrack?.state ===
              'loading',
        );

        setIsCameraOn(
          videoTrack?.state ===
            'playable' ||
            videoTrack?.state ===
              'loading',
        );

        setIsSharing(
          screenTrack?.state ===
            'playable' ||
            screenTrack?.state ===
              'loading',
        );
      },
      [],
    );

  useEffect(() => {
    if (!roomUrl) {
      return undefined;
    }

    let cancelled =
      false;

    let autoRecordingTimeoutId =
      null;

    const callObject =
      DailyIframe.createCallObject();

    callObjectRef.current =
      callObject;

    autoRecordingAttemptedRef.current =
      false;

    setChatMessages([]);

    setError(null);

    setRecordingError(
      null,
    );

    setIsJoining(
      true,
    );

    /*
     * 첫 참가자가 Daily 입장에 성공하면 자동 녹음을 시작한다.
     *
     * 여러 참가자가 동시에 startRecording을 호출하지 않도록
     * joined-meeting 시점에 현재 참가자가 자기 자신 하나뿐일 때만
     * 자동 시작한다.
     *
     * 이후 참가자는 이미 시작된 회의에 들어오는 것이므로
     * 자동 startRecording을 호출하지 않는다.
     */
    const startRecordingAutomatically =
      () => {
        if (
          cancelled ||
          autoRecordingAttemptedRef.current
        ) {
          return;
        }

        const currentParticipants =
          getParticipants(
            callObject,
          );

        const localParticipant =
          currentParticipants.find(
            (participant) =>
              participant.local,
          );

        if (
          !localParticipant
        ) {
          return;
        }

        /*
         * 첫 참가자만 자동 녹음 시작.
         */
        if (
          currentParticipants.length >
          1
        ) {
          return;
        }

        autoRecordingAttemptedRef.current =
          true;

        setRecordingError(
          null,
        );

        setIsRecordingStarting(
          true,
        );

        try {
          const recordingResult =
            callObject.startRecording({
              type:
                'cloud-audio-only',
            });

          Promise.resolve(
            recordingResult,
          ).catch(
            (
              startError,
            ) => {
              if (
                cancelled
              ) {
                return;
              }

              console.error(
                'Failed to auto start recording:',
                startError,
              );

              autoRecordingAttemptedRef.current =
                false;

              setIsRecordingStarting(
                false,
              );

              setRecordingError(
                getErrorMessage(
                  startError,
                  '자동 녹음을 시작하지 못했습니다.',
                ),
              );
            },
          );
        } catch (
          startError
        ) {
          console.error(
            'Failed to auto start recording:',
            startError,
          );

          autoRecordingAttemptedRef.current =
            false;

          setIsRecordingStarting(
            false,
          );

          setRecordingError(
            getErrorMessage(
              startError,
              '자동 녹음을 시작하지 못했습니다.',
            ),
          );
        }
      };

    const handleJoinedMeeting =
      () => {
        if (cancelled) {
          return;
        }

        setIsJoining(
          false,
        );

        setIsJoined(
          true,
        );

        syncParticipants(
          callObject,
        );

        /*
         * joined-meeting 직후 Daily 내부 상태가
         * 완전히 반영될 시간을 아주 짧게 준 뒤 녹음을 시작한다.
         */
        autoRecordingTimeoutId =
          window.setTimeout(
            () => {
              startRecordingAutomatically();
            },
            AUTO_RECORDING_DELAY,
          );
      };

    const handleLeftMeeting =
      () => {
        if (cancelled) {
          return;
        }

        if (
          autoRecordingTimeoutId
        ) {
          window.clearTimeout(
            autoRecordingTimeoutId,
          );

          autoRecordingTimeoutId =
            null;
        }

        autoRecordingAttemptedRef.current =
          false;

        setIsJoined(
          false,
        );

        setParticipants([]);

        setIsMicOn(false);

        setIsCameraOn(false);

        setIsSharing(false);

        setIsRecording(false);

        setIsRecordingStarting(
          false,
        );

        setIsRecordingStopping(
          false,
        );
      };

    const handleParticipantChange =
      () => {
        if (cancelled) {
          return;
        }

        syncParticipants(
          callObject,
        );
      };

    const handleRecordingStarted =
      () => {
        if (cancelled) {
          return;
        }

        setIsRecording(
          true,
        );

        setIsRecordingStarting(
          false,
        );

        setIsRecordingStopping(
          false,
        );

        setRecordingError(
          null,
        );
      };

    const handleRecordingStopped =
      () => {
        if (cancelled) {
          return;
        }

        setIsRecording(
          false,
        );

        setIsRecordingStarting(
          false,
        );

        setIsRecordingStopping(
          false,
        );
      };

    const handleRecordingError =
      (event) => {
        if (cancelled) {
          return;
        }

        const message =
          getErrorMessage(
            event,
            '녹음 처리 중 오류가 발생했습니다.',
          );

        console.error(
          'Daily recording error:',
          event,
        );

        setRecordingError(
          message,
        );

        setIsRecordingStarting(
          false,
        );

        setIsRecordingStopping(
          false,
        );
      };

    const handleAppMessage =
      ({
        data,
        fromId,
      }) => {
        if (
          cancelled ||
          data?.type !==
            CHAT_MESSAGE_TYPE ||
          !data?.message
        ) {
          return;
        }

        const participant =
          callObject
            .participants?.()?.[
              fromId
            ];

        const senderName =
          data.senderName ||
          participant?.user_name ||
          '참여자';

        const nextMessage = {
          id:
            data.id ??
            createMessageId(),

          senderSessionId:
            fromId,

          name:
            senderName,

          message:
            data.message,

          sentAt:
            data.sentAt ??
            new Date().toISOString(),

          isMine:
            false,
        };

        setChatMessages(
          (
            previousMessages,
          ) => {
            const alreadyExists =
              previousMessages.some(
                (message) =>
                  message.id ===
                  nextMessage.id,
              );

            if (
              alreadyExists
            ) {
              return previousMessages;
            }

            return [
              ...previousMessages,
              nextMessage,
            ];
          },
        );
      };

    const handleDailyError =
      (event) => {
        if (cancelled) {
          return;
        }

        console.error(
          'Daily error:',
          event,
        );

        setError(
          getErrorMessage(
            event,
            '화상회의 연결 중 오류가 발생했습니다.',
          ),
        );
      };

    callObject.on(
      'joined-meeting',
      handleJoinedMeeting,
    );

    callObject.on(
      'left-meeting',
      handleLeftMeeting,
    );

    callObject.on(
      'participant-joined',
      handleParticipantChange,
    );

    callObject.on(
      'participant-updated',
      handleParticipantChange,
    );

    callObject.on(
      'participant-left',
      handleParticipantChange,
    );

    callObject.on(
      'recording-started',
      handleRecordingStarted,
    );

    callObject.on(
      'recording-stopped',
      handleRecordingStopped,
    );

    callObject.on(
      'recording-error',
      handleRecordingError,
    );

    callObject.on(
      'app-message',
      handleAppMessage,
    );

    callObject.on(
      'error',
      handleDailyError,
    );

    const joinMeeting =
      async () => {
        try {
          await callObject.join({
            url:
              roomUrl,
          });
        } catch (
          joinError
        ) {
          if (
            cancelled
          ) {
            return;
          }

          console.error(
            'Failed to join Daily room:',
            joinError,
          );

          setIsJoining(
            false,
          );

          setError(
            getErrorMessage(
              joinError,
              '회의방에 참여하지 못했습니다.',
            ),
          );
        }
      };

    joinMeeting();

    return () => {
      cancelled =
        true;

      if (
        autoRecordingTimeoutId
      ) {
        window.clearTimeout(
          autoRecordingTimeoutId,
        );
      }

      callObject.off(
        'joined-meeting',
        handleJoinedMeeting,
      );

      callObject.off(
        'left-meeting',
        handleLeftMeeting,
      );

      callObject.off(
        'participant-joined',
        handleParticipantChange,
      );

      callObject.off(
        'participant-updated',
        handleParticipantChange,
      );

      callObject.off(
        'participant-left',
        handleParticipantChange,
      );

      callObject.off(
        'recording-started',
        handleRecordingStarted,
      );

      callObject.off(
        'recording-stopped',
        handleRecordingStopped,
      );

      callObject.off(
        'recording-error',
        handleRecordingError,
      );

      callObject.off(
        'app-message',
        handleAppMessage,
      );

      callObject.off(
        'error',
        handleDailyError,
      );

      if (
        callObjectRef.current ===
        callObject
      ) {
        callObjectRef.current =
          null;
      }

      try {
        if (
          !callObject.isDestroyed?.()
        ) {
          callObject.destroy();
        }
      } catch (
        destroyError
      ) {
        console.error(
          'Failed to destroy Daily call:',
          destroyError,
        );
      }
    };
  }, [
    roomUrl,
    syncParticipants,
  ]);

  const toggleMic =
    useCallback(async () => {
      const callObject =
        callObjectRef.current;

      if (
        !callObject ||
        !isJoined
      ) {
        return;
      }

      try {
        setError(null);

        await callObject.setLocalAudio(
          !isMicOn,
        );

        syncParticipants(
          callObject,
        );
      } catch (
        toggleError
      ) {
        console.error(
          'Failed to toggle microphone:',
          toggleError,
        );

        setError(
          getErrorMessage(
            toggleError,
            '마이크 상태를 변경하지 못했습니다.',
          ),
        );
      }
    }, [
      isJoined,
      isMicOn,
      syncParticipants,
    ]);

  const toggleCamera =
    useCallback(async () => {
      const callObject =
        callObjectRef.current;

      if (
        !callObject ||
        !isJoined
      ) {
        return;
      }

      try {
        setError(null);

        await callObject.setLocalVideo(
          !isCameraOn,
        );

        syncParticipants(
          callObject,
        );
      } catch (
        toggleError
      ) {
        console.error(
          'Failed to toggle camera:',
          toggleError,
        );

        setError(
          getErrorMessage(
            toggleError,
            '카메라 상태를 변경하지 못했습니다.',
          ),
        );
      }
    }, [
      isCameraOn,
      isJoined,
      syncParticipants,
    ]);

  const toggleScreenShare =
    useCallback(async () => {
      const callObject =
        callObjectRef.current;

      if (
        !callObject ||
        !isJoined
      ) {
        return;
      }

      try {
        setError(null);

        if (
          isSharing
        ) {
          await callObject.stopScreenShare();
        } else {
          await callObject.startScreenShare();
        }

        syncParticipants(
          callObject,
        );
      } catch (
        shareError
      ) {
        console.error(
          'Failed to toggle screen share:',
          shareError,
        );

        setError(
          getErrorMessage(
            shareError,
            '화면 공유 상태를 변경하지 못했습니다.',
          ),
        );
      }
    }, [
      isJoined,
      isSharing,
      syncParticipants,
    ]);

  const sendChatMessage =
    useCallback(
      async (
        message,
      ) => {
        const callObject =
          callObjectRef.current;

        const trimmedMessage =
          message?.trim();

        if (
          !callObject ||
          !isJoined ||
          !trimmedMessage
        ) {
          return;
        }

        const localParticipant =
          callObject
            .participants?.()
            ?.local;

        const id =
          createMessageId();

        const sentAt =
          new Date().toISOString();

        const senderName =
          localParticipant
            ?.user_name ||
          '나';

        const payload = {
          type:
            CHAT_MESSAGE_TYPE,

          id,

          message:
            trimmedMessage,

          senderName,

          sentAt,
        };

        try {
          callObject.sendAppMessage(
            payload,
            '*',
          );

          setChatMessages(
            (
              previousMessages,
            ) => [
              ...previousMessages,
              {
                id,

                senderSessionId:
                  localParticipant
                    ?.session_id ??
                  'local',

                name:
                  '나',

                message:
                  trimmedMessage,

                sentAt,

                isMine:
                  true,
              },
            ],
          );
        } catch (
          sendError
        ) {
          console.error(
            'Failed to send chat message:',
            sendError,
          );

          throw new Error(
            getErrorMessage(
              sendError,
              '메시지를 전송하지 못했습니다.',
            ),
          );
        }
      },
      [
        isJoined,
      ],
    );

  const startRecording =
    useCallback(() => {
      const callObject =
        callObjectRef.current;

      if (
        !callObject ||
        !isJoined ||
        isRecording ||
        isRecordingStarting
      ) {
        return Promise.resolve();
      }

      setRecordingError(
        null,
      );

      setIsRecordingStarting(
        true,
      );

      return new Promise(
        (
          resolve,
          reject,
        ) => {
          let timeoutId;

          const cleanup =
            () => {
              callObject.off(
                'recording-started',
                handleStarted,
              );

              callObject.off(
                'recording-error',
                handleError,
              );

              window.clearTimeout(
                timeoutId,
              );
            };

          const handleStarted =
            (event) => {
              cleanup();

              resolve(event);
            };

          const handleError =
            (event) => {
              cleanup();

              reject(
                new Error(
                  getErrorMessage(
                    event,
                    '녹음을 시작하지 못했습니다.',
                  ),
                ),
              );
            };

          callObject.on(
            'recording-started',
            handleStarted,
          );

          callObject.on(
            'recording-error',
            handleError,
          );

          timeoutId =
            window.setTimeout(
              () => {
                cleanup();

                setIsRecordingStarting(
                  false,
                );

                reject(
                  new Error(
                    '녹음 시작 상태를 확인하지 못했습니다.',
                  ),
                );
              },
              15000,
            );

          try {
            callObject.startRecording({
              type:
                'cloud-audio-only',
            });
          } catch (
            startError
          ) {
            cleanup();

            setIsRecordingStarting(
              false,
            );

            reject(
              startError,
            );
          }
        },
      );
    }, [
      isJoined,
      isRecording,
      isRecordingStarting,
    ]);

  const stopRecording =
    useCallback(() => {
      const callObject =
        callObjectRef.current;

      if (
        !callObject ||
        !isRecording ||
        isRecordingStopping
      ) {
        return Promise.resolve();
      }

      setRecordingError(
        null,
      );

      setIsRecordingStopping(
        true,
      );

      return new Promise(
        (
          resolve,
          reject,
        ) => {
          let timeoutId;

          const cleanup =
            () => {
              callObject.off(
                'recording-stopped',
                handleStopped,
              );

              callObject.off(
                'recording-error',
                handleError,
              );

              window.clearTimeout(
                timeoutId,
              );
            };

          const handleStopped =
            (event) => {
              cleanup();

              resolve(event);
            };

          const handleError =
            (event) => {
              cleanup();

              reject(
                new Error(
                  getErrorMessage(
                    event,
                    '녹음을 종료하지 못했습니다.',
                  ),
                ),
              );
            };

          callObject.on(
            'recording-stopped',
            handleStopped,
          );

          callObject.on(
            'recording-error',
            handleError,
          );

          timeoutId =
            window.setTimeout(
              () => {
                cleanup();

                setIsRecordingStopping(
                  false,
                );

                reject(
                  new Error(
                    '녹음 종료 상태를 확인하지 못했습니다.',
                  ),
                );
              },
              10000,
            );

          try {
            callObject.stopRecording();
          } catch (
            stopError
          ) {
            cleanup();

            setIsRecordingStopping(
              false,
            );

            reject(
              stopError,
            );
          }
        },
      );
    }, [
      isRecording,
      isRecordingStopping,
    ]);

  const leaveCall =
    useCallback(async () => {
      const callObject =
        callObjectRef.current;

      if (!callObject) {
        return;
      }

      try {
        await callObject.leave();
      } catch (
        leaveError
      ) {
        console.error(
          'Failed to leave Daily call:',
          leaveError,
        );

        throw leaveError;
      }
    }, []);

  return {
    participants,

    chatMessages,

    isJoining,

    isJoined,

    isMicOn,

    isCameraOn,

    isSharing,

    isRecording,

    isRecordingStarting,

    isRecordingStopping,

    recordingError,

    error,

    toggleMic,

    toggleCamera,

    toggleScreenShare,

    sendChatMessage,

    startRecording,

    stopRecording,

    leaveCall,
  };
}

export default useDailyCall;
