import { useCallback, useEffect, useRef, useState } from 'react';

function useScreenShare() {
  const streamRef = useRef(null);

  const [screenStream, setScreenStream] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState(null);

  const stopScreenShare = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }

    streamRef.current = null;

    setScreenStream(null);
    setIsSharing(false);
  }, []);

  const startScreenShare = useCallback(async () => {
    try {
      setError(null);

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getDisplayMedia
      ) {
        throw new Error(
          '이 브라우저에서는 화면 공유를 사용할 수 없습니다.',
        );
      }

      const stream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

      streamRef.current = stream;

      setScreenStream(stream);
      setIsSharing(true);

      const videoTrack = stream.getVideoTracks()[0];

      if (videoTrack) {
        videoTrack.onended = () => {
          streamRef.current = null;

          setScreenStream(null);
          setIsSharing(false);
        };
      }
    } catch (screenShareError) {
      console.error(
        '화면 공유 시작 실패:',
        screenShareError,
      );

      if (screenShareError.name === 'NotAllowedError') {
        setError('화면 공유가 취소되었습니다.');
        return;
      }

      setError(
        screenShareError.message ||
          '화면 공유를 시작할 수 없습니다.',
      );
    }
  }, []);

  const toggleScreenShare = useCallback(() => {
    if (isSharing) {
      stopScreenShare();
      return;
    }

    startScreenShare();
  }, [
    isSharing,
    startScreenShare,
    stopScreenShare,
  ]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }
    };
  }, []);

  return {
    screenStream,
    isSharing,
    error,
    startScreenShare,
    stopScreenShare,
    toggleScreenShare,
  };
}

export default useScreenShare;
