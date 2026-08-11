import { useCallback, useEffect, useRef, useState } from 'react';

function useLocalMedia() {
  const streamRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const stopMedia = useCallback(() => {
    if (!streamRef.current) {
      return;
    }

    streamRef.current.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
    setStream(null);
  }, []);

  const startMedia = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      stopMedia();

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          '이 브라우저에서는 카메라와 마이크를 사용할 수 없습니다.',
        );
      }

      const mediaStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

      streamRef.current = mediaStream;

      setStream(mediaStream);
      setIsMicOn(true);
      setIsCameraOn(true);
    } catch (mediaError) {
      console.error('미디어 장치 접근 실패:', mediaError);

      if (mediaError.name === 'NotAllowedError') {
        setError(
          '카메라 또는 마이크 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요.',
        );
      } else if (mediaError.name === 'NotFoundError') {
        setError(
          '사용할 수 있는 카메라 또는 마이크를 찾을 수 없습니다.',
        );
      } else if (mediaError.name === 'NotReadableError') {
        setError(
          '카메라 또는 마이크가 다른 프로그램에서 사용 중일 수 있습니다.',
        );
      } else {
        setError(
          mediaError.message ||
            '카메라와 마이크를 시작할 수 없습니다.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [stopMedia]);

  const toggleMic = useCallback(() => {
    if (!streamRef.current) {
      return;
    }

    const audioTracks =
      streamRef.current.getAudioTracks();

    if (audioTracks.length === 0) {
      return;
    }

    const nextMicState = !isMicOn;

    audioTracks.forEach((track) => {
      track.enabled = nextMicState;
    });

    setIsMicOn(nextMicState);
  }, [isMicOn]);

  const toggleCamera = useCallback(() => {
    if (!streamRef.current) {
      return;
    }

    const videoTracks =
      streamRef.current.getVideoTracks();

    if (videoTracks.length === 0) {
      return;
    }

    const nextCameraState = !isCameraOn;

    videoTracks.forEach((track) => {
      track.enabled = nextCameraState;
    });

    setIsCameraOn(nextCameraState);
  }, [isCameraOn]);

  useEffect(() => {
    startMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });

        streamRef.current = null;
      }
    };
  }, [startMedia]);

  return {
    stream,
    isMicOn,
    isCameraOn,
    isLoading,
    error,
    toggleMic,
    toggleCamera,
    startMedia,
    stopMedia,
  };
}

export default useLocalMedia;
