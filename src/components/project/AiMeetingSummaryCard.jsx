function SummarySkeleton({ width }) {
  return (
    <span style={{ width }} className="block h-[11px] rounded-[4px] bg-[var(--color-gray-200)]" />
  );
}

function AiMeetingSummaryCard({ className = '' }) {
  return (
    <section
      className={`flex w-full flex-col gap-3 rounded-[6px] border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] p-3 ${className}`}
    >
      <header className="flex w-full items-center">
        <h2 className="body-3 text-[#1F2937]">AI 회의 요약</h2>
        <span className="ml-auto text-[11px] leading-none text-[#1F2937]">AI 생성</span>
      </header>

      <div className="flex flex-col gap-3">
        <SummarySkeleton width="109px" />
        <SummarySkeleton width="110px" />
        <SummarySkeleton width="111px" />
      </div>

      <div className="flex min-h-8 w-full flex-col gap-3 rounded-[6px] border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] p-3">
        <div className="flex items-center gap-2 text-[14px] leading-[1.4] tracking-[-0.21px] text-[#1F2937]">
          <span>⚠ 검토 필요</span>
          <span>아래 항목은 발화가 불명확해 내용을 확인하세요.</span>
        </div>
        <SummarySkeleton width="75px" />
      </div>
    </section>
  );
}

export default AiMeetingSummaryCard;
