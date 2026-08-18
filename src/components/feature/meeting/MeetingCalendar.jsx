import scheduleDotPrimary from '../../../assets/icons/home-meeting/schedule-dot-primary.svg';
import scheduleDotSecondary from '../../../assets/icons/home-meeting/schedule-dot-secondary.svg';

const WEEK_DAYS = [
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
];

function formatDateKey(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getCalendarDates(
  viewDate,
) {
  const year =
    viewDate.getFullYear();

  const month =
    viewDate.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1,
    ).getDay();

  const lastDate =
    new Date(
      year,
      month + 1,
      0,
    ).getDate();

  const cells = [];

  for (
    let index = 0;
    index < firstDay;
    index += 1
  ) {
    cells.push(null);
  }

  for (
    let day = 1;
    day <= lastDate;
    day += 1
  ) {
    cells.push(
      new Date(
        year,
        month,
        day,
      ),
    );
  }

  return cells;
}

function CalendarIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 3V7M16 3V7M4 10H20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MeetingCalendar({
  selectedDate,
  onSelectDate,
  viewDate,
  onChangeViewDate,
  meetings = [],
  filterOptions = [],
  selectedFilter,
  onChangeFilter,
}) {
  const calendarDates =
    getCalendarDates(viewDate);

  const selectedDateKey =
    formatDateKey(selectedDate);

  const moveMonth = (
    amount,
  ) => {
    onChangeViewDate(
      new Date(
        viewDate.getFullYear(),
        viewDate.getMonth() +
        amount,
        1,
      ),
    );
  };

  const getMeetingsByDate = (
    date,
  ) => {
    const dateKey =
      formatDateKey(date);

    return meetings.filter(
      (meeting) =>
        meeting.date === dateKey,
    );
  };

  return (
    <div>
      <div className="flex items-center gap-2.5 text-[#101211]">
        <CalendarIcon />

        <h2 className="text-[17px] font-semibold">
          내 회의 일정
        </h2>
      </div>

      <div className="mt-5 flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() =>
            moveMonth(-1)
          }
          className="text-[24px] font-light leading-none text-[#ABB4B0] transition-colors hover:text-[#31F5A0] active:text-[#31F5A0]"
          aria-label="이전 달"
        >
          ‹
        </button>

        <strong className="min-w-[110px] text-center text-[16px] font-semibold text-[#101211]">
          {viewDate.getMonth() +
            1}
          월{' '}
          {viewDate.getFullYear()}
        </strong>

        <button
          type="button"
          onClick={() =>
            moveMonth(1)
          }
          className="text-[24px] font-light leading-none text-[#ABB4B0] transition-colors hover:text-[#31F5A0] active:text-[#31F5A0]"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7">
        {WEEK_DAYS.map(
          (weekDay) => (
            <div
              key={weekDay}
              className="flex h-8 items-center justify-center text-[10px] font-medium text-[#B7BFBC]"
            >
              {weekDay}
            </div>
          ),
        )}
      </div>

      <div className="grid grid-cols-7">
        {calendarDates.map(
          (
            calendarDate,
            index,
          ) => {
            if (!calendarDate) {
              return (
                <div
                  key={`empty-${index}`}
                  className="h-[47px]"
                />
              );
            }

            const dateKey =
              formatDateKey(
                calendarDate,
              );

            const isSelected =
              dateKey ===
              selectedDateKey;

            const dayMeetings =
              getMeetingsByDate(
                calendarDate,
              );

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() =>
                  onSelectDate(
                    calendarDate,
                  )
                }
                className="relative flex h-[47px] items-center justify-center"
              >
                <span
                  className={`flex h-[36px] w-[36px] items-center justify-center rounded-full text-[14px] font-medium transition ${isSelected
                    ? 'bg-[#31F5A0] font-semibold text-white'
                    : 'text-[#303633] hover:bg-[#F2F7F5]'
                    }`}
                >
                  {calendarDate.getDate()}
                </span>

                {dayMeetings.length >
                  0 &&
                  !isSelected && (
                    <span className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-[3px]">
                      <img
                        src={
                          scheduleDotPrimary
                        }
                        alt=""
                        className="h-[5px] w-[5px]"
                      />

                      {dayMeetings.length >
                        1 && (
                          <img
                            src={
                              scheduleDotSecondary
                            }
                            alt=""
                            className="h-[5px] w-[5px]"
                          />
                        )}
                    </span>
                  )}
              </button>
            );
          },
        )}
      </div>

      <div className="mt-5 border-t border-[#E8ECEA] pt-4">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map(
            (filter) => {
              const isSelected =
                selectedFilter ===
                filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() =>
                    onChangeFilter(
                      filter.id,
                    )
                  }
                  className={`rounded-[6px] px-2.5 py-1.5 text-[11px] font-medium transition ${isSelected
                    ? 'bg-[#101211] text-white'
                    : 'bg-[#F0F3F2] text-[#6F7975] hover:bg-[#E6ECE9]'
                    }`}
                >
                  {filter.label}
                </button>
              );
            },
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetingCalendar;
