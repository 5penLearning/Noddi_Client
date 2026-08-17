import logoSimpleIcon from '../../assets/icons/sidebar/logo-simple.svg';

function MeetingTranscriptPanel({ transcript, participants }) {
  const paragraphs = transcript
    ? transcript.split(/\n{2,}/).filter((paragraph) => paragraph.trim())
    : [];

  return (
    <aside className="w-[300px] shrink-0">
      <h2 className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[var(--color-gray-900)]">
        음성 기록
      </h2>
      <div className="mt-4 max-h-[443px] [scrollbar-width:thin] [scrollbar-color:#d9d9d9_transparent] overflow-y-auto pr-5">
        {paragraphs.length > 0 ? (
          <div className="space-y-6">
            {paragraphs.map((paragraph, index) => {
              const participant = participants[index % Math.max(participants.length, 1)];

              return (
                <article key={`${paragraph.slice(0, 20)}-${index}`}>
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-full border-[0.5px] border-[var(--color-gray-200)] bg-[var(--color-gray-100)]">
                      <img src={logoSimpleIcon} className="h-[14px] w-[11px] opacity-30" />
                    </span>
                    <strong className="text-[16px] leading-[1.3] font-medium text-black">
                      {participant?.name ?? '참석자'}
                    </strong>
                  </div>
                  <p className="mt-2 ml-8 text-[14px] leading-[1.3] tracking-[-0.28px] whitespace-pre-wrap text-[var(--color-gray-600)]">
                    {paragraph}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="text-[14px] text-[var(--color-gray-500)]">음성 기록이 없습니다.</p>
        )}
      </div>
    </aside>
  );
}

export default MeetingTranscriptPanel;
