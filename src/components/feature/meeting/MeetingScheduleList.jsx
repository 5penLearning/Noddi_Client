import {
  formatMeetingTime,
  getMeetingStatus,
} from '../../../utils/meeting';

const WEEK_DAYS = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

function MeetingScheduleList({
  meetings,
  selectedDate,
  now,
}) {
  const month = selectedDate.getMonth() + 1;
  const date = selectedDate.getDate();
  const day = WEEK_DAYS[selectedDate.getDay()];

  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#101211]">
          {month}월 {date}일 {day}
        </p>

        <span className="text-xs text-[#8A9490]">
          {meetings.length}개의 회의
        </span>
      </div>

      {meetings.length === 0 ? (
        <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-[#EDF0EF]">
          <p className="text-sm text-[#8A9490]">
            예정된 회의가 없습니다.
          </p>
        </div>
      ) : (
        <div className="max-h-[240px] space-y-2 overflow-y-auto pr-2">
          {meetings.map((meeting) => {
            const status = getMeetingStatus(meeting, now);

            const isInProgress =
              status === 'IN_PROGRESS';

            const isEnded = status === 'ENDED';

            return (
              <article
                key={meeting.id}
                className="flex items-start justify-between gap-5 border-b border-[#EDF0EF] px-4 py-4 last:border-none"
              >
                <div className="flex min-w-0 gap-4">
                  <span
                    className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${
                      isInProgress
                        ? 'bg-[#F64E42]'
                        : 'bg-[#D8DDDB]'
                    }`}
                  />

                  <div className="min-w-0">
                    {isInProgress && (
                      <p className="mb-1 text-xs font-medium text-[#F64E42]">
                        현재 진행 중이에요
                      </p>
                    )}

                    {isEnded && (
                      <p className="mb-1 text-xs font-medium text-[#8A9490]">
                        종료된 회의예요
                      </p>
                    )}

                    <p className="text-sm font-semibold text-[#101211]">
                      {formatMeetingTime(
                        meeting.startTime,
                      )}{' '}
                      {meeting.title}
                    </p>

                    <p className="mt-1 text-xs text-[#59625F]">
                      {meeting.description}
                    </p>

                    <span className="mt-3 inline-block rounded border border-[#DCE2DF] px-2 py-1 text-[11px] text-[#7B8581]">
                      {meeting.project} / {meeting.team}
                    </span>
                  </div>
                </div>

                {isInProgress ? (
                  <button
                    type="button"
                    className="shrink-0 rounded-lg border border-[#101211] bg-white px-4 py-2.5 text-xs font-medium text-[#101211] transition hover:bg-[#F5F7F6]"
                  >
                    참여하러 가기
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed shrink-0 rounded-lg bg-[#E4E9E7] px-4 py-2.5 text-xs font-medium text-[#A7B0AC]"
                  >
                    {isEnded ? '종료됨' : '참여 예정'}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MeetingScheduleList;
