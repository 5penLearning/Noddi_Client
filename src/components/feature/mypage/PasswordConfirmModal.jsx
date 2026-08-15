import {
  useEffect,
  useState,
} from 'react';

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({
  visible = false,
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 12C4.6 8.5 7.8 6.5 12 6.5C16.2 6.5 19.4 8.5 21.5 12C19.4 15.5 16.2 17.5 12 17.5C7.8 17.5 4.6 15.5 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      {!visible && (
        <path
          d="M4 4L20 20"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function PasswordConfirmModal({
  isOpen,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}) {
  const [
    password,
    setPassword,
  ] = useState('');

  const [
    isVisible,
    setIsVisible,
  ] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setPassword('');
    setIsVisible(false);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (
    event,
  ) => {
    event.preventDefault();

    if (!password.trim()) {
      return;
    }

    onSubmit(password);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="presentation"
      onMouseDown={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-confirm-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="w-full max-w-[390px] rounded-xl bg-white px-7 py-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)]"
      >
        <div className="flex items-start justify-between">
          <div />

          <div className="text-center">
            <h2
              id="password-confirm-title"
              className="text-base font-semibold text-[#101211]"
            >
              비밀번호 입력
            </h2>

            <p className="mt-2 text-[11px] text-[#A0A8A4]">
              프로필 수정하기 전
              비밀번호를 입력해주세요
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center text-[#526781] disabled:opacity-40"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7"
        >
          <div className="relative">
            <input
              type={
                isVisible
                  ? 'text'
                  : 'password'
              }
              value={password}
              disabled={isSubmitting}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              placeholder="비밀번호"
              autoFocus
              className="h-10 w-full rounded-md border border-[#E1E6E3] bg-[#F2F7F4] px-3 pr-10 text-xs text-[#101211] outline-none transition focus:border-[#AAB8B1]"
            />

            <button
              type="button"
              onClick={() =>
                setIsVisible(
                  (previous) =>
                    !previous,
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA39F]"
              aria-label="비밀번호 표시"
            >
              <EyeIcon
                visible={
                  isVisible
                }
              />
            </button>
          </div>

          {error && (
            <p className="mt-2 text-[11px] text-[#F64E42]">
              {error}
            </p>
          )}

          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !password.trim()
              }
              className="h-9 min-w-[88px] rounded-md bg-[#101211] px-5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting
                ? '확인 중...'
                : '확인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordConfirmModal;
