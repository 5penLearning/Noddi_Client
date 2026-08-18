import MeetingAiResult from '../MeetingAiResult';
import MeetingTranscriptPanel from '../MeetingTranscriptPanel';

function MeetingRecordDetailContent({
  summary,
  meetingId,
  participants,
  isEditing,
  editForm,
  setEditForm,
}) {
  return (
    <div className="mt-6 grid grid-cols-[310px_minmax(0,1fr)] items-start gap-6 px-[29px] pb-8">
      <aside className="min-w-0">
        <section>
          <h2 className="text-[16px] leading-[1.3] font-semibold text-[var(--color-gray-900)]">
            주요 이슈
          </h2>
          <div className="mt-4 flex flex-wrap gap-1">
            {isEditing ? (
              <IssueEditor
                issues={editForm.issues}
                onChange={(issues) => setEditForm((form) => ({ ...form, issues }))}
              />
            ) : (summary.keywords ?? []).length > 0 ? (
              summary.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-[10px] bg-[#e8fff5] px-[10px] py-[5px] text-[14px] leading-[1.3] tracking-[-0.28px] text-[var(--color-primary-700,#11e489)]"
                >
                  {keyword}
                </span>
              ))
            ) : (
              <p className="text-[14px] text-[var(--color-gray-500)]">
                등록된 주요 이슈가 없습니다.
              </p>
            )}
          </div>
        </section>

        <div className="mt-8">
          <MeetingTranscriptPanel transcript={summary.rawTranscript ?? ''} />
        </div>
      </aside>

      <MeetingAiResult
        summaryData={summary}
        meetingId={meetingId}
        participants={participants}
        isEditing={isEditing}
        editForm={editForm}
        onSummaryChange={(value) => setEditForm((form) => ({ ...form, summary: value }))}
        onDecisionChange={(index, value) =>
          setEditForm((form) => ({
            ...form,
            decisions: form.decisions.map((item, itemIndex) =>
              itemIndex === index ? value : item,
            ),
          }))
        }
        onAddDecision={() =>
          setEditForm((form) => ({ ...form, decisions: [...form.decisions, ''] }))
        }
        onRemoveDecision={(index) =>
          setEditForm((form) => ({
            ...form,
            decisions: form.decisions.filter((_, itemIndex) => itemIndex !== index),
          }))
        }
      />
    </div>
  );
}

function IssueEditor({ issues, onChange }) {
  return (
    <div className="w-full space-y-2">
      {issues.map((issue, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={issue}
            onChange={(event) =>
              onChange(
                issues.map((item, itemIndex) =>
                  itemIndex === index ? event.target.value : item,
                ),
              )
            }
            placeholder="주요 이슈를 입력해주세요."
            className="h-10 min-w-0 flex-1 rounded-[8px] border border-[var(--color-gray-300)] bg-[var(--color-gray-50)] px-3 text-[14px] outline-none focus:border-[var(--color-primary)] focus:bg-white"
          />
          <button
            type="button"
            onClick={() => onChange(issues.filter((_, itemIndex) => itemIndex !== index))}
            className="size-8 shrink-0 text-[18px] text-[var(--color-gray-500)]"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...issues, ''])}
        className="text-[13px] text-[var(--color-gray-600)]"
      >
        + 항목 추가
      </button>
    </div>
  );
}

export default MeetingRecordDetailContent;
