import { useEffect, useState } from 'react';

function TeamCreateModal({
  isOpen,
  mode = 'create',
  initialTeam,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setName(mode === 'edit' ? (initialTeam?.name ?? '') : '');
    setDescription(mode === 'edit' ? (initialTeam?.description ?? '') : '');
  }, [initialTeam, isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) return;

    onSubmit({
      name: trimmedName,
      description: description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <form
        onSubmit={handleSubmit}
        className="w-[520px] rounded-[10px] bg-[var(--color-white)] px-7 py-6"
      >
        <div className="flex items-center border-b border-[var(--color-gray-300)] pb-4">
          <h2 className="subhead-1 text-[var(--color-black)]">
            {mode === 'edit' ? '팀 정보 수정하기' : '새 팀 만들기'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="body-2 ml-auto size-8 text-[var(--color-gray-600)]"
          >
            ×
          </button>
        </div>

        <label className="subhead-3 mt-6 block text-[var(--color-black)]">
          팀 이름
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            placeholder="팀 이름을 입력해주세요"
            className="body-3 mt-2 h-11 w-full rounded-[10px] border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-4 outline-none"
          />
        </label>

        <label className="subhead-3 mt-5 block text-[var(--color-black)]">
          팀 설명
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={isSubmitting}
            placeholder="팀에 대한 설명을 입력해주세요"
            className="body-3 mt-2 h-28 w-full resize-none rounded-[10px] border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] p-4 outline-none"
          />
        </label>

        {errorMessage && <p className="body-4 mt-4 text-[var(--color-red)]">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="body-3 mx-auto mt-7 flex h-11 w-[180px] items-center justify-center rounded-[10px] bg-[var(--color-black)] text-[var(--color-white)] disabled:opacity-40"
        >
          {isSubmitting
            ? mode === 'edit'
              ? '수정하는 중입니다.'
              : '팀을 만드는 중입니다.'
            : mode === 'edit'
              ? '수정하기'
              : '팀 만들기'}
        </button>
      </form>
    </div>
  );
}

export default TeamCreateModal;
