import { useState } from 'react';

import bookmarkIcon from '../../assets/icons/meeting-records/detail-bookmark.svg';
import bookmarkLineIcon from '../../assets/icons/meeting-records/detail-bookmark-line.svg';
import downloadArrowIcon from '../../assets/icons/meeting-records/detail-download-arrow.svg';
import downloadBoxIcon from '../../assets/icons/meeting-records/detail-download-box.svg';
import downloadLineIcon from '../../assets/icons/meeting-records/detail-download-line.svg';
import shareDotIcon from '../../assets/icons/meeting-records/detail-share-dot.svg';
import shareLineAIcon from '../../assets/icons/meeting-records/detail-share-line-a.svg';
import shareLineBIcon from '../../assets/icons/meeting-records/detail-share-line-b.svg';

function BookmarkIcon() {
  return (
    <span className="relative block size-6">
      <img src={bookmarkIcon} className="absolute top-[3px] left-[5px] h-[19px] w-[14px]" />
      <img src={bookmarkLineIcon} className="absolute top-2 left-[9px] h-px w-1.5" />
    </span>
  );
}

function DownloadIcon() {
  return (
    <span className="relative block size-6">
      <span className="absolute top-2 left-[3px] flex h-[13px] w-5 items-center justify-center">
        <img src={downloadBoxIcon} className="h-5 w-[13px] rotate-90" />
      </span>
      <img
        src={downloadArrowIcon}
        className="absolute top-[13px] left-[10px] h-[3px] w-1.5 -scale-y-100"
      />
      <img
        src={downloadLineIcon}
        className="absolute top-[3px] left-[12.25px] h-[13px] w-[1.5px]"
      />
    </span>
  );
}

function ShareIcon() {
  return (
    <span className="relative block size-6">
      <img src={shareDotIcon} className="absolute top-[1.25px] left-[14.25px] size-[6.5px]" />
      <img src={shareDotIcon} className="absolute top-[8.25px] left-[2.25px] size-[6.5px]" />
      <img src={shareDotIcon} className="absolute top-[16.25px] left-[14.25px] size-[6.5px]" />
      <img
        src={shareLineAIcon}
        className="absolute top-[3.75px] left-[7.25px] h-[3.62px] w-[9.28px]"
      />
      <img
        src={shareLineBIcon}
        className="absolute top-[11.75px] left-[6.25px] h-[3.62px] w-[9.99px]"
      />
    </span>
  );
}

function MeetingDetailHeader({ title, dateLabel, durationLabel, onDownload }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: window.location.href });
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <header className="flex items-start justify-between px-[29px] pt-[26px]">
      <div>
        <h1 className="text-[32px] leading-[1.2] font-semibold tracking-[0.32px] text-black">
          {title}
        </h1>
        <div className="mt-1 flex items-center gap-3 text-[16px] leading-[1.4] tracking-[-0.16px] text-[var(--color-gray-600)]">
          <time>{dateLabel}</time>
          <span className="size-0.5 rounded-full bg-[var(--color-gray-400)]" />
          <span>{durationLabel}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 pt-1">
        <button
          type="button"
          onClick={() => setIsBookmarked((value) => !value)}
          className={isBookmarked ? 'opacity-100' : 'opacity-70'}
        >
          <BookmarkIcon />
        </button>
        <button type="button" onClick={onDownload}>
          <DownloadIcon />
        </button>
        <button type="button" onClick={handleShare}>
          <ShareIcon />
        </button>
      </div>
    </header>
  );
}

export default MeetingDetailHeader;
