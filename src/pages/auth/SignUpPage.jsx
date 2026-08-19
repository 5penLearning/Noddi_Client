import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  getSignupProfileOptions,
  login,
  sendEmailCode,
  signup,
  verifyEmailCode,
} from '../../api/auth';

import {
  getApiErrorMessage,
  saveAuthSession,
} from '../../api/axios';

import meetingSymbolIcon from '../../assets/icons/home-meeting/meeting-symbol.svg';
import meetingSymbolSecondaryIcon from '../../assets/icons/home-meeting/meeting-symbol-secondary.svg';
import logo from '../../assets/logo-green.svg';

import CompanySelect from '../../components/common/CompanySelect';
import TypewriterText from '../../components/common/TypewriterText';

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

const SIGNUP_STEPS = [
  '회사 인증',
  '팀 참여',
  '협업 시작',
];

function UserIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M5 20C5.6 16.7 8.2 15 12 15C15.8 15 18.4 16.7 19 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
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
      width="18"
      height="18"
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

function EyeIcon({
  visible,
}) {
  if (visible) {
    return (
      <svg
        width="18"
        height="18"
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
      width="18"
      height="18"
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

function ChevronDownIcon({
  isOpen,
}) {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-200 ${isOpen
        ? 'rotate-180'
        : ''
        }`}
    >
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileOptionField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  isLoading = false,
}) {
  const containerRef =
    useRef(null);

  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (
      event,
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target,
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      );
    };
  }, []);

  const filteredOptions =
    useMemo(() => {
      const keyword =
        value
          .trim()
          .toLowerCase();

      if (!keyword) {
        return options;
      }

      return options.filter(
        (option) =>
          option
            .toLowerCase()
            .includes(keyword),
      );
    }, [
      options,
      value,
    ]);

  return (
    <div
      ref={containerRef}
      className="relative min-w-0 flex-1"
    >
      <label
        htmlFor={id}
        className="mb-1.5 block text-[13px] font-medium text-[#263C32]"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(event) => {
            onChange(
              event.target.value,
            );

            setIsOpen(true);
          }}
          onFocus={() => {
            if (!disabled) {
              setIsOpen(true);
            }
          }}
          placeholder={
            isLoading
              ? '불러오는 중...'
              : placeholder
          }
          maxLength={20}
          disabled={disabled}
          autoComplete="off"
          className="h-[46px] w-full rounded-[9px] border border-[#DDE8E2] bg-white px-3.5 pr-10 text-[14px] text-[#101211] outline-none transition placeholder:text-[#9AA9A2] focus:border-[#31F5A0] focus:shadow-[0_0_0_3px_rgba(49,245,160,0.10)] disabled:cursor-not-allowed disabled:bg-[#F5F8F6] disabled:opacity-60"
        />

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() =>
            setIsOpen(
              (previous) =>
                !previous,
            )
          }
          className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center text-[#80938A] disabled:cursor-not-allowed"
          aria-label={`${label} 추천 보기`}
        >
          <ChevronDownIcon
            isOpen={isOpen}
          />
        </button>
      </div>

      {isOpen &&
        !disabled &&
        !isLoading && (
          <div className="absolute left-0 top-[70px] z-40 max-h-[190px] w-full overflow-y-auto rounded-[10px] border border-[#DDE9E3] bg-white py-1.5 shadow-[0_12px_30px_rgba(16,18,17,0.12)]">
            {filteredOptions.length >
              0 ? (
              filteredOptions.map(
                (option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-[13px] transition ${value === option
                      ? 'bg-[#EFFFF7] font-medium text-[#157C53]'
                      : 'text-[#263C32] hover:bg-[#F5FBF8]'
                      }`}
                  >
                    {option}
                  </button>
                ),
              )
            ) : (
              <div className="px-4 py-4">
                <p className="text-[12px] leading-5 text-[#7B8F85]">
                  추천 항목이 없습니다.
                  <br />
                  직접 입력할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}

