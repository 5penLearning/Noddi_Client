const meetings = [
  {
    id: 1,
    time: '18시',
    title: '전체 회의',
    description: '회의 안건',
    project: '노디 프로젝트 / 마케팅팀',
    active: true,
  },
  {
    id: 2,
    time: '20시',
    title: '전체 회의',
    description: '18시 전체 회의',
    project: null,
    active: false,
  },
];

function MeetingScheduleList() {
  return (
    <section className="mt-5">
      <div className="max-h-[210px] space-y-2 overflow-y-auto pr-2">
        {meetings.map((meeting) => (
          <article
            key={meeting.id}
            className="flex items-start justify-between gap-5 border-b border-[#EDF0EF] px-4 py-4 last:border-none"
          >
            <div className="flex min-w-0 gap-4">
              <span
                className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${
                  meeting.active ? 'bg-[#F64E42]' : 'bg-[#D8DDDB]'
                }`}
              />

              <div className="min-w-0">
                {meeting.active && (
                  <p className="mb-1 text-xs font-medium text-[#F64E42]">
                    현재 진행 중이에요
                  </p>
                )}

                <p className="text-sm font-semibold text-[#101211]">
                  {meeting.time} {meeting.title}
                </p>

                <p className="mt-1 text-xs text-[#59625F]">
                  {meeting.description}
                </p>

                {meeting.project && (
                  <span className="mt-3 inline-block rounded border border-[#DCE2DF] px-2 py-1 text-[11px] text-[#7B8581]">
                    {meeting.project}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              disabled={!meeting.active}
              className={`shrink-0 rounded-lg border px-4 py-2.5 text-xs font-medium transition ${
                meeting.active
                  ? 'border-[#101211] bg-white text-[#101211] hover:bg-[#F5F7F6]'
                  : 'cursor-not-allowed border-transparent bg-[#E4E9E7] text-[#A7B0AC]'
              }`}
            >
              참여하러 가기
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MeetingScheduleList;
