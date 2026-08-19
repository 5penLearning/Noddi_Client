import { useEffect, useState } from 'react';

import editIcon from '../../assets/icons/project-create/edit.svg';

const formatMemoDate = (dateValue) => {
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

function SharedMemoDetail({
  memo,
  projectName,
  teamName,
  isLoading,
  isUpdating,
  errorMessage,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const isNewMemo =
      memo?.title === '새 공유 메모' && memo?.content === '공유할 내용을 입력해주세요.';

    setIsEditing(isNewMemo);
    setTitle(isNewMemo ? '' : (memo?.title ?? ''));
    setContent(isNewMemo ? '' : (memo?.content ?? ''));
  }, [memo]);

  const handleSave = async () => {
    const nextTitle = title.trim();
    const nextContent = content.trim();

    if (!nextTitle || !nextContent || isUpdating) return;

    const isUpdated = await onUpdate?.({
      title: nextTitle,
      content: nextContent,
    });

    if (isUpdated) {
      setIsEditing(false);
    }
  };

  if (isLoading) {
    return (
      <section className="flex h-full items-center justify-center rounded-[10px] bg-white text-[16px] text-[var(--color-gray-500)]">
        공유 메모를 불러오는 중입니다.
      </section>
    );
  }

  if (errorMessage && !memo) {
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
      {errorMessage && (
        <p className="mb-4 rounded-[8px] bg-red-50 px-3 py-2 text-[13px] text-[var(--color-red)]">
          {errorMessage}
        </p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex h-6 items-center text-[16px] font-medium text-[var(--color-gray-900)]">
          <span className="flex h-6 items-center leading-none">
            {projectName} / {teamName}
          </span>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex size-9 items-center justify-center"
            aria-label="공유 페이지 수정"
          >
            <img src={editIcon} alt="" className="size-5" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="mt-[27px] px-[15px] text-black">
          <label className="block">
            <span className="text-[13px] font-medium text-[var(--color-gray-600)]">제목</span>
            <input
              type="text"
              value={title}
              placeholder="새 공유 메모"
              disabled={isUpdating}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 h-11 w-full rounded-[10px] border border-[var(--color-gray-200)] px-3 text-[16px] outline-none focus:border-[var(--color-black)]"
            />
          </label>
          <label className="mt-4 block">
            <span className="text-[13px] font-medium text-[var(--color-gray-600)]">내용</span>
            <textarea
              value={content}
              placeholder="공유할 내용을 입력해주세요."
              disabled={isUpdating}
              onChange={(event) => setContent(event.target.value)}
              className="mt-2 min-h-[300px] w-full resize-y rounded-[10px] border border-[var(--color-gray-200)] p-3 text-[16px] leading-[1.5] outline-none focus:border-[var(--color-black)]"
            />
          </label>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => {
                setTitle(memo.title ?? '');
                setContent(memo.content ?? '');
                setIsEditing(false);
              }}
              className="h-10 rounded-[10px] border border-[var(--color-gray-200)] px-4 text-[14px] font-medium disabled:opacity-40"
            >
              취소
            </button>
            <button
              type="button"
              disabled={!title.trim() || !content.trim() || isUpdating}
              onClick={handleSave}
              className="h-10 rounded-[10px] bg-[var(--color-black)] px-4 text-[14px] font-semibold text-white disabled:opacity-40"
            >
              {isUpdating ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>
      ) : (
        <article className="mt-[27px] px-[15px] text-black">
          <h2 className="text-[20px] leading-[1.3] font-medium">{memo.title}</h2>
          <div className="mt-2 flex flex-wrap gap-x-3 text-[12px] text-[var(--color-gray-500)]">
            {memo.createdAt && (
              <time dateTime={memo.createdAt}>생성 {formatMemoDate(memo.createdAt)}</time>
            )}
            {memo.updatedAt && (
              <time dateTime={memo.updatedAt}>{formatMemoDate(memo.updatedAt)}</time>
            )}
            {!memo.createdAt && !memo.updatedAt && <span>날짜 정보 없음</span>}
          </div>
          <p className="mt-5 text-[16px] leading-[1.6] tracking-[-0.16px] whitespace-pre-wrap">
            {memo.content || '작성된 내용이 없습니다.'}
          </p>
        </article>
      )}
    </section>
  );
}

export default SharedMemoDetail;
