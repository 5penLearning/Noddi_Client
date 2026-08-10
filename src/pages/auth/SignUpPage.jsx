import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo-green.svg';
import CompanySelect from '../../components/common/CompanySelect';

import {
  sendEmailCode,
  signup,
  verifyEmailCode,
} from '../../api/auth';

import { getApiErrorMessage } from '../../api/axios';

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

function InputIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3.5"
        y="3.5"
        width="9"
        height="9"
        rx="2"
        stroke="var(--color-gray-400)"
      />

      <path
        d="M6.5 6.5L9.5 9.5M9.5 6.5L6.5 9.5"
        stroke="var(--color-gray-400)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SignUpPage() {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [verificationCode, setVerificationCode] =
    useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] =
    useState('');

  const [isCodeSent, setIsCodeSent] =
    useState(false);

  const [isEmailVerified, setIsEmailVerified] =
    useState(false);

  const [isSendingCode, setIsSendingCode] =
    useState(false);

  const [isVerifyingCode, setIsVerifyingCode] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const [successMessage, setSuccessMessage] =
    useState('');

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const clearMessage = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleCompanyChange = (company) => {
    setSelectedCompany(company);

    setEmail('');
    setVerificationCode('');
    setIsCodeSent(false);
    setIsEmailVerified(false);

    clearMessage();
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);

    setVerificationCode('');
    setIsCodeSent(false);
    setIsEmailVerified(false);

    clearMessage();
  };

  const handleSendCode = async () => {
    if (!selectedCompany) {
      setErrorMessage('회사를 먼저 선택해주세요.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('회사 이메일을 입력해주세요.');
      return;
    }

    try {
      setIsSendingCode(true);

      clearMessage();

      await sendEmailCode({
        email: email.trim(),
        organizationId: selectedCompany.id,
      });

      setIsCodeSent(true);
      setIsEmailVerified(false);

      setSuccessMessage(
        '입력한 이메일로 인증번호를 발송했습니다.',
      );
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          '인증번호 발송에 실패했습니다.',
        ),
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!selectedCompany) {
      setErrorMessage('회사를 먼저 선택해주세요.');
      return;
    }

    if (!verificationCode.trim()) {
      setErrorMessage('인증번호를 입력해주세요.');
      return;
    }

    try {
      setIsVerifyingCode(true);

      clearMessage();

      await verifyEmailCode({
        email: email.trim(),
        organizationId: selectedCompany.id,
        code: verificationCode.trim(),
      });

      setIsEmailVerified(true);

      setSuccessMessage(
        '이메일 인증이 완료되었습니다.',
      );
    } catch (error) {
      setIsEmailVerified(false);

      setErrorMessage(
        getApiErrorMessage(
          error,
          '인증번호가 올바르지 않습니다.',
        ),
      );
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCompany) {
      setErrorMessage('회사를 먼저 선택해주세요.');
      return;
    }

    if (!name.trim()) {
      setErrorMessage('이름을 입력해주세요.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('회사 이메일을 입력해주세요.');
      return;
    }

    if (!isEmailVerified) {
      setErrorMessage(
        '이메일 인증을 먼저 완료해주세요.',
      );
      return;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setErrorMessage(
        '비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.',
      );
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage(
        '비밀번호가 일치하지 않습니다.',
      );
      return;
    }

    try {
      setIsSubmitting(true);

      clearMessage();

      await signup({
        organizationId: selectedCompany.id,
        name: name.trim(),
        email: email.trim(),
        password,
      });

      navigate('/login', {
        replace: true,
        state: {
          signupSuccess: true,
        },
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          '회원가입에 실패했습니다.',
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className={`flex min-h-dvh w-full items-center justify-center bg-[var(--color-background)] transition-opacity duration-400 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <section className="flex w-full max-w-[420px] flex-col px-[24px] py-[40px]">
        <div className="mb-[42px] flex justify-center">
          <img
            src={logo}
            alt="5Pen"
            className="h-auto w-[124px]"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-[10px]"
        >
          <CompanySelect
            value={selectedCompany}
            onChange={handleCompanyChange}
            disabled={isSubmitting}
          />

          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearMessage();
              }}
              placeholder="이름"
              autoComplete="name"
              disabled={isSubmitting}
              className="body-5 h-[46px] w-full rounded-[8px] border border-transparent bg-[var(--color-background-subtle)] px-[14px] pr-[42px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-gray-400)] focus:border-[var(--color-gray-300)] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2">
              <InputIcon />
            </div>
          </div>

          <div className="flex gap-[10px]">
            <div className="relative min-w-0 flex-1">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="아이디(회사 이메일)"
                autoComplete="email"
                disabled={
                  isEmailVerified ||
                  isSubmitting
                }
                className="body-5 h-[46px] w-full rounded-[8px] border border-transparent bg-[var(--color-background-subtle)] px-[14px] pr-[42px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-gray-400)] focus:border-[var(--color-gray-300)] disabled:cursor-not-allowed disabled:opacity-60"
              />

              <div className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2">
                <InputIcon />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSendCode}
              disabled={
                isSendingCode ||
                isEmailVerified ||
                isSubmitting
              }
              className="body-5 h-[46px] shrink-0 rounded-[8px] border border-[var(--color-gray-400)] bg-[var(--color-white)] px-[18px] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-gray-50)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEmailVerified
                ? '인증완료'
                : isSendingCode
                  ? '발송 중'
                  : isCodeSent
                    ? '재발송'
                    : '인증받기'}
            </button>
          </div>

          {isCodeSent && !isEmailVerified && (
            <div className="flex gap-[10px]">
              <input
                type="text"
                value={verificationCode}
                onChange={(event) => {
                  setVerificationCode(
                    event.target.value,
                  );

                  clearMessage();
                }}
                placeholder="인증번호 입력"
                inputMode="numeric"
                className="body-5 h-[46px] min-w-0 flex-1 rounded-[8px] border border-transparent bg-[var(--color-background-subtle)] px-[14px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-gray-400)] focus:border-[var(--color-gray-300)]"
              />

              <button
                type="button"
                onClick={handleVerifyCode}
                disabled={isVerifyingCode}
                className="body-5 h-[46px] shrink-0 rounded-[8px] border border-[var(--color-gray-400)] bg-[var(--color-white)] px-[18px] text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-gray-50)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isVerifyingCode
                  ? '확인 중'
                  : '인증확인'}
              </button>
            </div>
          )}

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearMessage();
              }}
              placeholder="비밀번호 입력"
              autoComplete="new-password"
              disabled={isSubmitting}
              className="body-5 h-[46px] w-full rounded-[8px] border border-transparent bg-[var(--color-background-subtle)] px-[14px] pr-[42px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-gray-400)] focus:border-[var(--color-gray-300)] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2">
              <InputIcon />
            </div>
          </div>

          <div className="relative">
            <input
              type="password"
              value={passwordConfirm}
              onChange={(event) => {
                setPasswordConfirm(
                  event.target.value,
                );

                clearMessage();
              }}
              placeholder="비밀번호 확인"
              autoComplete="new-password"
              disabled={isSubmitting}
              className="body-5 h-[46px] w-full rounded-[8px] border border-transparent bg-[var(--color-background-subtle)] px-[14px] pr-[42px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-gray-400)] focus:border-[var(--color-gray-300)] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2">
              <InputIcon />
            </div>
          </div>

          <p className="caption-2 px-[10px] text-[var(--color-text-tertiary)]">
            * 비밀번호는 8~20자의 영문, 숫자,
            특수문자를 포함해야 합니다.
          </p>

          {successMessage && (
            <p className="caption-2 px-[10px] text-[var(--color-primary)]">
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <p className="caption-2 px-[10px] text-[var(--color-red)]">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="body-3 mt-[22px] h-[46px] w-full rounded-[8px] bg-[var(--color-black)] text-[var(--color-white)] transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? '가입 중...'
              : '회원가입하기'}
          </button>
        </form>

        <div className="mt-[28px] h-px w-full bg-[var(--color-border)]" />

        <button
          type="button"
          onClick={() => navigate('/login')}
          disabled={isSubmitting}
          className="caption-2 mt-[18px] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          로그인하러가기
        </button>
      </section>
    </main>
  );
}

export default SignUpPage;
