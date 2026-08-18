import { useState } from 'react';

import ContentVisibilityToggle from './ContentVisibilityToggle';

function MeetingTranscriptPanel({ transcript }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] leading-[1.3] font-semibold text-[var(--color-gray-900)]">
          음성 기록
        </h2>
        <ContentVisibilityToggle
          isVisible={isVisible}
          onClick={() => setIsVisible((previousValue) => !previousValue)}
          showLabel="보기"
        />
      </div>
      {isVisible && (
        <div className="mt-4 max-h-[443px] [scrollbar-width:thin] [scrollbar-color:#d9d9d9_transparent] overflow-y-auto pr-5">
          {transcript ? (
            <p className="text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-pre-wrap text-[var(--color-gray-600)]">
              {transcript}
            </p>
          ) : (
            <p className="text-[14px] text-[var(--color-gray-500)]">음성 기록이 없습니다.</p>
          )}
        </div>
      )}
    </section>
  );
}

export default MeetingTranscriptPanel;
