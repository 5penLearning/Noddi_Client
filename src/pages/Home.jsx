import { useEffect, useRef, useState } from 'react';
import logo from '../assets/logo-green.svg';
import { homePageMockData } from '../mocks/homePageData';

function MeetingSchedule({ calendarLabel, meetings }) {
  const meetingListRef = useRef(null);
  const [scrollbar, setScrollbar] = useState({ height: 122, top: 0 });

  const updateScrollbar = () => {
    const list = meetingListRef.current;
    if (!list) return;

    const trackHeight = 306;
    const height = Math.max(48, trackHeight * (list.clientHeight / list.scrollHeight));
    const maxScrollTop = list.scrollHeight - list.clientHeight;
    const top = maxScrollTop > 0 ? (list.scrollTop / maxScrollTop) * (trackHeight - height) : 0;

    setScrollbar({ height, top });
  };

  useEffect(() => {
    updateScrollbar();
  }, [meetings]);

  return (
    <section className="relative h-[400px] overflow-hidden rounded-[10px] bg-[var(--color-white)]">
      <h2 className="subhead-1 absolute top-[23px] left-7">오늘의 회의 일정</h2>

      <div className="body-5 absolute top-[86px] left-[33px] grid h-[303px] w-[355px] place-items-center bg-[var(--color-gray-200)]">
        {calendarLabel}
      </div>

      <div
        ref={meetingListRef}
        onScroll={updateScrollbar}
        className="absolute top-[81px] right-[28px] bottom-[11px] left-[434px] [scrollbar-width:none] overflow-y-auto pr-4 [&::-webkit-scrollbar]:hidden"
      >
        {meetings.map((meeting, index) => (
          <article
            key={meeting.id}
            className="relative h-[84px] last:h-[60px] [&:not(:first-child)]:mt-[9px]"
          >
            {index > 0 && (
              <span className="absolute top-[-9px] left-[7px] h-[11px] w-px bg-[var(--color-gray-800)]" />
            )}
            {index < meetings.length - 1 && (
              <span className="absolute top-[38px] bottom-[-9px] left-[7px] w-px bg-[var(--color-gray-800)]" />
            )}
            <span className="absolute top-3 left-0 size-4 rounded-full bg-[var(--color-gray-200)]" />
            <div className="pr-[130px] pl-8">
              <p className="subhead-1 whitespace-nowrap">{meeting.title}</p>
              <p className="body-4 mt-2 whitespace-nowrap">{meeting.time}</p>
            </div>
            <button
              type="button"
              className="body-3 absolute top-[6px] right-0 flex h-[45px] w-[114px] items-center justify-center rounded-[10px] border border-[var(--color-black)]"
            >
              참여하러 가기
            </button>
          </article>
        ))}
      </div>

      <span className="absolute top-[83px] right-[14px] h-[306px] w-[3px] bg-[var(--color-gray-50)]">
        <span
          className="absolute left-0 w-[3px] bg-[var(--color-gray-200)]"
          style={{ height: scrollbar.height, transform: `translateY(${scrollbar.top}px)` }}
        />
      </span>
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
          <div className="grid grid-rows-[400px_1fr] gap-3">
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
