import { ProfileChip } from './MeetingParticipants';

function EmptyText({ children }) {
  return <p className="text-[14px] text-[var(--color-gray-500)]">{children}</p>;
}

function MeetingAiResult({ summaryData }) {
  const keywords = summaryData?.keywords ?? [];
  const decisions = summaryData?.decisions ?? [];
  const actionItems = summaryData?.actionItems ?? [];

  return (
    <section className="min-w-0 flex-1">
      <div className="grid grid-cols-[300px_minmax(0,1fr)] gap-6">
        <div>
          <h2 className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[var(--color-gray-900)]">
            주요 키워드
          </h2>
          <div className="mt-4 flex flex-wrap gap-1">
            {keywords.length > 0 ? (
              keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-[10px] bg-[#e8fff5] px-[10px] py-[5px] text-[14px] leading-[1.3] tracking-[-0.28px] text-[var(--color-primary-700,#11e489)]"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <EmptyText>추출된 키워드가 없습니다.</EmptyText>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[var(--color-gray-900)]">
            AI 회의 요약
          </h2>
          {summaryData?.summary ? (
            <p className="mt-4 text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-pre-wrap text-[var(--color-gray-800)]">
              {summaryData.summary}
            </p>
          ) : (
            <div className="mt-4">
              <EmptyText>생성된 AI 회의 요약이 없습니다.</EmptyText>
            </div>
          )}

          <h2 className="mt-8 text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[var(--color-gray-900)]">
            주요 결정 사항
          </h2>
          {decisions.length > 0 ? (
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-[14px] leading-[1.4] tracking-[-0.21px] text-[var(--color-gray-800)]">
              {decisions.map((decision, index) => (
                <li key={`${decision}-${index}`}>{decision}</li>
              ))}
            </ol>
          ) : (
            <div className="mt-3">
              <EmptyText>등록된 결정 사항이 없습니다.</EmptyText>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 ml-[324px]">
        <h2 className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[var(--color-gray-900)]">
          담당자별 할 일
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {actionItems.length > 0 ? (
            actionItems.map((item) => (
              <ProfileChip
                key={item.actionItemId ?? item.id ?? item.content}
                participant={{
                  name: item.assigneeName ?? '담당자 미정',
                  role: item.content,
                }}
                muted={item.status === 'COMPLETED'}
              />
            ))
          ) : (
            <EmptyText>등록된 할 일이 없습니다.</EmptyText>
          )}
        </div>
      </div>
    </section>
  );
}

export default MeetingAiResult;
