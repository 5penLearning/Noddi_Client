import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import logo from '../../assets/logo-green.svg';
import CompanySelect from '../../components/common/CompanySelect';

import { login } from '../../api/auth';
import {
  getApiErrorMessage,
  saveAuthSession,
} from '../../api/axios';

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

function LoginPage() {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!selectedCompany) {
      setErrorMessage('회사를 선택해주세요.');
      return;
    }

    if (!trimmedEmail) {
      setErrorMessage('회사 이메일을 입력해주세요.');
      return;
    }

    if (!password) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await login({
        email: trimmedEmail,
        password,
      });

      const userId = response?.result?.userId;
      const accessToken = response?.result?.accessToken;

      if (!accessToken) {
        setErrorMessage(
          '로그인 응답에 Access Token이 없습니다.',
        );
        return;
      }

      saveAuthSession({
        userId,
        accessToken,
      });

      navigate('/home', {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          '이메일 또는 비밀번호를 확인해주세요.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyChange = (company) => {
    setSelectedCompany(company);
    setErrorMessage('');
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrorMessage('');
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setErrorMessage('');
  };

  return (
    <main
      className={`flex min-h-dvh w-full items-center justify-center bg-[var(--color-background)] transition-opacity duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <section className="flex w-full max-w-[420px] flex-col px-[24px]">
        <div className="mb-[42px] flex justify-center">
          <img
            src={logo}
            alt="5Pen"
            className="h-auto w-[124px]"
          />
        </div>

        <form
          onSubmit={handleLogin}
          className="flex w-full flex-col gap-[10px]"
        >
          <CompanySelect
            value={selectedCompany}
            onChange={handleCompanyChange}
            disabled={isLoading}
          />

          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="아이디(회사 이메일)"
              autoComplete="email"
              disabled={isLoading}
              className="body-5 h-[46px] w-full rounded-[8px] border border-transparent bg-[var(--color-background-subtle)] px-[14px] pr-[42px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-gray-400)] focus:border-[var(--color-gray-300)] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2">
              <InputIcon />
            </div>
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호"
              autoComplete="current-password"
              disabled={isLoading}
              className="body-5 h-[46px] w-full rounded-[8px] border border-transparent bg-[var(--color-background-subtle)] px-[14px] pr-[42px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-gray-400)] focus:border-[var(--color-gray-300)] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2">
              <InputIcon />
            </div>
          </div>

          {errorMessage && (
            <p className="caption-2 px-[10px] text-[var(--color-red)]">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="body-3 mt-[2px] h-[46px] w-full rounded-[8px] bg-[var(--color-black)] text-[var(--color-white)] transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인하기'}
          </button>
        </form>

        <div className="mt-[28px] h-px w-full bg-[var(--color-border)]" />

        <button
          type="button"
          onClick={() => navigate('/signup')}
          disabled={isLoading}
          className="caption-2 mt-[18px] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          회원가입하기
        </button>
      </section>
    </main>
  );
}

export default LoginPage;
