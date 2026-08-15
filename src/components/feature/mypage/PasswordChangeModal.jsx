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

function PasswordChangeModal({
  isOpen,
  isSubmitting,
  error,
  onClose,
  onSubmit,
}) {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState('');

  const [
    newPassword,
    setNewPassword,
  ] = useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [
    validationError,
    setValidationError,
  ] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setValidationError('');
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (
    event,
  ) => {
    event.preventDefault();

    setValidationError('');

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setValidationError(
        '비밀번호를 모두 입력해주세요.',
      );
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setValidationError(
        '새 비밀번호가 일치하지 않습니다.',
      );
      return;
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 20
    ) {
      setValidationError(
        '새 비밀번호는 8~20자로 입력해주세요.',
      );
      return;
    }

    const hasLetter =
      /[A-Za-z]/.test(
        newPassword,
      );

    const hasNumber =
      /\d/.test(
        newPassword,
      );

    const hasSpecial =
      /[^A-Za-z0-9]/.test(
        newPassword,
      );

    if (
      !hasLetter ||
      !hasNumber ||
      !hasSpecial
    ) {
      setValidationError(
        '영문, 숫자, 특수문자를 모두 포함해주세요.',
      );
      return;
    }

    onSubmit({
      currentPassword,
      newPassword,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-change-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="w-full max-w-[440px] rounded-2xl bg-white p-6 shadow-[0_20px_60px_rgba(16,18,17,0.18)]"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2
              id="password-change-title"
              className="text-lg font-semibold text-[#101211]"
            >
              비밀번호 변경
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#8A9490]">
              영문, 숫자, 특수문자를 포함한
              8~20자로 설정해주세요.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#59625F] transition hover:bg-[#F5F7F6] disabled:opacity-40"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="current-password"
              className="text-xs font-semibold text-[#303633]"
            >
              현재 비밀번호
            </label>

            <input
              id="current-password"
              type="password"
              value={
                currentPassword
              }
              disabled={isSubmitting}
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value,
                )
              }
              placeholder="현재 비밀번호"
              className="mt-2 h-11 w-full rounded-lg border border-[#D8DFDC] px-3 text-sm text-[#101211] outline-none transition focus:border-[#101211] disabled:bg-[#F5F7F6]"
            />
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="text-xs font-semibold text-[#303633]"
            >
              새 비밀번호
            </label>

            <input
              id="new-password"
              type="password"
              value={newPassword}
              disabled={isSubmitting}
              onChange={(event) =>
                setNewPassword(
                  event.target.value,
                )
              }
              placeholder="새 비밀번호"
              className="mt-2 h-11 w-full rounded-lg border border-[#D8DFDC] px-3 text-sm text-[#101211] outline-none transition focus:border-[#101211] disabled:bg-[#F5F7F6]"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="text-xs font-semibold text-[#303633]"
            >
              새 비밀번호 확인
            </label>

            <input
              id="confirm-password"
              type="password"
              value={
                confirmPassword
              }
              disabled={isSubmitting}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
              placeholder="새 비밀번호 확인"
              className="mt-2 h-11 w-full rounded-lg border border-[#D8DFDC] px-3 text-sm text-[#101211] outline-none transition focus:border-[#101211] disabled:bg-[#F5F7F6]"
            />
          </div>

          {(validationError ||
            error) && (
              <p className="text-xs text-[#F64E42]">
                {validationError ||
                  error}
              </p>
            )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="h-10 rounded-lg border border-[#D8DFDC] px-4 text-xs font-semibold text-[#59625F] transition hover:bg-[#F5F7F6] disabled:opacity-40"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg bg-[#101211] px-5 text-xs font-semibold text-white transition hover:bg-[#272B29] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting
                ? '변경 중...'
                : '변경'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordChangeModal;
