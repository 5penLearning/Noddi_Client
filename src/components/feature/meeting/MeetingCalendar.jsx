import { formatDateKey, isSameDate } from '../../../utils/date';

function ChevronLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function MeetingCalendar({
  selectedDate,
  onSelectDate,
  viewDate,
  onChangeViewDate,
  meetings,
  filterOptions,
  selectedFilter,
  onChangeFilter,
}) {
  const today = new Date();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const movePreviousMonth = () => {
    onChangeViewDate(new Date(year, month - 1, 1));
  };

  const moveNextMonth = () => {
    onChangeViewDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day) => {
    onSelectDate(new Date(year, month, day));
  };

  const hasMeetingOnDate = (date) => {
    const dateKey = formatDateKey(date);

    return meetings.some((meeting) => meeting.date === dateKey);
  };

  return (
    <section>
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 className="shrink-0 text-lg font-semibold text-[#101211]">
          캘린더
        </h2>

        <div className="flex flex-wrap justify-end gap-2">
          {filterOptions.map((filter) => {
            const isSelected = selectedFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => onChangeFilter(filter.id)}
                className={`rounded-md border px-3 py-2 text-xs font-medium transition ${
                  isSelected
                    ? 'border-[#101211] bg-[#101211] text-white'
                    : 'border-[#D8DFDC] bg-white text-[#6D7572] hover:border-[#AEB7B3] hover:text-[#101211]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl bg-[#F5F7F6] p-5">
        <div className="mb-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={movePreviousMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#59625F] transition hover:bg-white hover:text-[#101211]"
            aria-label="이전 달"
          >
            <ChevronLeftIcon />
          </button>

          <p className="min-w-[100px] text-center text-sm font-semibold text-[#101211]">
            {year}년 {month + 1}월
          </p>

          <button
            type="button"
            onClick={moveNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#59625F] transition hover:bg-white hover:text-[#101211]"
            aria-label="다음 달"
          >
            <ChevronRightIcon />
          </button>
        </div>

        <div className="mb-3 grid grid-cols-7">
          {WEEK_DAYS.map((day, index) => (
            <div
              key={day}
              className={`text-center text-xs font-medium ${
                index === 0
                  ? 'text-[#F64E42]'
                  : index === 6
                    ? 'text-[#75807C]'
                    : 'text-[#8A9490]'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-2">
          {Array.from({ length: firstDay }).map((_, index) => (
            <div key={`empty-${index}`} className="h-11" />
          ))}

          {Array.from({ length: lastDate }, (_, index) => {
            const day = index + 1;
            const date = new Date(year, month, day);

            const isToday = isSameDate(date, today);
            const isSelected = isSameDate(date, selectedDate);
            const hasMeeting = hasMeetingOnDate(date);

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDateClick(day)}
                className="group flex h-11 items-center justify-center"
              >
                <span
                  className={[
                    'relative flex h-9 w-9 items-center justify-center rounded-full text-sm transition',
                    isSelected
                      ? 'bg-[#101211] font-semibold text-white'
                      : isToday
                        ? 'bg-[#31F5A0] font-semibold text-[#101211]'
                        : 'text-[#59625F] group-hover:bg-white',
                  ].join(' ')}
                >
                  {day}

                  {hasMeeting && (
                    <span
                      className={`absolute bottom-0.5 h-1 w-1 rounded-full ${
                        isSelected ? 'bg-[#31F5A0]' : 'bg-[#F64E42]'
                      }`}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MeetingCalendar;
