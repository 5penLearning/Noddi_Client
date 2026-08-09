import logo from '../../assets/logo-green.svg';

const meetings = ['18시 전체 회의', '18시 전체 회의', '18시 전체 회의'];

const aiReplies = [
  { name: '홍길동', role: '디자인팀 과장', time: '08. 08 21:09' },
  { name: '홍길동', role: '디자인팀 과장', time: '08. 08 21:09' },
];

function MeetingSchedule() {
  return (
    <section className="min-h-0 rounded-[10px] bg-[var(--color-white)] p-6">
      <h2 className="body-3">오늘의 회의 일정</h2>

      <div className="mt-6 grid place-items-center bg-[var(--color-gray-200)] text-[12px] text-[var(--color-gray-800)] aspect-[1.26]">
        캘린더
      </div>

      <div className="mt-5 space-y-4 overflow-hidden">
        {meetings.map((meeting, index) => (
          <div key={`${meeting}-${index}`} className="flex items-center gap-3">
            <span className="size-3 shrink-0 rounded-full bg-[var(--color-gray-200)]" />
            <div className="min-w-0 flex-1">
              <p className="body-3 truncate">{meeting}</p>
              <p className="caption-2 mt-1 text-[var(--color-text-secondary)]">18시 전체 회의</p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-[8px] border border-[var(--color-gray-700)] px-3 py-2 text-xs text-[var(--color-gray-800)]"
            >
              참여하러 가기
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function AiReplyStatus() {
  return (
    <section className="min-h-0 rounded-[10px] bg-[var(--color-white)] p-6">
      <h2 className="body-3">AI 답변 현황</h2>

      <div className="mt-4 divide-y divide-[var(--color-gray-100)]">
        {aiReplies.map((reply, index) => (
          <article key={index} className="py-4 first:pt-0">
            <div className="flex items-center gap-2">
              <span className="size-5 rounded-full bg-[var(--color-gray-200)]" />
              <p className="caption-1 font-medium text-[var(--color-gray-800)]">{reply.name}</p>
              <p className="caption-2 text-[var(--color-text-tertiary)]">{reply.role}</p>
              <time className="ml-auto caption-2 text-[var(--color-gray-700)]">{reply.time}</time>
            </div>
            <p className="caption-2 mt-3 text-[var(--color-gray-800)]">어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구?</p>
            <p className="caption-2 mt-4 ml-auto max-w-[225px] text-right text-[var(--color-gray-800)]">
              어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구...
            </p>
            <button
              type="button"
              className="caption-2 mt-3 ml-auto block rounded-[8px] bg-[var(--color-background-subtle)] px-4 py-2 text-[var(--color-gray-800)]"
            >
              자세히 보기
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function NotificationBox() {
  return (
    <section className="min-h-0 rounded-[10px] bg-[var(--color-white)] p-6">
      <h2 className="body-3">알림함</h2>
      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="body-5 text-[var(--color-gray-800)]">팀으로 초대됐어요</p>
        <button type="button" className="body-5 text-[var(--color-gray-800)]">
          수락
        </button>
      </div>
    </section>
  );
}

function TodoList() {
  return (
    <section className="min-h-0 rounded-[10px] bg-[var(--color-white)] p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="body-3">To-do list</h2>
          <p className="caption-2 mt-1 text-[var(--color-text-tertiary)]">AI가 전날 회의록을 기반으로 만들었어요</p>
        </div>
        <button type="button" className="body-5 shrink-0 text-[var(--color-gray-800)]">
          수정하기
        </button>
      </div>
      <label className="mt-5 flex cursor-pointer items-center gap-3 body-5 text-[var(--color-gray-800)]">
        <input type="checkbox" className="size-5 appearance-none bg-[var(--color-gray-200)]" />
        세금 계산서 처리하기
      </label>
      <div className="mt-3 size-5 bg-[var(--color-gray-200)]" />
      <div className="mt-3 size-5 bg-[var(--color-gray-200)]" />
    </section>
  );
}

function HomeDashboard({ className = '' }) {
  return (
    <div className={`min-h-0 flex-1 overflow-auto bg-[var(--color-gray-100)] p-4 sm:p-6 ${className}`}>
      <div className="mx-auto flex min-h-full w-full max-w-[1100px] flex-col gap-4">
        <section className="rounded-[10px] bg-[linear-gradient(180deg,#2affa3_0%,#37efd9_100%)] px-10 py-7 text-[var(--color-black)]">
          <img src={logo} alt="Noddi" className="h-auto w-[174px] brightness-0" />
          <p className="subhead-4 mt-2">We weave teams into one context</p>
        </section>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_1.08fr]">
          <MeetingSchedule />
          <AiReplyStatus />
          <div className="grid min-h-0 gap-4 lg:grid-rows-[1.05fr_1fr]">
            <NotificationBox />
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeDashboard;
