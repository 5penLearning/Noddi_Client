import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-green.svg';

function LoginPage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <main
      className={`flex min-h-dvh w-full items-center justify-center bg-[var(--color-background)] transition-opacity duration-500 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <section className="flex w-full max-w-[390px] -translate-y-[12px] flex-col items-center px-6">
        <img
          src={logo}
          alt="5Pen"
          draggable="false"
          className="mb-[52px] h-auto w-[190px]"
        />

        <div className="flex w-full flex-col gap-[10px]">
          <button
            type="button"
            className="body-5 flex h-[46px] w-full items-center justify-between rounded-[8px] border border-[var(--color-border)] bg-[var(--color-white)] px-[14px] text-left text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-gray-300)]"
          >
            <span>회사 검색</span>

            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="relative">
            <input
              type="email"
              placeholder="아이디(회사 이메일)"
              className="body-5 h-[46px] w-full rounded-[8px] border border-transparent bg-[var(--color-background-subtle)] px-[14px] pr-[42px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-gray-400)] focus:border-[var(--color-gray-300)]"
            />

            <div className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2">
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
            </div>
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="비밀번호"
              className="body-5 h-[46px] w-full rounded-[8px] border border-transparent bg-[var(--color-background-subtle)] px-[14px] pr-[42px] text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-gray-400)] focus:border-[var(--color-gray-300)]"
            />

            <div className="pointer-events-none absolute top-1/2 right-[14px] -translate-y-1/2">
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
            </div>
          </div>

          <button
            type="button"
            className="body-3 mt-[2px] h-[46px] w-full rounded-[8px] bg-[var(--color-black)] text-[var(--color-white)] transition-opacity hover:opacity-90 active:opacity-80"
          >
            로그인하기
          </button>
        </div>

        <div className="mt-[28px] h-px w-full bg-[var(--color-border)]" />

        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="caption-2 mt-[18px] text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
        >
          회원가입하기
        </button>
      </section>
    </main>
  );
}

export default LoginPage;
