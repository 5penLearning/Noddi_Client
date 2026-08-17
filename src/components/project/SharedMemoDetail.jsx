import backIcon from '../../assets/icons/meeting-records/shared-memo-back.svg';

function SharedMemoDetail({ memo, projectName, teamName, isLoading, errorMessage }) {
  if (isLoading) {
    return (
      <section className="flex h-full items-center justify-center rounded-[10px] bg-white text-[16px] text-[var(--color-gray-500)]">
        공유 메모를 불러오는 중입니다.
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="flex h-full items-center justify-center rounded-[10px] bg-white text-[16px] text-[var(--color-red)]">
        {errorMessage}
      </section>
    );
  }

  if (!memo) {
    return (
      <section className="flex h-full items-center justify-center rounded-[10px] bg-white text-[16px] text-[var(--color-gray-500)]">
        확인할 공유 메모를 선택해주세요.
      </section>
    );
  }

  return (
    <section className="h-full min-w-0 rounded-[10px] bg-white px-5 pt-[21px]">
      <div className="flex items-center gap-1 text-[16px] leading-[1.3] font-medium text-[var(--color-gray-900)]">
        <span className="flex size-6 items-center justify-center">
          <img src={backIcon} className="h-[14px] w-1.5" />
        </span>
        <span>
          {projectName} / {teamName}
        </span>
      </div>

      <article className="mt-[27px] px-[15px] text-black">
        <h2 className="text-[20px] leading-[1.3] font-medium">{memo.title}</h2>
        <p className="mt-3 text-[16px] leading-[1.4] tracking-[-0.16px] whitespace-pre-wrap">
          {memo.content}
        </p>
      </article>
    </section>
  );
}

export default SharedMemoDetail;
