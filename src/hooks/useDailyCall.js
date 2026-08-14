import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Daily from '@daily-co/daily-js';

function useDailyCall(roomUrl) {
  const callObjectRef = useRef(null);

  const [participants, setParticipants] = useState([]);
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState(null);

  const syncParticipants = useCallback(() => {
    const callObject = callObjectRef.current;

    if (!callObject || callObject.isDestroyed()) {
      return;
    }

    const currentParticipants = Object.values(
      callObject.participants(),
    );

    setParticipants(currentParticipants);
  }, []);

  useEffect(() => {
    if (!roomUrl) {
      return undefined;
    }

    let isDisposed = false;

    const callObject = Daily.createCallObject({
      /*
       * React 개발 환경의 StrictMode에서
       * effect가 재실행되는 순간 기존 Daily 객체의
       * destroy 완료 전 새 객체가 만들어지는 경우를 방지한다.
       */
      allowMultipleCallInstances: true,
    });

    callObjectRef.current = callObject;

    const handleParticipantChange = () => {
      if (isDisposed) {
        return;
      }

      const currentParticipants = Object.values(
        callObject.participants(),
      );

      setParticipants(currentParticipants);
    };

    const handleJoinedMeeting = () => {
      if (isDisposed) {
        return;
      }

      setIsJoined(true);
      setIsJoining(false);
      handleParticipantChange();
    };

    const handleLeftMeeting = () => {
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

      console.error('Daily call error:', event);

      setError(
        event?.errorMsg ??
          event?.error?.msg ??
          '화상회의 연결 중 오류가 발생했습니다.',
      );

      setIsJoining(false);
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

    callObject.on('error', handleError);

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

      if (callObjectRef.current === callObject) {
        callObjectRef.current = null;
      }

      if (!callObject.isDestroyed()) {
        callObject.destroy().catch((destroyError) => {
          console.error(
            'Failed to destroy Daily call:',
            destroyError,
          );
        });
      }
    };
  }, [roomUrl]);

  const toggleMic = useCallback(async () => {
    const callObject = callObjectRef.current;

    if (!callObject || callObject.isDestroyed()) {
      return;
    }

    const localParticipant =
      callObject.participants().local;

    const isMicOn =
      localParticipant?.tracks?.audio?.state ===
      'playable';

    await callObject.setLocalAudio(!isMicOn);

    syncParticipants();
  }, [syncParticipants]);

  const toggleCamera = useCallback(async () => {
    const callObject = callObjectRef.current;

    if (!callObject || callObject.isDestroyed()) {
      return;
    }

    const localParticipant =
      callObject.participants().local;

    const isCameraOn =
      localParticipant?.tracks?.video?.state ===
      'playable';

    await callObject.setLocalVideo(!isCameraOn);

    syncParticipants();
  }, [syncParticipants]);

  const toggleScreenShare = useCallback(async () => {
    const callObject = callObjectRef.current;

    if (!callObject || callObject.isDestroyed()) {
      return;
    }

    const localParticipant =
      callObject.participants().local;

    const isSharing =
      localParticipant?.tracks?.screenVideo?.state ===
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

  const leaveCall = useCallback(async () => {
    const callObject = callObjectRef.current;

    if (!callObject) {
      return;
    }

    callObjectRef.current = null;

    try {
      if (!callObject.isDestroyed()) {
        await callObject.destroy();
      }
    } catch (leaveError) {
      console.error(
        'Failed to leave Daily room:',
        leaveError,
      );
    } finally {
      setParticipants([]);
      setIsJoined(false);
    }
  }, []);

  const localParticipant = participants.find(
    (participant) => participant.local,
  );

  const isMicOn =
    localParticipant?.tracks?.audio?.state ===
    'playable';

  const isCameraOn =
    localParticipant?.tracks?.video?.state ===
    'playable';

  const isSharing =
    localParticipant?.tracks?.screenVideo?.state ===
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
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    leaveCall,
  };
}

export default useDailyCall;
