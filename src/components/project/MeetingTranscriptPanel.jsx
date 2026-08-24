import { useMemo, useState } from 'react';

import ContentVisibilityToggle from './ContentVisibilityToggle';

function formatTranscriptTime(milliseconds) {
  const value = Number(milliseconds);

  if (!Number.isFinite(value) || value < 0) {
    return '00:00';
  }

  const totalSeconds = Math.floor(value / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${paddedMinutes}:${paddedSeconds}`;
}

function buildSpeakerBlocks(transcriptSegments) {
  if (!Array.isArray(transcriptSegments)) {
    return [];
  }

  const sortedSegments = [...transcriptSegments]
    .filter((segment) => {
      return typeof segment?.text === 'string' && segment.text.trim();
    })
    .sort((a, b) => {
      const sequenceA = Number(a.sequence);
      const sequenceB = Number(b.sequence);

      if (!Number.isFinite(sequenceA)) {
        return 1;
      }

      if (!Number.isFinite(sequenceB)) {
        return -1;
      }

      return sequenceA - sequenceB;
    });

  return sortedSegments.reduce((blocks, segment) => {
    const speakerLabel = segment.speakerLabel ?? '?';
    const text = segment.text.trim();

    const previousBlock = blocks[blocks.length - 1];

    // 바로 이전 발화와 화자가 같을 경우 하나의 블록으로 합침
    if (previousBlock && previousBlock.speakerLabel === speakerLabel) {
      previousBlock.text = `${previousBlock.text} ${text}`;
      previousBlock.endTimeMs = segment.endTimeMs ?? previousBlock.endTimeMs;
      previousBlock.sequenceEnd = segment.sequence ?? previousBlock.sequenceEnd;

      return blocks;
    }

    blocks.push({
      speakerLabel,
      startTimeMs: segment.startTimeMs,
      endTimeMs: segment.endTimeMs,
      sequenceStart: segment.sequence,
      sequenceEnd: segment.sequence,
      text,
    });

    return blocks;
  }, []);
}

function MeetingTranscriptPanel({
  transcript,
  transcriptSegments = [],
}) {
  const [isVisible, setIsVisible] = useState(true);

  const speakerBlocks = useMemo(
    () => buildSpeakerBlocks(transcriptSegments),
    [transcriptSegments],
  );

  const hasSpeakerTranscript = speakerBlocks.length > 0;

  return (
    <section className="min-w-0">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] leading-[1.3] font-semibold text-[var(--color-gray-900)]">
          음성 기록
        </h2>

        <ContentVisibilityToggle
          isVisible={isVisible}
          onClick={() =>
            setIsVisible((previousValue) => !previousValue)
          }
          showLabel="보기"
        />
      </div>

      {isVisible && (
        <div className="mt-4 max-h-[443px] overflow-y-auto pr-5 [scrollbar-color:#d9d9d9_transparent] [scrollbar-width:thin]">
          {hasSpeakerTranscript ? (
            <div className="space-y-5">
              {speakerBlocks.map((block, index) => (
                <article
                  key={`${block.sequenceStart}-${block.sequenceEnd}-${block.speakerLabel}-${index}`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-[14px] leading-[1.4] font-semibold text-[var(--color-gray-900)]">
                      화자 {block.speakerLabel}
                    </span>

                    <span className="text-[12px] leading-[1.4] text-[var(--color-gray-400)]">
                      {formatTranscriptTime(block.startTimeMs)}
                    </span>
                  </div>

                  <p className="text-[14px] leading-[1.5] tracking-[-0.21px] whitespace-pre-wrap text-[var(--color-gray-600)]">
                    {block.text}
                  </p>
                </article>
              ))}
            </div>
          ) : transcript ? (
            <p className="text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-pre-wrap text-[var(--color-gray-600)]">
              {transcript}
            </p>
          ) : (
            <p className="text-[14px] text-[var(--color-gray-500)]">
              음성 기록이 없습니다.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default MeetingTranscriptPanel;
