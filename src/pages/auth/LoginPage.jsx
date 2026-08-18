import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from '../../api/auth';
import {
  getApiErrorMessage,
  saveAuthSession,
} from '../../api/axios';

import logo from '../../assets/logo-green.svg';
import CompanySelect from '../../components/common/CompanySelect';
import TypewriterText from '../../components/common/TypewriterText';

const LOGIN_FEATURES = [
  '회의 기록',
  '팀 Q&A',
  '프로젝트 공유',
];

function MailIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M4 7L12 13L20 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 10V7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7V10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({ visible }) {
  if (visible) {
    return (
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 12C5 8.5 8 6.5 12 6.5C16 6.5 19 8.5 21 12C19 15.5 16 17.5 12 17.5C8 17.5 5 15.5 3 12Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />

        <circle
          cx="12"
          cy="12"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4L20 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M10.2 6.7C10.78 6.57 11.38 6.5 12 6.5C16 6.5 19 8.5 21 12C20.29 13.25 19.44 14.29 18.47 15.12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M14.23 17.17C13.52 17.39 12.78 17.5 12 17.5C8 17.5 5 15.5 3 12C3.75 10.69 4.65 9.6 5.68 8.75"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] =
    useState(false);

  const [
    selectedCompany,
    setSelectedCompany,
  ] = useState(null);

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [
    isPasswordVisible,
    setIsPasswordVisible,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  useEffect(() => {
    const frame =
      requestAnimationFrame(() => {
        setIsVisible(true);
      });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    const trimmedEmail =
      email.trim();

    if (!selectedCompany) {
      setErrorMessage(
        '회사를 선택해주세요.',
      );

      return;
    }

    if (!trimmedEmail) {
      setErrorMessage(
        '회사 이메일을 입력해주세요.',
      );

      return;
    }

    if (!password) {
      setErrorMessage(
        '비밀번호를 입력해주세요.',
      );

      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const response =
        await login({
          email: trimmedEmail,
          password,
        });

      const userId =
        response?.result?.userId;

      const accessToken =
        response?.result?.accessToken;

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

  const handleCompanyChange = (
    company,
  ) => {
    setSelectedCompany(company);
    setErrorMessage('');
  };

  const handleEmailChange = (
    event,
  ) => {
    setEmail(event.target.value);
    setErrorMessage('');
  };

  const handlePasswordChange = (
    event,
  ) => {
    setPassword(event.target.value);
    setErrorMessage('');
  };

  return (
    <main
      className={`flex min-h-dvh w-full items-center justify-center bg-[#F6FAF8] px-4 py-6 transition-opacity duration-500 ease-out sm:px-6 ${isVisible
        ? 'opacity-100'
        : 'opacity-0'
        }`}
    >
      <section className="grid w-full max-w-[1120px] overflow-hidden rounded-[24px] border border-[#E1ECE6] bg-white shadow-[0_18px_60px_rgba(16,18,17,0.08)] lg:min-h-[680px] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden flex-col overflow-hidden bg-[#31F5A0] p-10 lg:flex xl:p-12">
          <div className="relative z-10">
            <img
              src={logo}
              alt="Noddi"
              className="h-auto w-[145px] brightness-0"
            />
          </div>

          <div className="relative z-10 my-auto max-w-[405px]">
            <div
              className={`mb-5 flex items-center gap-2 transition-all duration-700 ${isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-3 opacity-0'
                }`}
            >
              <span className="size-2 rounded-full bg-[#101211]" />

              <p className="text-[13px] font-semibold tracking-[-0.01em] text-[#24533F]">
                Noddi Workspace
              </p>
            </div>

            <h1 className="min-h-[94px] text-[34px] font-semibold leading-[1.28] tracking-[-0.035em] text-[#101211]">
              <TypewriterText
                text={'팀의 대화와 기록을\n한곳에서 이어가세요.'}
                speed={62}
                delay={450}
              />
            </h1>

            <p
              className={`mt-5 text-[15px] leading-6 text-[#285A45] transition-all duration-700 delay-[2200ms] ${isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-3 opacity-0'
                }`}
            >
              회의와 팀 정보, 필요한 질문까지
              <br />
              하나의 흐름으로 연결합니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {LOGIN_FEATURES.map(
                (feature, index) => (
                  <span
                    key={feature}
                    className={`rounded-full border border-[#101211]/15 bg-white/35 px-3 py-2 text-[12px] font-medium text-[#183D2E] backdrop-blur-sm transition-all duration-500 ${isVisible
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-2 opacity-0'
                      }`}
                    style={{
                      transitionDelay: `${2500 +
                        index * 180
                        }ms`,
                    }}
                  >
                    {feature}
                  </span>
                ),
              )}
            </div>
          </div>

          <div
            className={`relative z-10 flex items-center justify-between transition-all duration-700 delay-[3000ms] ${isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-2 opacity-0'
              }`}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#101211] opacity-30" />

                <span className="relative inline-flex size-2 rounded-full bg-[#101211]" />
              </span>

              <span className="text-[12px] font-medium text-[#2D674E]">
                Workspace ready
              </span>
            </div>

            <span className="text-[11px] text-[#3C725A]">
              By 오픈러닝
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
          <div className="w-full max-w-[430px]">
            <div className="mb-9">
              <img
                src={logo}
                alt="Noddi"
                className="mb-8 h-auto w-[120px] lg:hidden"
              />

              <h2 className="text-[28px] font-semibold tracking-[-0.025em] text-[#101211]">
                로그인
              </h2>

              <p className="mt-2 text-[14px] leading-6 text-[#667B72]">
                회사 계정으로 Noddi에 로그인해주세요.
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#263C32]">
                  회사
                </label>

                <CompanySelect
                  value={
                    selectedCompany
                  }
                  onChange={
                    handleCompanyChange
                  }
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-[14px] font-medium text-[#263C32]"
                >
                  회사 이메일
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7C9187]">
                    <MailIcon />
                  </span>

                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={
                      handleEmailChange
                    }
                    placeholder="name@company.com"
                    autoComplete="email"
                    disabled={isLoading}
                    className="h-[52px] w-full rounded-[10px] border border-[#DDE8E2] bg-white pl-[46px] pr-4 text-[14px] text-[#101211] outline-none transition placeholder:text-[#9AA9A2] focus:border-[#31F5A0] focus:shadow-[0_0_0_3px_rgba(49,245,160,0.10)] disabled:cursor-not-allowed disabled:bg-[#F5F8F6] disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-[14px] font-medium text-[#263C32]"
                >
                  비밀번호
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#7C9187]">
                    <LockIcon />
                  </span>

                  <input
                    id="login-password"
                    type={
                      isPasswordVisible
                        ? 'text'
                        : 'password'
                    }
                    value={password}
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="비밀번호를 입력해주세요"
                    autoComplete="current-password"
                    disabled={isLoading}
                    className="h-[52px] w-full rounded-[10px] border border-[#DDE8E2] bg-white pl-[46px] pr-[48px] text-[14px] text-[#101211] outline-none transition placeholder:text-[#9AA9A2] focus:border-[#31F5A0] focus:shadow-[0_0_0_3px_rgba(49,245,160,0.10)] disabled:cursor-not-allowed disabled:bg-[#F5F8F6] disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setIsPasswordVisible(
                        (previous) =>
                          !previous,
                      )
                    }
                    className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#82968C] transition hover:text-[#273B32]"
                    aria-label={
                      isPasswordVisible
                        ? '비밀번호 숨기기'
                        : '비밀번호 보기'
                    }
                  >
                    <EyeIcon
                      visible={
                        isPasswordVisible
                      }
                    />
                  </button>
                </div>
              </div>

              <div className="h-[48px]">
                {errorMessage && (
                  <div className="flex h-full items-center rounded-[9px] border border-[#FFD8D3] bg-[#FFF5F3] px-4">
                    <p className="text-[13px] leading-5 text-[#E14C41]">
                      {errorMessage}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="h-[52px] w-full rounded-[10px] bg-[#31F5A0] text-[15px] font-semibold text-[#101211] transition hover:brightness-[0.97] active:scale-[0.995] disabled:cursor-not-allowed disabled:bg-[#D9E9E1] disabled:text-[#8A9C93]"
              >
                {isLoading
                  ? '로그인 중...'
                  : '로그인하기'}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#E4ECE8]" />

              <span className="text-[12px] text-[#83958C]">
                처음 이용하시나요?
              </span>

              <div className="h-px flex-1 bg-[#E4ECE8]" />
            </div>

            <button
              type="button"
              onClick={() =>
                navigate('/signup')
              }
              disabled={isLoading}
              className="mt-5 h-[48px] w-full rounded-[10px] border border-[#CBDCD3] bg-white text-[14px] font-semibold text-[#263E33] transition hover:border-[#8FBAA4] hover:bg-[#F5FBF8] disabled:cursor-not-allowed disabled:opacity-50"
            >
              회원가입
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
