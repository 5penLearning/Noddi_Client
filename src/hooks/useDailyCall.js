import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Daily from '@daily-co/daily-js';

function useDailyCall(roomUrl) {
  const callObjectRef = useRef(null);

  const recordingStartTimeoutRef =
    useRef(null);

  const [participants, setParticipants] =
    useState([]);

  const [isJoining, setIsJoining] =
    useState(false);

  const [isJoined, setIsJoined] =
    useState(false);

  const [error, setError] =
    useState(null);

  const [isRecording, setIsRecording] =
    useState(false);

  const [
    isRecordingStarting,
    setIsRecordingStarting,
  ] = useState(false);

  const [
    isRecordingStopping,
    setIsRecordingStopping,
  ] = useState(false);

  const [
    recordingStartedBy,
    setRecordingStartedBy,
  ] = useState(null);

  const [
    recordingError,
    setRecordingError,
  ] = useState(null);

  const clearRecordingStartTimeout =
    useCallback(() => {
      if (
        recordingStartTimeoutRef.current
      ) {
        window.clearTimeout(
          recordingStartTimeoutRef.current,
        );

        recordingStartTimeoutRef.current =
          null;
      }
    }, []);

  const syncParticipants =
    useCallback(() => {
      const callObject =
        callObjectRef.current;

      if (
        !callObject ||
        callObject.isDestroyed()
      ) {
        return;
      }

      const currentParticipants =
        Object.values(
          callObject.participants(),
        );

      setParticipants(
        currentParticipants,
      );
    }, []);

  useEffect(() => {
    if (!roomUrl) {
      return undefined;
    }

    let isDisposed = false;

    const callObject =
      Daily.createCallObject({
        allowMultipleCallInstances: true,
      });

    callObjectRef.current =
      callObject;

    const handleParticipantChange =
      () => {
        if (isDisposed) {
          return;
        }

        const currentParticipants =
          Object.values(
            callObject.participants(),
          );

        setParticipants(
          currentParticipants,
        );
      };

    const handleJoinedMeeting =
      () => {
        if (isDisposed) {
          return;
        }

        setIsJoined(true);
        setIsJoining(false);

        handleParticipantChange();
      };

    const handleLeftMeeting =
      () => {
        if (isDisposed) {
          return;
        }

        setIsJoined(false);
        setParticipants([]);
      };

    const handleError = (event) => {
      if (isDisposed) {
        return;
      }

      console.error(
        'Daily call error:',
        event,
      );

      setError(
        event?.errorMsg ??
          event?.error?.msg ??
          '화상회의 연결 중 오류가 발생했습니다.',
      );

      setIsJoining(false);
    };

    /*
     * 누군가 녹음을 시작하면
     * 모든 참가자에게 발생
     */
    const handleRecordingStarted = (
      event,
    ) => {
      if (isDisposed) {
        return;
      }

      clearRecordingStartTimeout();

      setIsRecording(true);

      setIsRecordingStarting(
        false,
      );

      setIsRecordingStopping(
        false,
      );

      setRecordingError(null);

      setRecordingStartedBy(
        event?.startedBy ?? null,
      );
    };

    /*
     * 녹음 종료 역시
     * 모든 참가자에게 발생
     */
    const handleRecordingStopped =
      () => {
        if (isDisposed) {
          return;
        }

        clearRecordingStartTimeout();

        setIsRecording(false);

        setIsRecordingStarting(
          false,
        );

        setIsRecordingStopping(
          false,
        );

        setRecordingStartedBy(
          null,
        );
      };

    const handleRecordingError = (
      event,
    ) => {
      if (isDisposed) {
        return;
      }

      console.error(
        'Daily recording error:',
        event,
      );

      clearRecordingStartTimeout();

      setIsRecordingStarting(
        false,
      );

      setIsRecordingStopping(
        false,
      );

      setRecordingError(
        event?.errorMsg ??
          '녹음 처리 중 오류가 발생했습니다.',
      );
    };

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
      'track-started',
      handleParticipantChange,
    );

    callObject.on(
      'track-stopped',
      handleParticipantChange,
    );

    callObject.on(
      'joined-meeting',
      handleJoinedMeeting,
    );

    callObject.on(
      'left-meeting',
      handleLeftMeeting,
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
      'error',
      handleError,
    );

    const joinMeeting = async () => {
      try {
        setError(null);
        setIsJoining(true);

        await callObject.join({
          url: roomUrl,
        });

        if (!isDisposed) {
          handleParticipantChange();
        }
      } catch (joinError) {
        if (isDisposed) {
          return;
        }

        console.error(
          'Failed to join Daily room:',
          joinError,
        );

        setError(
          joinError?.message ??
            '회의방에 입장하지 못했습니다.',
        );

        setIsJoining(false);
      }
    };

    joinMeeting();

    return () => {
      isDisposed = true;

      clearRecordingStartTimeout();

      if (
        callObjectRef.current ===
        callObject
      ) {
        callObjectRef.current =
          null;
      }

      if (
        !callObject.isDestroyed()
      ) {
        callObject
          .destroy()
          .catch(
            (destroyError) => {
              console.error(
                'Failed to destroy Daily call:',
                destroyError,
              );
            },
          );
      }
    };
  }, [
    roomUrl,
    clearRecordingStartTimeout,
  ]);

  const toggleMic =
    useCallback(async () => {
      const callObject =
        callObjectRef.current;

      if (
        !callObject ||
        callObject.isDestroyed()
      ) {
        return;
      }

      const localParticipant =
        callObject.participants()
          .local;

      const isMicOn =
        localParticipant?.tracks?.audio
          ?.state === 'playable';

      await callObject.setLocalAudio(
        !isMicOn,
      );

      syncParticipants();
    }, [syncParticipants]);

  const toggleCamera =
    useCallback(async () => {
      const callObject =
        callObjectRef.current;

      if (
        !callObject ||
        callObject.isDestroyed()
      ) {
        return;
      }

      const localParticipant =
        callObject.participants()
          .local;

      const isCameraOn =
        localParticipant?.tracks?.video
          ?.state === 'playable';

      await callObject.setLocalVideo(
        !isCameraOn,
      );

      syncParticipants();
    }, [syncParticipants]);

  const toggleScreenShare =
    useCallback(async () => {
      const callObject =
        callObjectRef.current;

      if (
        !callObject ||
        callObject.isDestroyed()
      ) {
        return;
      }

      const localParticipant =
        callObject.participants()
          .local;

      const isSharing =
        localParticipant?.tracks
          ?.screenVideo?.state ===
        'playable';

      try {
        setError(null);

        if (isSharing) {
          await Promise.resolve(
            callObject.stopScreenShare(),
          );
        } else {
          await Promise.resolve(
            callObject.startScreenShare(),
          );
        }

        syncParticipants();
      } catch (screenShareError) {
        console.error(
          'Screen share error:',
          screenShareError,
        );

        setError(
          screenShareError?.message ??
            '화면 공유를 시작하지 못했습니다.',
        );
      }
    }, [syncParticipants]);

  /*
   * Daily Cloud Recording 시작
   *
   * 실제 시작 여부는
   * recording-started 이벤트로 판단
   */
  const startRecording =
    useCallback(async () => {
      const callObject =
        callObjectRef.current;

      if (
        !callObject ||
        callObject.isDestroyed()
      ) {
        throw new Error(
          '회의 연결이 되어 있지 않습니다.',
        );
      }

      try {
        setRecordingError(null);

        setIsRecordingStarting(
          true,
        );

        clearRecordingStartTimeout();

        await Promise.resolve(
          callObject.startRecording({
            type: 'cloud-audio-only',
          }),
        );

        /*
         * Daily 공식 문서에서도
         * startRecording 호출 성공보다
         * recording-started 이벤트를
         * 실제 시작 기준으로 사용함.
         */
        recordingStartTimeoutRef.current =
          window.setTimeout(() => {
            setIsRecordingStarting(
              false,
            );

            setRecordingError(
              '녹음 시작을 확인하지 못했습니다. 잠시 후 다시 시도해주세요.',
            );

            recordingStartTimeoutRef.current =
              null;
          }, 15000);
      } catch (startError) {
        console.error(
          'Failed to start recording:',
          startError,
        );

        clearRecordingStartTimeout();

        setIsRecordingStarting(
          false,
        );

        const message =
          startError?.message ??
          '녹음을 시작하지 못했습니다.';

        setRecordingError(message);

        throw startError;
      }
    }, [
      clearRecordingStartTimeout,
    ]);

  /*
   * 녹음 종료
   *
   * recording-stopped 이벤트가
   * 실제로 발생할 때까지 기다린다.
   *
   * 회의 전체 종료 시 녹음본 처리가
   * 먼저 끝나도록 하기 위함.
   */
  const stopRecording =
    useCallback(async () => {
      const callObject =
        callObjectRef.current;

      if (
        !callObject ||
        callObject.isDestroyed()
      ) {
        throw new Error(
          '회의 연결이 되어 있지 않습니다.',
        );
      }

      setRecordingError(null);

      setIsRecordingStopping(true);

      return new Promise(
        (resolve, reject) => {
          let timeoutId = null;

          const handleStopped = () => {
            if (timeoutId) {
              window.clearTimeout(
                timeoutId,
              );
            }

            callObject.off(
              'recording-stopped',
              handleStopped,
            );

            callObject.off(
              'recording-error',
              handleStopError,
            );

            setIsRecording(false);

            setIsRecordingStopping(
              false,
            );

            resolve();
          };

          const handleStopError = (
            event,
          ) => {
            if (timeoutId) {
              window.clearTimeout(
                timeoutId,
              );
            }

            callObject.off(
              'recording-stopped',
              handleStopped,
            );

            callObject.off(
              'recording-error',
              handleStopError,
            );

            const message =
              event?.errorMsg ??
              '녹음을 종료하지 못했습니다.';

            setIsRecordingStopping(
              false,
            );

            setRecordingError(
              message,
            );

            reject(
              new Error(message),
            );
          };

          callObject.on(
            'recording-stopped',
            handleStopped,
          );

          callObject.on(
            'recording-error',
            handleStopError,
          );

          timeoutId =
            window.setTimeout(
              () => {
                callObject.off(
                  'recording-stopped',
                  handleStopped,
                );

                callObject.off(
                  'recording-error',
                  handleStopError,
                );

                const message =
                  '녹음 종료를 확인하지 못했습니다. 다시 시도해주세요.';

                setIsRecordingStopping(
                  false,
                );

                setRecordingError(
                  message,
                );

                reject(
                  new Error(message),
                );
              },
              10000,
            );

          try {
            const result =
              callObject.stopRecording();

            Promise.resolve(
              result,
            ).catch(
              (stopError) => {
                if (timeoutId) {
                  window.clearTimeout(
                    timeoutId,
                  );
                }

                callObject.off(
                  'recording-stopped',
                  handleStopped,
                );

                callObject.off(
                  'recording-error',
                  handleStopError,
                );

                setIsRecordingStopping(
                  false,
                );

                const message =
                  stopError?.message ??
                  '녹음을 종료하지 못했습니다.';

                setRecordingError(
                  message,
                );

                reject(stopError);
              },
            );
          } catch (stopError) {
            if (timeoutId) {
              window.clearTimeout(
                timeoutId,
              );
            }

            callObject.off(
              'recording-stopped',
              handleStopped,
            );

            callObject.off(
              'recording-error',
              handleStopError,
            );

            setIsRecordingStopping(
              false,
            );

            const message =
              stopError?.message ??
              '녹음을 종료하지 못했습니다.';

            setRecordingError(
              message,
            );

            reject(stopError);
          }
        },
      );
    }, []);

  /*
   * 개인 나가기
   *
   * 녹음은 종료하지 않는다.
   * 다른 참가자가 회의를 계속할 수 있음.
   */
  const leaveCall =
    useCallback(async () => {
      const callObject =
        callObjectRef.current;

      if (!callObject) {
        return;
      }

      callObjectRef.current = null;

      try {
        if (
          !callObject.isDestroyed()
        ) {
          await callObject.destroy();
        }
      } catch (leaveError) {
        console.error(
          'Failed to leave Daily room:',
          leaveError,
        );
      } finally {
        clearRecordingStartTimeout();

        setParticipants([]);

        setIsJoined(false);

        setIsRecording(false);

        setIsRecordingStarting(
          false,
        );

        setIsRecordingStopping(
          false,
        );

        setRecordingStartedBy(
          null,
        );
      }
    }, [
      clearRecordingStartTimeout,
    ]);

  const localParticipant =
    participants.find(
      (participant) =>
        participant.local,
    );

  const isMicOn =
    localParticipant?.tracks?.audio
      ?.state === 'playable';

  const isCameraOn =
    localParticipant?.tracks?.video
      ?.state === 'playable';

  const isSharing =
    localParticipant?.tracks
      ?.screenVideo?.state ===
    'playable';

  return {
    participants,
    localParticipant,

    isJoining,
    isJoined,

    isMicOn,
    isCameraOn,
    isSharing,

    error,

    isRecording,
    isRecordingStarting,
    isRecordingStopping,
    recordingStartedBy,
    recordingError,

    toggleMic,
    toggleCamera,
    toggleScreenShare,

    startRecording,
    stopRecording,

    leaveCall,
  };
}

export default useDailyCall;
