import folderIcon from '../../assets/icons/meeting-records/shared-memo-folder.svg';
import folderLineIcon from '../../assets/icons/meeting-records/shared-memo-folder-line.svg';
import searchIcon from '../../assets/icons/meeting-records/shared-memo-search.svg';

function SharedMemoFolderIcon() {
  return (
    <span className="relative block size-6 shrink-0">
      <img src={folderIcon} className="absolute top-[3px] left-0.5 h-[18px] w-5" />
      <img src={folderLineIcon} className="absolute top-4 left-3 h-px w-1.5" />
    </span>
  );
}

function SharedMemoList({
  memos,
  keyword,
  selectedMemoId,
  isLoading,
  isCreating,
  errorMessage,
  onKeywordChange,
  onSelect,
  onCreate,
}) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const visibleMemos = memos.filter((memo) =>
    `${memo.title ?? ''} ${memo.authorName ?? ''}`.toLowerCase().includes(normalizedKeyword),
  );

  return (
    <section className="h-full min-w-0 rounded-[10px] bg-white px-5 pt-[19px]">
      <div className="flex items-center gap-2">
        <label className="flex h-11 min-w-0 flex-1 items-center justify-between rounded-[10px] border border-[var(--color-gray-200)] px-3">
          <input
            type="search"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="회의록 내용을 검색해보세요"
            className="min-w-0 flex-1 bg-transparent text-[16px] leading-[1.4] tracking-[-0.16px] outline-none placeholder:text-[var(--color-gray-500)]"
          />
          <img src={searchIcon} className="size-6 shrink-0" />
        </label>
        <button
          type="button"
          disabled={isCreating}
          onClick={onCreate}
          className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-black)] text-[24px] leading-none font-light text-white disabled:opacity-40"
        >
          +
        </button>
      </div>

      <div className="mt-5">
        {isLoading && (
          <p className="py-10 text-center text-[14px] text-[var(--color-gray-500)]">
            공유 메모를 불러오는 중입니다.
          </p>
        )}
        {!isLoading && errorMessage && (
          <p className="py-10 text-center text-[14px] text-[var(--color-red)]">{errorMessage}</p>
        )}
        {!isLoading &&
          !errorMessage &&
          visibleMemos.map((memo) => (
            <button
              key={memo.pageId}
              type="button"
              onClick={() => onSelect(memo.pageId)}
              className={`flex w-full items-center gap-2 border-b border-[var(--color-gray-200)] px-5 py-[18px] text-left text-[16px] leading-[1.3] font-medium text-black ${
                selectedMemoId === memo.pageId ? 'bg-[var(--color-gray-50)]' : 'bg-white'
              }`}
            >
              <SharedMemoFolderIcon />
              <span className="truncate">{memo.title}</span>
            </button>
          ))}

        {!isLoading && !errorMessage && visibleMemos.length === 0 && (
          <p className="py-10 text-center text-[14px] text-[var(--color-gray-500)]">
            {keyword ? '검색 결과가 없습니다.' : '등록된 공유 메모가 없습니다.'}
          </p>
        )}
      </div>
    </section>
  );
}

export default SharedMemoList;
