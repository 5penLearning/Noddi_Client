import { useRef, useState } from 'react';

import forwardFiveIcon from '../../assets/icons/meeting-records/detail-forward-5.svg';
import playControlIcon from '../../assets/icons/meeting-records/detail-play-control.svg';
import rewindFiveIcon from '../../assets/icons/meeting-records/detail-rewind-5.svg';

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

function MeetingAudioPlayer({ recordingUrl, onRequestRecording }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const togglePlay = async () => {
    if (!recordingUrl) {
      const nextRecordingUrl = await onRequestRecording();

      if (nextRecordingUrl && audioRef.current) {
        audioRef.current.src = nextRecordingUrl;
        await audioRef.current.play();
        setIsPlaying(true);
      }

      return;
    }

    if (audioRef.current.paused) {
      await audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    audioRef.current.pause();
    setIsPlaying(false);
  };

  const changeRate = () => {
    const nextRate = playbackRate === 2 ? 1 : playbackRate + 0.5;
    setPlaybackRate(nextRate);
    audioRef.current.playbackRate = nextRate;
  };

  const seekBy = (seconds) => {
    if (!audioRef.current) return;

    const nextTime = Math.min(
      Math.max(audioRef.current.currentTime + seconds, 0),
      audioRef.current.duration || 0,
    );

    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className="sticky bottom-0 mt-auto w-full bg-white">
      <audio
        ref={audioRef}
        src={recordingUrl}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="h-[7px] bg-[#baffe1]">
        <div
          className="h-full bg-[var(--color-primary)]"
          style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
        />
      </div>
      <div className="relative flex h-[53px] items-center justify-between px-8">
        <span className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[var(--color-gray-500)]">
          {formatTime(currentTime)}
        </span>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-6">
          <button
            type="button"
            onClick={changeRate}
            className="mr-8 text-[16px] leading-[1.4] font-medium tracking-[-0.16px] whitespace-nowrap text-[var(--color-gray-600)]"
          >
            {playbackRate}x
          </button>
          <button
            type="button"
            onClick={() => seekBy(-5)}
            className="flex size-[26px] items-center"
          >
            <img src={rewindFiveIcon} className="size-[26px]" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="flex size-6 items-center justify-center"
            aria-label={isPlaying ? '일시정지' : '재생'}
          >
            {isPlaying ? (
              <span className="flex h-[18px] w-[15px] items-center justify-between" aria-hidden="true">
                <span className="h-full w-[5px] rounded-[1px] bg-black" />
                <span className="h-full w-[5px] rounded-[1px] bg-black" />
              </span>
            ) : (
              <img src={playControlIcon} alt="" className="size-6" />
            )}
          </button>
          <button type="button" onClick={() => seekBy(5)} className="flex size-[26px] items-center">
            <img src={forwardFiveIcon} className="size-[26px] -scale-x-100" />
          </button>
        </div>

        <span className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[var(--color-gray-500)]">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

export default MeetingAudioPlayer;
