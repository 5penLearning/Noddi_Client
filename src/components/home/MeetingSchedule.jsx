import { useState } from 'react';

import calendarArrowIcon from '../../assets/icons/home-meeting/calendar-arrow.svg';
import meetingSymbolIcon from '../../assets/icons/home-meeting/meeting-symbol.svg';
import meetingSymbolSecondaryIcon from '../../assets/icons/home-meeting/meeting-symbol-secondary.svg';
import scheduleDotPrimaryIcon from '../../assets/icons/home-meeting/schedule-dot-primary.svg';
import scheduleDotSecondaryIcon from '../../assets/icons/home-meeting/schedule-dot-secondary.svg';
import { formatDateKey } from './homeUtils';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function MeetingSchedule({
  initialDate,
  meetings,
  isLoading,
  errorMessage,
  onJoin,
}) {
  const initial = new Date(`${initialDate}T00:00:00`);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(initial.getFullYear(), initial.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarWeekCount = Math.ceil((firstDay + daysInMonth) / 7);
  const isLongMonth = calendarWeekCount === 6;
  const calendarDays = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const selectedMeetings = meetings.filter((meeting) => meeting.date === selectedDate);
  const meetingCountByDate = meetings.reduce((counts, meeting) => {
    counts[meeting.date] = (counts[meeting.date] ?? 0) + 1;

    return counts;
  }, {});
  const selected = new Date(`${selectedDate}T00:00:00`);
  const selectedDateLabel = `${String(selected.getMonth() + 1).padStart(2, '0')}월 ${String(selected.getDate()).padStart(2, '0')}일(${selected.toLocaleDateString('ko-KR', { weekday: 'short' })})`;

  const moveMonth = (direction) => {
    setVisibleMonth(new Date(year, month + direction, 1));
  };

  return (
    <section
      className={`${isLongMonth ? 'h-[448px]' : 'h-[400px]'} overflow-hidden rounded-[10px] bg-[var(--color-white)] p-5`}
    >
      <div className="flex items-end gap-[9px]">
        <h2 className="text-[20px] leading-[1.3] font-semibold">회의 일정</h2>
        <p className="body-3 text-[var(--color-gray-500)]">
          캘린더의 날짜를 눌러 일정을 체크해보세요.
        </p>
      </div>

      <div className={`mt-4 flex gap-5 ${isLongMonth ? 'h-[354px]' : 'h-[306px]'}`}>
        <div className="w-[319px] shrink-0">
          <div className="flex h-10 items-center justify-center gap-2 py-2">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="flex size-6 items-center justify-center"
            >
              <img
                src={calendarArrowIcon}
                className="h-[7.12px] w-[15.5px] -rotate-90 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(86%)_saturate(1165%)_hue-rotate(91deg)_brightness(101%)_contrast(92%)]"
              />
            </button>
            <span className="text-[16px] leading-[1.3] font-medium text-[var(--color-black)]">
              {month + 1}월 {year}
            </span>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="flex size-6 items-center justify-center"
            >
              <img
                src={calendarArrowIcon}
                className="h-[7.12px] w-[15.5px] rotate-90 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(86%)_saturate(1165%)_hue-rotate(91deg)_brightness(101%)_contrast(92%)]"
              />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 text-center text-[13px] leading-[18px] font-semibold text-[rgba(60,60,67,0.3)]">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>
          <div className="mt-[5px] grid grid-cols-7 gap-y-2">
            {calendarDays.map((day, index) => {
              const dateKey = day ? formatDateKey(year, month, day) : '';
              const isSelected = dateKey === selectedDate;
              const meetingCount = meetingCountByDate[dateKey] ?? 0;

              return (
                <button
                  key={`${dateKey}-${index}`}
                  type="button"
                  disabled={!day}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`relative mx-auto flex size-10 items-center justify-center rounded-full text-[20px] leading-[1.4] ${isSelected ? 'bg-[var(--color-action-primary)] font-medium text-white' : 'text-[var(--color-black)]'}`}
                >
                  {day}
                  {meetingCount > 0 && !isSelected && (
                    <span className="absolute top-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                      <img src={scheduleDotPrimaryIcon} className="size-1" />
                      {meetingCount > 1 && (
                        <img src={scheduleDotSecondaryIcon} className="size-1" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-full w-px shrink-0 bg-[var(--color-gray-100)]" />

        <div className="min-w-0 flex-1">
          <div className="flex gap-2">
            <span className="body-3 text-[var(--color-gray-800)]">{selectedDateLabel}</span>
            <span className="body-4 text-[var(--color-gray-500)]">{selectedMeetings.length}개</span>
          </div>
          <div
            className={`mt-2 [scrollbar-width:none] overflow-y-auto px-1 py-5 pr-4 [&::-webkit-scrollbar]:hidden ${isLongMonth ? 'h-[311px]' : 'h-[263px]'}`}
          >
            {isLoading && (
              <p className="py-10 text-center text-[14px] text-[var(--color-gray-500)]">
                회의 일정을 불러오는 중입니다.
              </p>
            )}
            {!isLoading && errorMessage && (
              <p className="py-10 text-center text-[14px] text-[var(--color-gray-500)]">
                {errorMessage}
              </p>
            )}
            {!isLoading && !errorMessage && selectedMeetings.length === 0 && (
              <p className="py-10 text-center text-[14px] text-[var(--color-gray-500)]">
                선택한 날짜에 회의가 없습니다.
              </p>
            )}
            {selectedMeetings.map((meeting, index) => (
              <article
                key={meeting.id}
                className="relative flex min-h-[103px] justify-between pb-6"
              >
                {index < selectedMeetings.length - 1 && (
                  <span className="absolute top-[26px] bottom-0 left-[12px] border-l border-dashed border-[var(--color-gray-300)]" />
                )}
                <img
                  src={meeting.isOngoing ? meetingSymbolIcon : meetingSymbolSecondaryIcon}
                  className="mt-0.5 h-5 w-[25px] shrink-0"
                />
                <div className="ml-3 min-w-0 flex-1">
                  {meeting.isOngoing && (
                    <p className="caption-1 text-[#11e489]">현재 진행중이에요</p>
                  )}
                  <p className="body-3 mt-0.5 truncate">
                    <span className="mr-1">{meeting.time}</span>
                    {meeting.title}
                  </p>
                  <p className="caption-1 mt-1 text-[var(--color-gray-600)]">
                    {meeting.projectName}
                  </p>
                  <div className="mt-4 flex gap-1">
                    {meeting.teams.map((team) => (
                      <span
                        key={team}
                        className="caption-1 rounded-[4px] border border-[var(--color-gray-200)] px-1.5 py-1 text-[var(--color-gray-600)]"
                      >
                        {team}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!meeting.canJoin}
                  onClick={() => onJoin(meeting)}
                  className="ml-3 h-11 w-[110px] shrink-0 rounded-[10px] bg-[var(--color-action-primary)] text-[16px] leading-[1.3] font-semibold disabled:bg-[var(--color-gray-100)] disabled:text-[var(--color-gray-300)]"
                >
                  참여하기
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
