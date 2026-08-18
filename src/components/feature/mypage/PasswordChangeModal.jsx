import {
  useEffect,
  useMemo,
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

function LockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 10V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12L10 17L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PasswordField({
  id,
  label,
  value,
  visible,
  disabled,
  placeholder,
  onChange,
  onToggleVisible,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-[12px] font-semibold text-[#426456]"
      >
        {label}
      </label>

      <div className="relative mt-2">
        <input
          id={id}
          type={
            visible
              ? 'text'
              : 'password'
          }
          value={value}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className="h-11 w-full rounded-[11px] border border-[#D1EADB] bg-[#F8FFFB] px-3.5 pr-11 text-[13px] font-medium text-[#101211] outline-none transition placeholder:text-[#91A69D] focus:border-[#31F5A0] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          disabled={disabled}
          onClick={onToggleVisible}
          className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#648075] transition hover:text-[#101211] disabled:opacity-40"
          aria-label={
            visible
              ? `${label} 숨기기`
              : `${label} 표시`
          }
        >
          <EyeIcon
            visible={visible}
          />
        </button>
      </div>
    </div>
  );
}

function PasswordRule({
  active,
  children,
}) {
  return (
    <div
      className={`flex items-center gap-1.5 text-[10px] font-medium transition-colors ${active
        ? 'text-[#16885B]'
        : 'text-[#8CA298]'
        }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full ${active
          ? 'bg-[#DFFFF0] text-[#16885B]'
          : 'bg-[#F0F8F4] text-[#A2B4AC]'
          }`}
      >
        <CheckIcon />
      </span>

      {children}
    </div>
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
    currentVisible,
    setCurrentVisible,
  ] = useState(false);

  const [
    newVisible,
    setNewVisible,
  ] = useState(false);

  const [
    confirmVisible,
    setConfirmVisible,
  ] = useState(false);

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

    setCurrentVisible(false);
    setNewVisible(false);
    setConfirmVisible(false);

    setValidationError('');
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

  const passwordRules =
    useMemo(() => {
      return {
        length:
          newPassword.length >=
          8 &&
          newPassword.length <=
          20,

        letter:
          /[A-Za-z]/.test(
            newPassword,
          ),

        number:
          /\d/.test(
            newPassword,
          ),

        special:
          /[^A-Za-z0-9]/.test(
            newPassword,
          ),
      };
    }, [newPassword]);

  const isPasswordValid =
    Object.values(
      passwordRules,
    ).every(Boolean);

  const isPasswordMatched =
    Boolean(
      confirmPassword &&
      newPassword ===
      confirmPassword,
    );

  const isFormValid =
    Boolean(
      currentPassword &&
      newPassword &&
      confirmPassword &&
      isPasswordValid &&
      isPasswordMatched,
    );

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

    if (!isPasswordValid) {
      setValidationError(
        '새 비밀번호 조건을 확인해주세요.',
      );

      return;
    }

    if (!isPasswordMatched) {
      setValidationError(
        '새 비밀번호가 일치하지 않습니다.',
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
        aria-labelledby="password-change-title"
        onMouseDown={(
          event,
        ) =>
          event.stopPropagation()
        }
        className="max-h-[calc(100vh-48px)] w-full max-w-[460px] overflow-y-auto rounded-[22px] border border-[#D7F5E6] bg-white p-5 shadow-[0_24px_80px_rgba(16,18,17,0.18)] sm:p-7"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-5">
          <div className="flex min-w-0 gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#EFFFF7] text-[#16885B]">
              <LockIcon />
            </div>

            <div>
              <h2
                id="password-change-title"
                className="text-[18px] font-semibold tracking-[-0.02em] text-[#101211]"
              >
                비밀번호 변경
              </h2>

              <p className="mt-1 text-[12px] leading-5 text-[#6E877B]">
                안전한 비밀번호로 계정을 보호해주세요.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={
              isSubmitting
            }
            onClick={
              onClose
            }
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#587368] transition hover:bg-[#EFFFF7] hover:text-[#101211] disabled:opacity-40"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-7"
        >
          <div className="space-y-5">
            <PasswordField
              id="current-password"
              label="현재 비밀번호"
              value={
                currentPassword
              }
              visible={
                currentVisible
              }
              disabled={
                isSubmitting
              }
              placeholder="현재 비밀번호를 입력해주세요"
              onChange={(
                event,
              ) => {
                setCurrentPassword(
                  event.target.value,
                );

                setValidationError('');
              }}
              onToggleVisible={() =>
                setCurrentVisible(
                  (previous) =>
                    !previous,
                )
              }
            />

            <div>
              <PasswordField
                id="new-password"
                label="새 비밀번호"
                value={
                  newPassword
                }
                visible={
                  newVisible
                }
                disabled={
                  isSubmitting
                }
                placeholder="새 비밀번호를 입력해주세요"
                onChange={(
                  event,
                ) => {
                  setNewPassword(
                    event.target.value,
                  );

                  setValidationError('');
                }}
                onToggleVisible={() =>
                  setNewVisible(
                    (previous) =>
                      !previous,
                  )
                }
              />

              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 rounded-[12px] bg-[#F4FFF9] px-3.5 py-3">
                <PasswordRule
                  active={
                    passwordRules.length
                  }
                >
                  8~20자
                </PasswordRule>

                <PasswordRule
                  active={
                    passwordRules.letter
                  }
                >
                  영문 포함
                </PasswordRule>

                <PasswordRule
                  active={
                    passwordRules.number
                  }
                >
                  숫자 포함
                </PasswordRule>

                <PasswordRule
                  active={
                    passwordRules.special
                  }
                >
                  특수문자 포함
                </PasswordRule>
              </div>
            </div>

            <div>
              <PasswordField
                id="confirm-password"
                label="새 비밀번호 확인"
                value={
                  confirmPassword
                }
                visible={
                  confirmVisible
                }
                disabled={
                  isSubmitting
                }
                placeholder="새 비밀번호를 다시 입력해주세요"
                onChange={(
                  event,
                ) => {
                  setConfirmPassword(
                    event.target.value,
                  );

                  setValidationError('');
                }}
                onToggleVisible={() =>
                  setConfirmVisible(
                    (previous) =>
                      !previous,
                  )
                }
              />

              {confirmPassword && (
                <p
                  className={`mt-2 text-[11px] font-medium ${isPasswordMatched
                    ? 'text-[#16885B]'
                    : 'text-[#F64E42]'
                    }`}
                >
                  {isPasswordMatched
                    ? '비밀번호가 일치합니다.'
                    : '비밀번호가 일치하지 않습니다.'}
                </p>
              )}
            </div>
          </div>

          {(validationError ||
            error) && (
              <div className="mt-5 rounded-[11px] border border-[#FFD9D4] bg-[#FFF6F5] px-3.5 py-3">
                <p className="text-[11px] leading-5 text-[#E04C42]">
                  {validationError ||
                    error}
                </p>
              </div>
            )}

          <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={
                isSubmitting
              }
              onClick={
                onClose
              }
              className="h-11 rounded-[11px] border border-[#D3EBDD] bg-white px-5 text-[12px] font-semibold text-[#587368] transition hover:bg-[#F5FFF9] hover:text-[#101211] disabled:opacity-40 sm:min-w-[90px]"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !isFormValid
              }
              className="h-11 rounded-[11px] bg-[#31F5A0] px-5 text-[12px] font-semibold text-[#101211] transition hover:brightness-[0.97] disabled:cursor-not-allowed disabled:bg-[#DDEDE5] disabled:text-[#8EA298] sm:min-w-[120px]"
            >
              {isSubmitting
                ? '변경 중...'
                : '비밀번호 변경'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PasswordChangeModal;
