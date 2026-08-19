import folderIcon from '../../assets/icons/meeting-records/shared-memo-folder.svg';
import folderLineIcon from '../../assets/icons/meeting-records/shared-memo-folder-line.svg';
import searchIcon from '../../assets/icons/meeting-records/shared-memo-search.svg';
import { TrashIcon } from '../feature/meeting/ActionItemPanel';

function SharedMemoFolderIcon() {
  return (
    <span className="relative block size-6 shrink-0">
      <img src={folderIcon} className="absolute top-[3px] left-0.5 h-[18px] w-5" />
      <img src={folderLineIcon} className="absolute top-4 left-3 h-px w-1.5" />
    </span>
  );
}

const formatCreatedAt = (dateValue) => {
  if (!dateValue) return '-';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

function SharedMemoList({
  memos,
  keyword,
  selectedMemoId,
  isLoading,
  isCreating,
  deletingMemoId,
  errorMessage,
  onKeywordChange,
  onSelect,
  onCreate,
  onDelete,
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
            <div
              key={memo.pageId}
              className={`flex w-full items-start gap-3 border-b border-[var(--color-gray-200)] px-5 py-[18px] ${
                selectedMemoId === memo.pageId ? 'bg-[#EFFFF7]' : 'bg-white hover:bg-[#EFFFF7]'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(memo.pageId)}
                className="flex min-w-0 flex-1 items-start gap-3 text-left"
              >
                <SharedMemoFolderIcon />
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-[16px] leading-[1.3] font-medium text-black">
                    {memo.title || '제목 없음'}
                  </strong>
                  <span className="mt-2 flex min-w-0 items-center gap-2 text-[12px] text-[var(--color-gray-500)]">
                    <span className="max-w-[120px] truncate">
                      {memo.authorName ??
                        memo.creatorName ??
                        memo.createdByName ??
                        memo.author?.name ??
                        memo.createdBy?.name ??
                        '작성자 정보 없음'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex min-w-0 gap-2">
                      {memo.createdAt && (
                        <time className="truncate" dateTime={memo.createdAt}>
                          생성 {formatCreatedAt(memo.createdAt)}
                        </time>
                      )}
                      {memo.updatedAt && (
                        <time className="truncate" dateTime={memo.updatedAt}>
                          {memo.createdAt ? '· ' : ''}{formatCreatedAt(memo.updatedAt)}
                        </time>
                      )}
                      {!memo.createdAt && !memo.updatedAt && <span>날짜 정보 없음</span>}
                    </span>
                  </span>
                </span>
              </button>
              <button
                type="button"
                disabled={deletingMemoId === memo.pageId}
                onClick={() => onDelete?.(memo.pageId)}
                className="mt-1 flex size-5 shrink-0 items-center justify-center text-[var(--color-gray-500)] disabled:opacity-40"
                aria-label={`${memo.title || '제목 없음'} 삭제`}
              >
                <TrashIcon />
              </button>
            </div>
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
