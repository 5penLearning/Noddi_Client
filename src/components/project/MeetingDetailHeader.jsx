import editIcon from '../../assets/icons/project-create/edit.svg';

function MeetingDetailHeader({
  title,
  dateLabel,
  durationLabel,
  isEditing,
  isSaving,
  onEdit,
  onCancel,
  onSave,
}) {
  return (
    <header className="flex items-start justify-between px-[29px] pt-[26px]">
      <div>
        <h1 className="text-[32px] leading-[1.2] font-semibold tracking-[0.32px] text-black">
          {title}
        </h1>
        <div className="mt-1 flex items-center gap-3 text-[16px] leading-[1.4] tracking-[-0.16px] text-[var(--color-gray-600)]">
          <time>{dateLabel}</time>
          <span className="size-0.5 rounded-full bg-[var(--color-gray-400)]" />
          <span>{durationLabel}</span>
        </div>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSaving}
            onClick={onCancel}
            className="h-9 rounded-[8px] border border-[var(--color-gray-300)] px-4 text-[14px] text-[var(--color-gray-700)] disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="h-9 rounded-[8px] bg-[var(--color-primary)] px-4 text-[14px] font-semibold text-[var(--color-gray-900)] disabled:opacity-50"
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      ) : (
        <button type="button" onClick={onEdit} className="flex size-8 items-center justify-center">
          <img src={editIcon} className="size-[18px]" />
        </button>
      )}
    </header>
  );
}

export default MeetingDetailHeader;
