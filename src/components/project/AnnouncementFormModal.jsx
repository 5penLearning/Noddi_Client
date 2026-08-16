import { useEffect, useState } from 'react';

import OutlineButton from '../common/OutlineButton';

import closeXIcon from '../../assets/icons/project-create/modal-close-x.svg';

function AnnouncementFormModal({
  isOpen,
  mode = 'create',
  teams = [],
  initialAnnouncement = null,
  isSubmitting = false,
  errorMessage = '',
  onClose,
  onSubmit,
}) {
  const [teamId, setTeamId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const isEditMode = mode === 'edit';

  useEffect(() => {
    if (!isOpen) return;

    setTeamId(isEditMode ? String(initialAnnouncement?.teamId ?? '') : String(teams[0]?.id ?? ''));
    setTitle(initialAnnouncement?.title ?? '');
    setContent(initialAnnouncement?.content ?? '');
    setValidationMessage('');
  }, [initialAnnouncement, isEditMode, isOpen, teams]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!isEditMode && !teamId) {
      setValidationMessage('공지를 작성할 팀을 선택해주세요.');
      return;
    }

    if (!trimmedTitle || !trimmedContent) {
      setValidationMessage('공지 제목과 내용을 모두 입력해주세요.');
      return;
    }

    setValidationMessage('');
    onSubmit?.({
      teamId,
      title: trimmedTitle,
      content: trimmedContent,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4"
      onMouseDown={onClose}
    >
      <section
        onMouseDown={(event) => event.stopPropagation()}
        className="w-full max-w-[620px] rounded-[10px] bg-[var(--color-white)] px-7 pt-6 pb-7 shadow-[0_20px_60px_rgba(16,18,17,0.16)]"
      >
        <header className="flex items-center border-b border-[var(--color-gray-200)] pb-5">
          <h2 className="subhead-1 text-[var(--color-black)]">
            {isEditMode ? '공지 수정하기' : '공지 추가하기'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="relative ml-auto flex size-6 items-center justify-center disabled:opacity-40"
          >
            <span className="absolute top-0.5 left-0.5 size-5 rounded-[5px] border-[1.5px] border-[#2B3F6C]" />
            <img src={closeXIcon} className="size-[6px]" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="mt-6">
          {!isEditMode && (
            <label className="body-4 block text-[var(--color-gray-700)]">
              작성 팀
              <select
                value={teamId}
                onChange={(event) => setTeamId(event.target.value)}
                disabled={isSubmitting || teams.length === 0}
                className="body-4 mt-2 h-11 w-full rounded-[10px] border border-[var(--color-gray-200)] bg-white px-4 text-[var(--color-black)] outline-none disabled:bg-[var(--color-gray-50)]"
              >
                {teams.length === 0 && <option value="">선택 가능한 팀이 없습니다.</option>}
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="body-4 mt-5 block text-[var(--color-gray-700)]">
            제목
            <input
              type="text"
              value={title}
              maxLength={100}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isSubmitting}
              placeholder="공지 제목을 입력해주세요"
              className="body-4 mt-2 h-11 w-full rounded-[10px] border border-[var(--color-gray-200)] px-4 text-[var(--color-black)] outline-none placeholder:text-[var(--color-gray-500)] disabled:bg-[var(--color-gray-50)]"
            />
          </label>

          <label className="body-4 mt-5 block text-[var(--color-gray-700)]">
            내용
            <textarea
              value={content}
              maxLength={1000}
              onChange={(event) => setContent(event.target.value)}
              disabled={isSubmitting}
              placeholder="공지 내용을 입력해주세요"
              className="body-4 mt-2 h-[180px] w-full resize-none rounded-[10px] border border-[var(--color-gray-200)] px-4 py-3 text-[var(--color-black)] outline-none placeholder:text-[var(--color-gray-500)] disabled:bg-[var(--color-gray-50)]"
            />
          </label>

          {(validationMessage || errorMessage) && (
            <p className="body-5 mt-3 text-[var(--color-red)]">
              {validationMessage || errorMessage}
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <OutlineButton onClick={onClose} disabled={isSubmitting}>
              취소
            </OutlineButton>
            <OutlineButton type="submit" variant="dark" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? '수정 중'
                  : '등록 중'
                : isEditMode
                  ? '수정하기'
                  : '등록하기'}
            </OutlineButton>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AnnouncementFormModal;
