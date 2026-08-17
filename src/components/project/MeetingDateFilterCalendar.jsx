import { useEffect, useState } from 'react';

import calendarArrowIcon from '../../assets/icons/home-meeting/calendar-arrow.svg';
import scheduleDotPrimaryIcon from '../../assets/icons/home-meeting/schedule-dot-primary.svg';
import scheduleDotSecondaryIcon from '../../assets/icons/home-meeting/schedule-dot-secondary.svg';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const formatDateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

function MeetingDateFilterCalendar({ selectedDate, meetingDates, onSelect, className = '' }) {
  const initialDate = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1),
  );

  useEffect(() => {
    if (!selectedDate) return;

    const nextSelectedDate = new Date(`${selectedDate}T00:00:00`);
    setVisibleMonth(new Date(nextSelectedDate.getFullYear(), nextSelectedDate.getMonth(), 1));
  }, [selectedDate]);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  const meetingCountByDate = meetingDates.reduce((dateCounts, date) => {
    dateCounts[date] = (dateCounts[date] ?? 0) + 1;

    return dateCounts;
  }, {});

  const moveMonth = (direction) => {
    setVisibleMonth(new Date(year, month + direction, 1));
  };

  return (
    <div className={`w-[392px] rounded-[30px] bg-[#f5f7f6] p-5 ${className}`}>
      <div className="flex h-[42px] items-center justify-center gap-2 py-2">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          className="flex size-6 items-center justify-center"
        >
          <img
            src={calendarArrowIcon}
            className="h-[7px] w-[15px] -rotate-90 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(86%)_saturate(1165%)_hue-rotate(91deg)_brightness(101%)_contrast(92%)]"
          />
        </button>
        <strong className="text-[20px] leading-[1.3] font-semibold text-black">
          {month + 1}월 {year}
        </strong>
        <button
          type="button"
          onClick={() => moveMonth(1)}
          className="flex size-6 items-center justify-center"
        >
          <img
            src={calendarArrowIcon}
            className="h-[7px] w-[15px] rotate-90 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(86%)_saturate(1165%)_hue-rotate(91deg)_brightness(101%)_contrast(92%)]"
          />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7 text-center text-[13px] leading-[18px] font-semibold tracking-[-0.08px] text-[rgba(60,60,67,0.3)]">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="mt-[5px] grid grid-cols-7 gap-y-3">
        {calendarDays.map((day, index) => {
          const dateKey = day ? formatDateKey(year, month, day) : '';
          const isSelected = Boolean(day) && dateKey === selectedDate;
          const meetingCount = meetingCountByDate[dateKey] ?? 0;

          return (
            <button
              key={`${dateKey}-${index}`}
              type="button"
              disabled={!day}
              onClick={() => onSelect(isSelected ? '' : dateKey)}
              className={`relative mx-auto flex size-10 items-center justify-center rounded-full text-[20px] leading-[1.4] tracking-[-0.1px] ${
                isSelected
                  ? 'bg-[var(--color-primary)] font-medium text-white'
                  : 'font-normal text-[var(--color-black)]'
              }`}
            >
              {day}
              {meetingCount > 0 && !isSelected && (
                <span className="absolute top-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                  <img src={scheduleDotPrimaryIcon} className="size-1" />
                  {meetingCount > 1 && <img src={scheduleDotSecondaryIcon} className="size-1" />}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MeetingDateFilterCalendar;
