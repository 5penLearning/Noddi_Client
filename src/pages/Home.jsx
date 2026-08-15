import { useState } from 'react';

import logo from '../assets/logo-green.svg';
import { homePageMockData } from '../mocks/homePageData';

import calendarArrowIcon from '../assets/icons/home-meeting/calendar-arrow.svg';
import meetingSymbolIcon from '../assets/icons/home-meeting/meeting-symbol.svg';
import meetingSymbolSecondaryIcon from '../assets/icons/home-meeting/meeting-symbol-secondary.svg';
import scheduleDotPrimaryIcon from '../assets/icons/home-meeting/schedule-dot-primary.svg';
import scheduleDotSecondaryIcon from '../assets/icons/home-meeting/schedule-dot-secondary.svg';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const formatDateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

function MeetingSchedule({ initialDate, meetings }) {
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

function AiReplyStatus({ replies }) {
  return (
    <section className="h-full overflow-hidden rounded-[10px] bg-[var(--color-white)] p-6">
      <h2 className="subhead-1">AI 답변 현황</h2>

      <div className="mt-5 divide-y divide-[var(--color-gray-100)]">
        {replies.map((reply) => (
          <article key={reply.id} className="py-6 first:pt-0">
            <div className="flex items-center gap-2">
              <span className="size-6 shrink-0 rounded-full bg-[var(--color-gray-200)]" />
              <p className="body-5 font-medium">{reply.name}</p>
              <p className="caption-1 text-[var(--color-text-tertiary)]">{reply.role}</p>
              <time className="caption-2 ml-auto whitespace-nowrap text-[var(--color-gray-800)]">
                {reply.time}
              </time>
            </div>
            <p className="body-5 mt-5">{reply.question}</p>
            <p className="body-5 mt-5 ml-auto max-w-[250px] text-right">{reply.answer}</p>
            <button
              type="button"
              className="body-5 mt-5 ml-auto block rounded-[10px] bg-[var(--color-background-subtle)] px-5 py-3"
            >
              자세히 보기
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function TodoList({ description, items }) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-[10px] bg-[var(--color-white)] p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="subhead-1">To-do list</h2>
          <p className="caption-1 mt-2 text-[var(--color-text-tertiary)]">{description}</p>
        </div>
        <button type="button" className="body-3">
          수정하기
        </button>
      </div>
      <div className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden">
        {items.map((item, index) =>
          item.title ? (
            <label
              key={item.id}
              className={`body-3 flex items-center gap-3 ${index === 0 ? 'mt-6' : 'mt-3'}`}
            >
              <input
                type="checkbox"
                defaultChecked={item.completed}
                className="size-6 appearance-none bg-[var(--color-gray-200)]"
              />
              {item.title}
            </label>
          ) : (
            <div key={item.id} className="mt-3 size-6 bg-[var(--color-gray-200)]" />
          ),
        )}
      </div>
    </section>
  );
}

function Home() {
  const { hero, meetingSchedule, aiReplies, todoList } = homePageMockData;

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto flex min-h-full w-full max-w-[1346px] flex-col gap-5">
        <section className="h-[183px] shrink-0 rounded-[10px] bg-[linear-gradient(180deg,#2affa3_0%,#37efd9_100%)] px-6 py-5 text-[var(--color-black)]">
          <img src={logo} alt="Noddi" className="h-auto w-[190px] brightness-0" />
          <p className="subhead-3 mt-2">{hero.tagline}</p>
        </section>

        <div className="grid min-h-[400px] flex-1 grid-cols-[minmax(0,818px)_minmax(370px,1fr)] gap-4">
          <div className="grid grid-rows-[auto_1fr] gap-3">
            <MeetingSchedule {...meetingSchedule} />
            <TodoList {...todoList} />
          </div>
          <AiReplyStatus replies={aiReplies} />
        </div>
      </div>
    </div>
  );
}

export default Home;
