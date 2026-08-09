import logo from '../../assets/logo-green.svg';

const meetings = ['18시 전체 회의', '18시 전체 회의', '18시 전체 회의'];

const aiReplies = [
  { name: '홍길동', role: '디자인팀 과장', time: '08. 08 21:09' },
  { name: '홍길동', role: '디자인팀 과장', time: '08. 08 21:09' },
];

function MeetingSchedule() {
  return (
    <section className="relative h-[400px] overflow-hidden rounded-[10px] bg-[var(--color-white)]">
      <h2 className="subhead-1 absolute top-[23px] left-7">오늘의 회의 일정</h2>

      <div className="absolute top-[86px] left-[33px] grid h-[303px] w-[355px] place-items-center bg-[var(--color-gray-200)] body-5">
        캘린더
      </div>

      <div className="absolute top-[81px] left-[434px] w-[calc(100%-468px)]">
        {meetings.map((meeting, index) => (
          <article key={`${meeting}-${index}`} className={`relative h-[84px] ${index === 0 ? '' : index === 1 ? 'mt-[9px]' : ''}`}>
            <span className="absolute top-3 left-0 size-4 rounded-full bg-[var(--color-gray-200)]" />
            {index < meetings.length - 1 && <span className="absolute top-[38px] left-[7px] h-[55px] w-px bg-[var(--color-gray-800)]" />}
            <div className="pr-[130px] pl-8">
              <p className="subhead-1 whitespace-nowrap">{meeting}</p>
              <p className="body-4 mt-2 whitespace-nowrap">18시 전체 회의</p>
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

      <span className="absolute top-[83px] right-[14px] h-[122px] w-[3px] bg-[var(--color-gray-200)]" />
    </section>
  );
}

function AiReplyStatus() {
  return (
    <section className="h-full overflow-hidden rounded-[10px] bg-[var(--color-white)] p-6">
      <h2 className="subhead-1">AI 답변 현황</h2>

      <div className="mt-5 divide-y divide-[var(--color-gray-100)]">
        {aiReplies.map((reply, index) => (
          <article key={index} className="py-6 first:pt-0">
            <div className="flex items-center gap-2">
              <span className="size-6 shrink-0 rounded-full bg-[var(--color-gray-200)]" />
              <p className="body-5 font-medium">{reply.name}</p>
              <p className="caption-1 text-[var(--color-text-tertiary)]">{reply.role}</p>
              <time className="caption-2 ml-auto whitespace-nowrap text-[var(--color-gray-800)]">{reply.time}</time>
            </div>
            <p className="body-5 mt-5">어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구?</p>
            <p className="body-5 mt-5 ml-auto max-w-[250px] text-right">어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구...</p>
            <button type="button" className="body-5 mt-5 ml-auto block rounded-[10px] bg-[var(--color-background-subtle)] px-5 py-3">
              자세히 보기
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function TodoList() {
  return (
    <section className="h-full rounded-[10px] bg-[var(--color-white)] p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="subhead-1">To-do list</h2>
          <p className="caption-1 mt-2 text-[var(--color-text-tertiary)]">AI가 저번 회의록을 기반으로 만들었어요</p>
        </div>
        <button type="button" className="body-3">수정하기</button>
      </div>
      <label className="body-3 mt-6 flex items-center gap-3">
        <input type="checkbox" className="size-6 appearance-none bg-[var(--color-gray-200)]" />
        세금 계산서 처리하기
      </label>
      <div className="mt-3 size-6 bg-[var(--color-gray-200)]" />
      <div className="mt-3 size-6 bg-[var(--color-gray-200)]" />
    </section>
  );
}

function HomeDashboard({ className = '' }) {
  return (
    <div className={`h-full overflow-auto ${className}`}>
      <div className="mx-auto flex min-h-full w-[1204px] flex-col gap-5">
        <section className="h-[164px] shrink-0 rounded-[10px] bg-[linear-gradient(180deg,#2affa3_0%,#37efd9_100%)] px-6 py-5 text-[var(--color-black)]">
          <img src={logo} alt="Noddi" className="h-auto w-[190px] brightness-0" />
          <p className="subhead-3 mt-2">We weave teams into one context</p>
        </section>

        <div className="grid min-h-[400px] flex-1 grid-cols-[818px_370px] gap-4">
          <div className="grid grid-rows-[400px_1fr] gap-3">
            <MeetingSchedule />
            <TodoList />
          </div>
          <AiReplyStatus />
        </div>
      </div>
    </div>
  );
}

export default HomeDashboard;
