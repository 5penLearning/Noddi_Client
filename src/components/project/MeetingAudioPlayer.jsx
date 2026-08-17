import { useEffect, useRef, useState } from 'react';

import playIcon from '../../assets/icons/meeting-records/detail-play.svg';
import swapIcon from '../../assets/icons/meeting-records/detail-swap.svg';

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

  useEffect(() => {
    if (!recordingUrl || !audioRef.current) return;

    audioRef.current.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
  }, [recordingUrl]);

  const togglePlay = async () => {
    if (!recordingUrl) {
      await onRequestRecording();
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

  return (
    <div className="sticky bottom-0 mt-auto w-full bg-white">
      <audio
        ref={audioRef}
        src={recordingUrl}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="h-[7px] bg-[#baffe1]">
        <div
          className="h-full bg-[var(--color-primary)]"
          style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
        />
      </div>
      <div className="relative flex h-[53px] items-center px-8">
        <span className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-black">
          {formatTime(currentTime)}
        </span>
        <button type="button" onClick={changeRate} className="ml-[260px] text-[16px] font-medium">
          {playbackRate}x
        </button>
        <button type="button" onClick={() => (audioRef.current.currentTime = 0)} className="ml-28">
          <img src={swapIcon} className="size-6" />
        </button>
        <button type="button" onClick={togglePlay} className="absolute left-1/2 -translate-x-1/2">
          <img src={playIcon} className={`size-6 ${isPlaying ? 'opacity-50' : ''}`} />
        </button>
      </div>
    </div>
  );
}

export default MeetingAudioPlayer;