function SignUpPage() {
  const navigate =
    useNavigate();

  const [
    isVisible,
    setIsVisible,
  ] = useState(false);

  const [
    selectedCompany,
    setSelectedCompany,
  ] = useState(null);

  const [
    departments,
    setDepartments,
  ] = useState([]);

  const [
    positions,
    setPositions,
  ] = useState([]);

  const [
    department,
    setDepartment,
  ] = useState('');

  const [
    position,
    setPosition,
  ] = useState('');

  const [
    isProfileOptionsLoading,
    setIsProfileOptionsLoading,
  ] = useState(false);

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [
    verificationCode,
    setVerificationCode,
  ] = useState('');

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    passwordConfirm,
    setPasswordConfirm,
  ] = useState('');

  const [
    isPasswordVisible,
    setIsPasswordVisible,
  ] = useState(false);

  const [
    isPasswordConfirmVisible,
    setIsPasswordConfirmVisible,
  ] = useState(false);

  const [
    isCodeSent,
    setIsCodeSent,
  ] = useState(false);

  const [
    isEmailVerified,
    setIsEmailVerified,
  ] = useState(false);

  const [
    isSendingCode,
    setIsSendingCode,
  ] = useState(false);

  const [
    isVerifyingCode,
    setIsVerifyingCode,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('');

  useEffect(() => {
    const frame =
      requestAnimationFrame(
        () => {
          setIsVisible(true);
        },
      );

    return () => {
      cancelAnimationFrame(
        frame,
      );
    };
  }, []);

  const clearMessage = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const loadProfileOptions =
    async (
      organizationId,
    ) => {
      try {
        setIsProfileOptionsLoading(
          true,
        );

        const response =
          await getSignupProfileOptions(
            {
              organizationId,
            },
          );

        setDepartments(
          Array.isArray(
            response?.result
              ?.departments,
          )
            ? response.result
              .departments
            : [],
        );

        setPositions(
          Array.isArray(
            response?.result
              ?.positions,
          )
            ? response.result
              .positions
            : [],
        );
      } catch (error) {
        console.error(
          'Failed to load signup profile options:',
          error,
        );

        setDepartments([]);
        setPositions([]);
      } finally {
        setIsProfileOptionsLoading(
          false,
        );
      }
    };

  const handleCompanyChange = (
    company,
  ) => {
    setSelectedCompany(company);

    setDepartment('');
    setPosition('');

    setDepartments([]);
    setPositions([]);

    setEmail('');
    setVerificationCode('');

    setIsCodeSent(false);
    setIsEmailVerified(false);

    clearMessage();

    if (
      company?.organizationId
    ) {
      loadProfileOptions(
        company.organizationId,
      );
    }
  };

  const handleEmailChange = (
    event,
  ) => {
    setEmail(
      event.target.value,
    );

    setVerificationCode('');

    setIsCodeSent(false);
    setIsEmailVerified(false);

    clearMessage();
  };

  const handleSendCode =
    async () => {
      if (!selectedCompany) {
        setErrorMessage(
          '회사를 먼저 선택해주세요.',
        );

        setSuccessMessage('');

        return;
      }

      if (!email.trim()) {
        setErrorMessage(
          '회사 이메일을 입력해주세요.',
        );

        setSuccessMessage('');

        return;
      }

      try {
        setIsSendingCode(true);

        clearMessage();

        await sendEmailCode({
          email:
            email.trim(),

          organizationId:
            selectedCompany.organizationId,
        });

        setIsCodeSent(true);
        setIsEmailVerified(
          false,
        );

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
        setIsSendingCode(
          false,
        );
      }
    };

  const handleVerifyCode =
    async () => {
      if (!selectedCompany) {
        setErrorMessage(
          '회사를 먼저 선택해주세요.',
        );

        setSuccessMessage('');

        return;
      }

      if (
        !verificationCode.trim()
      ) {
        setErrorMessage(
          '인증번호를 입력해주세요.',
        );

        setSuccessMessage('');

        return;
      }

      try {
        setIsVerifyingCode(
          true,
        );

        clearMessage();

        await verifyEmailCode({
          email:
            email.trim(),

          organizationId:
            selectedCompany.organizationId,

          code:
            verificationCode.trim(),
        });

        setIsEmailVerified(
          true,
        );

        setSuccessMessage(
          '이메일 인증이 완료되었습니다.',
        );
      } catch (error) {
        setIsEmailVerified(
          false,
        );

        setErrorMessage(
          getApiErrorMessage(
            error,
            '인증번호가 올바르지 않습니다.',
          ),
        );
      } finally {
        setIsVerifyingCode(
          false,
        );
      }
    };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      const trimmedName =
        name.trim();

      const trimmedEmail =
        email.trim();

      const trimmedDepartment =
        department.trim();

      const trimmedPosition =
        position.trim();

      if (!selectedCompany) {
        setErrorMessage(
          '회사를 먼저 선택해주세요.',
        );

        setSuccessMessage('');

        return;
      }

      if (!trimmedDepartment) {
        setErrorMessage(
          '부서를 입력해주세요.',
        );

        setSuccessMessage('');

        return;
      }

      if (!trimmedPosition) {
        setErrorMessage(
          '직함을 입력해주세요.',
        );

        setSuccessMessage('');

        return;
      }

      if (!trimmedName) {
        setErrorMessage(
          '이름을 입력해주세요.',
        );

        setSuccessMessage('');

        return;
      }

      if (!trimmedEmail) {
        setErrorMessage(
          '회사 이메일을 입력해주세요.',
        );

        setSuccessMessage('');

        return;
      }

      if (!isEmailVerified) {
        setErrorMessage(
          '이메일 인증을 먼저 완료해주세요.',
        );

        setSuccessMessage('');

        return;
      }

      if (
        !PASSWORD_REGEX.test(
          password,
        )
      ) {
        setErrorMessage(
          '비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.',
        );

        setSuccessMessage('');

        return;
      }

      if (
        password !==
        passwordConfirm
      ) {
        setErrorMessage(
          '비밀번호가 일치하지 않습니다.',
        );

        setSuccessMessage('');

        return;
      }

      try {
        setIsSubmitting(true);

        clearMessage();

        await signup({
          organizationId:
            selectedCompany.organizationId,

          name:
            trimmedName,

          department:
            trimmedDepartment,

          position:
            trimmedPosition,

          email:
            trimmedEmail,

          password,
        });

        try {
          const loginResponse =
            await login({
              email:
                trimmedEmail,

              password,
            });

          const userId =
            loginResponse
              ?.result
              ?.userId;

          const accessToken =
            loginResponse
              ?.result
              ?.accessToken;

          if (!accessToken) {
            throw new Error(
              'Access Token이 없습니다.',
            );
          }

          saveAuthSession({
            userId,
            accessToken,
          });

          navigate('/home', {
            replace: true,
          });
        } catch (
        loginError
        ) {
          console.error(
            'Signup completed but automatic login failed:',
            loginError,
          );

          navigate('/login', {
            replace: true,

            state: {
              signupSuccess:
                true,

              autoLoginFailed:
                true,
            },
          });
        }
      } catch (error) {
        console.error(
          'Failed to signup:',
          error,
        );

        setErrorMessage(
          getApiErrorMessage(
            error,
            '회원가입에 실패했습니다.',
          ),
        );
      } finally {
        setIsSubmitting(
          false,
        );
      }
    };

  return (
    <main
      className={`min-h-dvh w-full bg-[#F6FAF8] px-4 py-4 transition-opacity duration-500 ease-out sm:px-6 lg:flex lg:h-dvh lg:min-h-0 lg:items-center lg:justify-center lg:overflow-hidden ${isVisible
        ? 'opacity-100'
        : 'opacity-0'
        }`}
    >
      <section className="mx-auto grid w-full max-w-[1180px] overflow-hidden rounded-[22px] border border-[#E1ECE6] bg-white shadow-[0_18px_60px_rgba(16,18,17,0.08)] lg:h-[calc(100dvh-32px)] lg:max-h-[820px] lg:min-h-[700px] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="relative hidden h-full flex-col overflow-hidden bg-[#31F5A0] p-10 lg:flex xl:p-12">
          <div className="relative z-10">
            <img
              src={logo}
              alt="Noddi"
              className="h-auto w-[142px] brightness-0"
            />
          </div>

          <div className="relative z-10 my-auto max-w-[390px]">
            <div
              className={`mb-4 flex items-center gap-2 transition-all duration-700 ${isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-3 opacity-0'
                }`}
            >
              <span className="size-2 rounded-full bg-[#101211]" />

              <p className="text-[13px] font-semibold text-[#24533F]">
                Join Noddi
              </p>
            </div>

            <h1 className="min-h-[84px] text-[32px] font-semibold leading-[1.3] tracking-[-0.035em] text-[#101211]">
              <TypewriterText
                text={
                  '함께 일할 준비를\n시작해볼까요?'
                }
                speed={68}
                delay={450}
              />
            </h1>

            <p
              className={`mt-4 text-[15px] leading-6 text-[#285A45] transition-all duration-700 delay-[1800ms] ${isVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-3 opacity-0'
                }`}
            >
              회사 이메일을 인증하고
              <br />
              새로운 팀과 연결해보세요.
            </p>

            <div className="mt-7">
              {SIGNUP_STEPS.map(
                (
                  step,
                  index,
                ) => (
                  <div
                    key={step}
                    className={`flex items-center gap-3 transition-all duration-500 ${isVisible
                      ? 'translate-x-0 opacity-100'
                      : '-translate-x-3 opacity-0'
                      }`}
                    style={{
                      transitionDelay: `${2050 +
                        index *
                        220
                        }ms`,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="flex size-7 items-center justify-center rounded-full border border-[#101211]/20 bg-white/40 text-[11px] font-semibold text-[#101211]">
                        {index + 1}
                      </span>

                      {index <
                        SIGNUP_STEPS.length -
                        1 && (
                          <span className="h-4 w-px bg-[#101211]/15" />
                        )}
                    </div>

                    <span className="text-[13px] font-medium text-[#214D39]">
                      {step}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          <div
            className={`relative z-10 flex items-center gap-2 transition-all duration-700 delay-[2900ms] ${isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-2 opacity-0'
              }`}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#101211] opacity-30" />

              <span className="relative inline-flex size-2 rounded-full bg-[#101211]" />
            </span>

            <span className="text-[12px] font-medium text-[#2D674E]">
              Ready to join
            </span>
          </div>

          <div
            className="pointer-events-none absolute -bottom-[120px] -right-[120px] size-[310px] rounded-full border border-[#101211]/10"
            aria-hidden="true"
          />

          <div
            className="pointer-events-none absolute -bottom-[72px] -right-[72px] size-[210px] rounded-full border border-[#101211]/10"
            aria-hidden="true"
          />
        </div>

        <div className="flex h-full justify-center px-6 py-7 sm:px-10 lg:items-center lg:px-10 lg:py-5 xl:px-14">
          <div className="w-full max-w-[500px]">
            <div className="mb-5">
              <img
                src={logo}
                alt="Noddi"
                className="mb-6 h-auto w-[116px] lg:hidden"
              />

              <h2 className="text-[26px] font-semibold tracking-[-0.025em] text-[#101211]">
                회원가입
              </h2>

              <p className="mt-1.5 text-[13px] leading-5 text-[#667B72]">
                회사 정보를 확인하고 계정을 만들어주세요.
              </p>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-3"
            >
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#263C32]">
                  회사
                </label>

                <CompanySelect
                  value={
                    selectedCompany
                  }
                  onChange={
                    handleCompanyChange
                  }
                  disabled={
                    isSubmitting
                  }
                />
              </div>

              <div className="flex gap-3">
                <ProfileOptionField
                  id="signup-department"
                  label="부서"
                  value={department}
                  onChange={(
                    value,
                  ) => {
                    setDepartment(
                      value,
                    );

                    clearMessage();
                  }}
                  options={
                    departments
                  }
                  placeholder="예: 디자인팀"
                  disabled={
                    !selectedCompany ||
                    isSubmitting
                  }
                  isLoading={
                    isProfileOptionsLoading
                  }
                />

                <ProfileOptionField
                  id="signup-position"
                  label="직함"
                  value={position}
                  onChange={(
                    value,
                  ) => {
                    setPosition(
                      value,
                    );

                    clearMessage();
                  }}
                  options={
                    positions
                  }
                  placeholder="예: 과장"
                  disabled={
                    !selectedCompany ||
                    isSubmitting
                  }
                  isLoading={
                    isProfileOptionsLoading
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="signup-name"
                  className="mb-1.5 block text-[13px] font-medium text-[#263C32]"
                >
                  이름
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C9187]">
                    <UserIcon />
                  </span>

                  <input
                    id="signup-name"
                    type="text"
                    value={name}
                    onChange={(
                      event,
                    ) => {
                      setName(
                        event
                          .target
                          .value,
                      );

                      clearMessage();
                    }}
                    placeholder="이름을 입력해주세요"
                    autoComplete="name"
                    disabled={
                      isSubmitting
                    }
                    className="h-[46px] w-full rounded-[9px] border border-[#DDE8E2] bg-white pl-[43px] pr-3.5 text-[14px] text-[#101211] outline-none transition placeholder:text-[#9AA9A2] focus:border-[#31F5A0] focus:shadow-[0_0_0_3px_rgba(49,245,160,0.10)] disabled:cursor-not-allowed disabled:bg-[#F5F8F6] disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="mb-1.5 block text-[13px] font-medium text-[#263C32]"
                >
                  회사 이메일
                </label>

                <div className="flex items-center gap-2">
                  <div className="relative min-w-0 flex-1">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C9187]">
                      <MailIcon />
                    </span>

                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={
                        handleEmailChange
                      }
                      placeholder="name@company.com"
                      autoComplete="email"
                      disabled={
                        isEmailVerified ||
                        isSubmitting
                      }
                      className="h-[46px] w-full rounded-[9px] border border-[#DDE8E2] bg-white pl-[43px] pr-3.5 text-[14px] text-[#101211] outline-none transition placeholder:text-[#9AA9A2] focus:border-[#31F5A0] focus:shadow-[0_0_0_3px_rgba(49,245,160,0.10)] disabled:cursor-not-allowed disabled:bg-[#F5F8F6] disabled:opacity-60"
                    />
                  </div>

                  <div
                    className="flex h-[46px] w-[32px] shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <img
                      src={
                        isEmailVerified
                          ? meetingSymbolIcon
                          : meetingSymbolSecondaryIcon
                      }
                      alt=""
                      className={`h-auto w-[23px] object-contain transition-all duration-300 ${isEmailVerified
                        ? 'scale-110 opacity-100'
                        : 'scale-100 opacity-65'
                        }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleSendCode
                    }
                    disabled={
                      isSendingCode ||
                      isEmailVerified ||
                      isSubmitting
                    }
                    className={`h-[46px] min-w-[98px] shrink-0 rounded-[9px] px-3 text-[13px] font-semibold transition ${isEmailVerified
                      ? 'border border-[#BCEFD5] bg-[#EDFFF6] text-[#167B52]'
                      : 'border border-[#BED2C8] bg-white text-[#29483A] hover:border-[#7FAE96] hover:bg-[#F5FBF8]'
                      } disabled:cursor-not-allowed`}
                  >
                    {isEmailVerified
                      ? '인증 완료'
                      : isSendingCode
                        ? '발송 중...'
                        : isCodeSent
                          ? '재발송'
                          : '인증받기'}
                  </button>
                </div>
              </div>

              {isCodeSent &&
                !isEmailVerified && (
                  <div>
                    <label
                      htmlFor="signup-verification-code"
                      className="mb-1.5 block text-[13px] font-medium text-[#263C32]"
                    >
                      인증번호
                    </label>

                    <div className="flex gap-2">
                      <input
                        id="signup-verification-code"
                        type="text"
                        value={
                          verificationCode
                        }
                        onChange={(
                          event,
                        ) => {
                          setVerificationCode(
                            event
                              .target
                              .value,
                          );

                          clearMessage();
                        }}
                        placeholder="인증번호를 입력해주세요"
                        inputMode="numeric"
                        disabled={
                          isVerifyingCode
                        }
                        className="h-[46px] min-w-0 flex-1 rounded-[9px] border border-[#DDE8E2] bg-white px-3.5 text-[14px] text-[#101211] outline-none transition placeholder:text-[#9AA9A2] focus:border-[#31F5A0] focus:shadow-[0_0_0_3px_rgba(49,245,160,0.10)] disabled:cursor-not-allowed disabled:bg-[#F5F8F6] disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={
                          handleVerifyCode
                        }
                        disabled={
                          isVerifyingCode ||
                          isSubmitting
                        }
                        className="h-[46px] min-w-[98px] shrink-0 rounded-[9px] bg-[#101211] px-3 text-[13px] font-semibold text-white transition hover:bg-[#292D2B] disabled:cursor-not-allowed disabled:bg-[#D8E2DD] disabled:text-[#8B9C94]"
                      >
                        {isVerifyingCode
                          ? '확인 중...'
                          : '인증확인'}
                      </button>
                    </div>
                  </div>
                )}

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="signup-password"
                    className="mb-1.5 block text-[13px] font-medium text-[#263C32]"
                  >
                    비밀번호
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C9187]">
                      <LockIcon />
                    </span>

                    <input
                      id="signup-password"
                      type={
                        isPasswordVisible
                          ? 'text'
                          : 'password'
                      }
                      value={
                        password
                      }
                      onChange={(
                        event,
                      ) => {
                        setPassword(
                          event
                            .target
                            .value,
                        );

                        clearMessage();
                      }}
                      placeholder="비밀번호 입력"
                      autoComplete="new-password"
                      disabled={
                        isSubmitting
                      }
                      className="h-[46px] w-full rounded-[9px] border border-[#DDE8E2] bg-white pl-[43px] pr-[42px] text-[14px] text-[#101211] outline-none transition placeholder:text-[#9AA9A2] focus:border-[#31F5A0] focus:shadow-[0_0_0_3px_rgba(49,245,160,0.10)] disabled:cursor-not-allowed disabled:bg-[#F5F8F6] disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setIsPasswordVisible(
                          (
                            previous,
                          ) =>
                            !previous,
                        )
                      }
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#82968C] transition hover:text-[#273B32]"
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

                <div>
                  <label
                    htmlFor="signup-password-confirm"
                    className="mb-1.5 block text-[13px] font-medium text-[#263C32]"
                  >
                    비밀번호 확인
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C9187]">
                      <LockIcon />
                    </span>

                    <input
                      id="signup-password-confirm"
                      type={
                        isPasswordConfirmVisible
                          ? 'text'
                          : 'password'
                      }
                      value={
                        passwordConfirm
                      }
                      onChange={(
                        event,
                      ) => {
                        setPasswordConfirm(
                          event
                            .target
                            .value,
                        );

                        clearMessage();
                      }}
                      placeholder="비밀번호 확인"
                      autoComplete="new-password"
                      disabled={
                        isSubmitting
                      }
                      className="h-[46px] w-full rounded-[9px] border border-[#DDE8E2] bg-white pl-[43px] pr-[42px] text-[14px] text-[#101211] outline-none transition placeholder:text-[#9AA9A2] focus:border-[#31F5A0] focus:shadow-[0_0_0_3px_rgba(49,245,160,0.10)] disabled:cursor-not-allowed disabled:bg-[#F5F8F6] disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setIsPasswordConfirmVisible(
                          (
                            previous,
                          ) =>
                            !previous,
                        )
                      }
                      className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#82968C] transition hover:text-[#273B32]"
                      aria-label={
                        isPasswordConfirmVisible
                          ? '비밀번호 숨기기'
                          : '비밀번호 보기'
                      }
                    >
                      <EyeIcon
                        visible={
                          isPasswordConfirmVisible
                        }
                      />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-[11px] leading-4 text-[#798C83]">
                비밀번호는 8~20자의 영문, 숫자, 특수문자를 포함해주세요.
              </p>

              <div className="h-[42px]">
                {errorMessage && (
                  <div className="flex h-full items-center rounded-[8px] border border-[#FFD8D3] bg-[#FFF5F3] px-3.5">
                    <p className="text-[12px] leading-4 text-[#E14C41]">
                      {
                        errorMessage
                      }
                    </p>
                  </div>
                )}

                {!errorMessage &&
                  successMessage && (
                    <div className="flex h-full items-center rounded-[8px] border border-[#BCEFD5] bg-[#EDFFF6] px-3.5">
                      <p className="text-[12px] leading-4 text-[#167B52]">
                        {
                          successMessage
                        }
                      </p>
                    </div>
                  )}
              </div>

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="h-[48px] w-full rounded-[9px] bg-[#31F5A0] text-[14px] font-semibold text-[#101211] transition hover:brightness-[0.97] active:scale-[0.995] disabled:cursor-not-allowed disabled:bg-[#D9E9E1] disabled:text-[#8A9C93]"
              >
                {isSubmitting
                  ? '가입 중...'
                  : '회원가입하기'}
              </button>
            </form>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-[12px]">
              <span className="text-[#71857B]">
                이미 계정이 있나요?
              </span>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/login',
                  )
                }
                disabled={
                  isSubmitting
                }
                className="font-semibold text-[#177E55] transition hover:text-[#101211] disabled:cursor-not-allowed disabled:opacity-50"
              >
                로그인
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignUpPage;
