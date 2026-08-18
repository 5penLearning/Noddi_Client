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
      width="17"
      height="17"
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

function ShieldIcon() {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L19 6V11C19 15.5 16.2 19 12 21C7.8 19 5 15.5 5 11V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M9.5 12L11.2 13.7L14.8 10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (
      event,
    ) => {
      if (
        event.key ===
        'Escape' &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    isSubmitting,
    onClose,
  ]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (
    event,
  ) => {
    event.preventDefault();

    if (
      !password.trim() ||
      isSubmitting
    ) {
      return;
    }

    onSubmit(password);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101211]/40 px-4 py-6 backdrop-blur-[2px]"
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
        onMouseDown={(
          event,
        ) =>
          event.stopPropagation()
        }
        className="relative w-full max-w-[410px] rounded-[22px] border border-[#D7F5E6] bg-white px-5 py-6 shadow-[0_24px_80px_rgba(16,18,17,0.18)] sm:px-7 sm:py-7"
      >
        <button
          type="button"
          disabled={
            isSubmitting
          }
          onClick={
            onClose
          }
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#5A7469] transition hover:bg-[#EFFFF7] hover:text-[#101211] disabled:opacity-40"
          aria-label="닫기"
        >
          <CloseIcon />
        </button>

        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#EFFFF7] text-[#16885B]">
            <ShieldIcon />
          </div>

          <h2
            id="password-confirm-title"
            className="mt-5 text-[19px] font-semibold tracking-[-0.02em] text-[#101211]"
          >
            비밀번호 확인
          </h2>

          <p className="mx-auto mt-2 max-w-[280px] text-[12px] leading-5 text-[#6E877B]">
            개인정보 보호를 위해 프로필 설정으로 이동하기 전
            비밀번호를 확인합니다.
          </p>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-6"
        >
          <label
            htmlFor="profile-password-confirm"
            className="text-[12px] font-semibold text-[#426456]"
          >
            비밀번호
          </label>

          <div className="relative mt-2">
            <input
              id="profile-password-confirm"
              type={
                isVisible
                  ? 'text'
                  : 'password'
              }
              value={
                password
              }
              disabled={
                isSubmitting
              }
              onChange={(
                event,
              ) =>
                setPassword(
                  event.target.value,
                )
              }
              placeholder="비밀번호를 입력해주세요"
              autoFocus
              autoComplete="current-password"
              className="h-11 w-full rounded-[11px] border border-[#D1EADB] bg-[#F8FFFB] px-3.5 pr-11 text-[13px] font-medium text-[#101211] outline-none transition placeholder:text-[#91A69D] focus:border-[#31F5A0] focus:bg-white disabled:opacity-60"
            />

            <button
              type="button"
              disabled={
                isSubmitting
              }
              onClick={() =>
                setIsVisible(
                  (previous) =>
                    !previous,
                )
              }
              className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#648075] transition hover:text-[#101211]"
              aria-label={
                isVisible
                  ? '비밀번호 숨기기'
                  : '비밀번호 표시'
              }
            >
              <EyeIcon
                visible={
                  isVisible
                }
              />
            </button>
          </div>

          {error && (
            <div className="mt-3 rounded-[10px] border border-[#FFD9D4] bg-[#FFF6F5] px-3.5 py-2.5">
              <p className="text-[11px] leading-5 text-[#E04C42]">
                {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !password.trim()
            }
            className="mt-6 h-11 w-full rounded-[11px] bg-[#31F5A0] text-[12px] font-semibold text-[#101211] transition hover:brightness-[0.97] disabled:cursor-not-allowed disabled:bg-[#DDEDE5] disabled:text-[#8EA298]"
          >
            {isSubmitting
              ? '확인 중...'
              : '확인하고 계속'}
          </button>

          <button
            type="button"
            disabled={
              isSubmitting
            }
            onClick={
              onClose
            }
            className="mt-2 h-10 w-full rounded-[10px] text-[11px] font-semibold text-[#6B8378] transition hover:bg-[#F3FFF9] hover:text-[#101211] disabled:opacity-40"
          >
            취소
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordConfirmModal;
