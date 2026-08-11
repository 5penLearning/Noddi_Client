const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const DAYS = Array.from({ length: 31 }, (_, index) => index + 1);

function MeetingCalendar() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-[#101211]">캘린더</h2>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="rounded-md border border-[#D8DFDC] bg-white px-3 py-2 text-xs text-[#6D7572]"
          >
            전체
          </button>

          <button
            type="button"
            className="rounded-md border border-[#D8DFDC] bg-white px-3 py-2 text-xs text-[#6D7572]"
          >
            노디 프로젝트 / 마케팅팀
          </button>

          <button
            type="button"
            className="rounded-md border border-[#D8DFDC] bg-white px-3 py-2 text-xs text-[#6D7572]"
          >
            몰포 프로젝트 / 마케팅팀
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-[#F5F7F6] p-5">
        <div className="mb-5 text-center text-sm font-semibold text-[#101211]">
          8월
        </div>

        <div className="mb-3 grid grid-cols-7">
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-[#8A9490]"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={`empty-${index}`} />
          ))}

          {DAYS.map((day) => {
            const hasMeeting = day === 9 || day === 12 || day === 18;
            const selected = day === 9;

            return (
              <button
                key={day}
                type="button"
                className="group flex h-11 items-center justify-center"
              >
                <div
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm transition ${
                    selected
                      ? 'bg-white font-semibold text-[#101211] shadow-sm'
                      : 'text-[#59625F] group-hover:bg-white'
                  }`}
                >
                  {day}

                  {hasMeeting && (
                    <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#F64E42]" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MeetingCalendar;
