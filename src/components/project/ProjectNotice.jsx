function ProjectNotice({
  notices,
  isLoading = false,
  errorMessage = '',
  onCreateClick,
  onDetailClick,
  className = '',
}) {
  const currentNotice = notices[0];

  return (
    <section className={className}>
      <h2 className="subhead-1 text-[var(--color-black)]">전체 공지</h2>

      {isLoading && (
        <p className="body-4 mt-[17px] py-[23px] text-[var(--color-gray-500)]">
          공지를 불러오는 중입니다.
        </p>
      )}

      {!isLoading && errorMessage && (
        <p className="body-4 mt-[17px] py-[23px] text-[var(--color-red)]">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && !currentNotice && (
        <p className="body-4 mt-[17px] py-[23px] text-[var(--color-gray-500)]">
          등록된 공지가 없습니다.
        </p>
      )}

      {!isLoading && !errorMessage && currentNotice && (
        <article className="mt-[17px] flex h-[97px] w-full items-center justify-between rounded-[10px] border border-[var(--color-gray-200)] p-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-7 shrink-0 items-center justify-center rounded-[4px] border border-[var(--color-gray-200)] bg-white px-[6px] py-[5px] text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-nowrap text-[var(--color-gray-600)]">
              {currentNotice.teamName}
            </span>

            <div className="flex min-w-0 flex-col gap-1 py-1">
              <h3 className="truncate text-[16px] leading-[1.3] font-medium text-[var(--color-gray-700)]">
                {currentNotice.title}
              </h3>
              <p className="truncate text-[16px] leading-[1.4] tracking-[-0.16px] text-[var(--color-gray-500)]">
                {currentNotice.content}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onDetailClick?.(currentNotice.id)}
            className="ml-5 shrink-0 text-[16px] leading-[1.3] font-medium whitespace-nowrap text-[var(--color-gray-500)]"
          >
            자세히 보기
          </button>
        </article>
      )}

      <div className="mt-[10px] flex justify-end">
        <button
          type="button"
          onClick={onCreateClick}
          className="text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-nowrap text-[var(--color-gray-700)] underline"
        >
          공지 추가
        </button>
      </div>
    </section>
  );
}

export default ProjectNotice;
