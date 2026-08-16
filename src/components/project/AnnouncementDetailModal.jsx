import OutlineButton from '../common/OutlineButton';

import closeXIcon from '../../assets/icons/project-create/modal-close-x.svg';

const formatAnnouncementDate = (value) => {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

function AnnouncementDetailModal({
  isOpen,
  announcement,
  isLoading = false,
  isDeleting = false,
  errorMessage = '',
  canManage = false,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4"
      onMouseDown={onClose}
    >
      <section
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-[620px] rounded-[10px] bg-[var(--color-white)] px-7 pt-6 pb-7 shadow-[0_20px_60px_rgba(16,18,17,0.16)]"
      >
        <header className="flex items-start border-b border-[var(--color-gray-200)] pb-5">
          <div>
            <h2 className="subhead-1 text-[var(--color-black)]">공지 상세</h2>
            {announcement && (
              <p className="body-5 mt-1 text-[var(--color-gray-500)]">{announcement.teamName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="relative ml-auto flex size-6 items-center justify-center disabled:opacity-40"
          >
            <span className="absolute top-0.5 left-0.5 size-5 rounded-[5px] border-[1.5px] border-[#2B3F6C]" />
            <img src={closeXIcon} className="size-[6px]" />
          </button>
        </header>

        {isLoading && (
          <p className="body-4 py-16 text-center text-[var(--color-gray-500)]">
            공지 내용을 불러오는 중입니다.
          </p>
        )}

        {!isLoading && errorMessage && (
          <p className="body-4 py-16 text-center text-[var(--color-red)]">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && announcement && (
          <>
            <div className="mt-6">
              <h3 className="subhead-3 text-[var(--color-black)]">{announcement.title}</h3>
              <div className="body-5 mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[var(--color-gray-500)]">
                <span>작성자 {announcement.authorName || '-'}</span>
                <span>작성 {formatAnnouncementDate(announcement.createdAt)}</span>
                <span>수정 {formatAnnouncementDate(announcement.updatedAt)}</span>
              </div>
              <p className="body-4 mt-6 min-h-[180px] whitespace-pre-wrap text-[var(--color-gray-700)]">
                {announcement.content}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {canManage && (
                <>
                  <OutlineButton onClick={onEdit} disabled={isDeleting}>
                    수정하기
                  </OutlineButton>
                  <OutlineButton variant="dark" onClick={onDelete} disabled={isDeleting}>
                    {isDeleting ? '삭제 중' : '삭제하기'}
                  </OutlineButton>
                </>
              )}
              {!canManage && <OutlineButton onClick={onClose}>닫기</OutlineButton>}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default AnnouncementDetailModal;
