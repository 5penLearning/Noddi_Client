import {
  useEffect,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  getMyProfile,
  updateMyPassword,
  updateMyProfile,
} from '../../api/mypageApi';

import PasswordChangeModal from '../../components/feature/mypage/PasswordChangeModal';

function ArrowLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
        d="M5 20C5 16.6863 8.13401 14 12 14C15.866 14 19 16.6863 19 20"
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
        d="M4.5 7L12 13L19.5 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 21V4H16V21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M16 9H20V21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M8 8H10M8 12H10M8 16H10M13 8H14M13 12H14M13 16H14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M3 21H21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
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

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileSettingsPage() {
  const navigate = useNavigate();

  const location =
    useLocation();

  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    name,
    setName,
  ] = useState('');

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('');

  const [
    isPasswordModalOpen,
    setIsPasswordModalOpen,
  ] = useState(false);

  const [
    isChangingPassword,
    setIsChangingPassword,
  ] = useState(false);

  const [
    passwordError,
    setPasswordError,
  ] = useState('');

  useEffect(() => {
    if (
      !location.state
        ?.passwordVerified
    ) {
      navigate(
        '/mypage',
        {
          replace: true,
        },
      );

      return;
    }

    let cancelled = false;

    const loadProfile =
      async () => {
        try {
          setIsLoading(true);
          setError('');

          const response =
            await getMyProfile();

          if (cancelled) {
            return;
          }

          const nextProfile =
            response?.result ??
            null;

          setProfile(
            nextProfile,
          );

          setName(
            nextProfile?.name ??
            '',
          );
        } catch (
        requestError
        ) {
          if (cancelled) {
            return;
          }

          console.error(
            'Failed to load profile:',
            requestError,
          );

          setError(
            requestError?.response
              ?.data?.message ??
            '프로필 정보를 불러오지 못했습니다.',
          );
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [
    location.state,
    navigate,
  ]);

  const handleSaveAndBack =
    async () => {
      const trimmedName =
        name.trim();

      if (
        !trimmedName ||
        isSaving
      ) {
        return;
      }

      const hasNameChanged =
        trimmedName !==
        profile?.name;

      if (!hasNameChanged) {
        navigate('/mypage');

        return;
      }

      try {
        setIsSaving(true);

        setError('');

        await updateMyProfile(
          trimmedName,
        );

        navigate('/mypage');
      } catch (
      requestError
      ) {
        console.error(
          'Failed to update profile:',
          requestError,
        );

        setError(
          requestError?.response
            ?.data?.message ??
          '프로필을 수정하지 못했습니다.',
        );
      } finally {
        setIsSaving(false);
      }
    };

  const handlePasswordChange =
    async ({
      currentPassword,
      newPassword,
    }) => {
      try {
        setIsChangingPassword(
          true,
        );

        setPasswordError('');
        setSuccessMessage('');

        await updateMyPassword({
          currentPassword,
          newPassword,
        });

        setIsPasswordModalOpen(
          false,
        );

        setSuccessMessage(
          '비밀번호가 변경되었습니다.',
        );
      } catch (
      requestError
      ) {
        console.error(
          'Failed to change password:',
          requestError,
        );

        setPasswordError(
          requestError?.response
            ?.data?.message ??
          '비밀번호를 변경하지 못했습니다.',
        );
      } finally {
        setIsChangingPassword(
          false,
        );
      }
    };

  const handleOpenPasswordModal =
    () => {
      setPasswordError('');
      setSuccessMessage('');

      setIsPasswordModalOpen(
        true,
      );
    };

  const handleDeleteAccount =
    () => {
      setError(
        '현재 계정 탈퇴 API가 준비되지 않아 탈퇴 기능을 사용할 수 없습니다.',
      );
    };

  const displayName =
    name ||
    profile?.name ||
    '사용자';

  const displayInitial =
    displayName
      .trim()
      .charAt(0);

  const hasNameChanged =
    name.trim() !==
    profile?.name;

  return (
    <>
      <div className="h-full w-full overflow-y-auto pb-14">
        <div className="mx-auto w-full max-w-[820px]">
          {/* 헤더 */}
          <header className="mb-7">
            <button
              type="button"
              onClick={() =>
                navigate('/mypage')
              }
              className="flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-[#59625F] transition hover:bg-[#F2F6F4] hover:text-[#101211]"
            >
              <ArrowLeftIcon />
              마이페이지
            </button>

            <div className="mt-4">
              <h1 className="text-2xl font-semibold text-[#101211]">
                프로필 설정
              </h1>

              <p className="mt-1 text-sm text-[#8A9490]">
                내 프로필과 계정
                정보를 관리할 수
                있습니다.
              </p>
            </div>
          </header>

          {error && (
            <div className="mb-5 rounded-xl border border-[#FFDAD6] bg-[#FFF5F4] px-4 py-3 text-sm text-[#D83D34]">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 rounded-xl border border-[#C8F7DF] bg-[#EDFFF6] px-4 py-3 text-sm text-[#16885B]">
              {successMessage}
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-[520px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-[#DCE5E1] border-t-[#31F5A0]" />

                <p className="mt-4 text-sm text-[#707A76]">
                  프로필 정보를
                  불러오고 있습니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 프로필 헤더 */}
              <section className="flex items-center gap-5 rounded-2xl border border-[#E3E9E6] bg-white px-7 py-6">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[#C7F9DF] bg-[#EFFFF7] text-2xl font-semibold text-[#101211]">
                  {displayInitial}
                </div>

                <div className="min-w-0">
                  <p className="text-xl font-semibold text-[#101211]">
                    {displayName}
                  </p>

                  <p className="mt-1 text-sm text-[#707A76]">
                    {profile?.organizationName ??
                      '소속 조직'}
                  </p>

                  <p className="mt-2 text-xs text-[#9AA39F]">
                    현재 프로필 정보
                  </p>
                </div>
              </section>

              {/* 기본 정보 */}
              <section>
                <div className="mb-4">
                  <h2 className="text-[15px] font-semibold text-[#101211]">
                    기본 정보
                  </h2>

                  <p className="mt-1 text-xs text-[#8A9490]">
                    서비스에서 사용하는
                    이름과 소속 정보를
                    확인할 수 있습니다.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E3E9E6] bg-white">
                  {/* 이름 */}
                  <div className="px-5 py-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFFFF7] text-[#16885B]">
                        <UserIcon />
                      </div>

                      <div className="min-w-0 flex-1">
                        <label
                          htmlFor="profile-setting-name"
                          className="text-xs font-semibold text-[#59625F]"
                        >
                          이름
                          <span className="ml-1 text-[#F64E42]">
                            *
                          </span>
                        </label>

                        <input
                          id="profile-setting-name"
                          type="text"
                          value={name}
                          onChange={(
                            event,
                          ) => {
                            setName(
                              event.target.value,
                            );

                            setError('');
                          }}
                          className="mt-2 h-10 w-full rounded-lg border border-[#D8DFDC] bg-white px-3 text-sm font-medium text-[#101211] outline-none transition focus:border-[#101211]"
                        />

                        {hasNameChanged && (
                          <p className="mt-2 text-[11px] text-[#16885B]">
                            이름이
                            변경되었습니다.
                            돌아갈 때
                            저장됩니다.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mx-5 border-t border-[#EDF1EF]" />

                  {/* 소속 조직 */}
                  <div className="flex items-center gap-4 px-5 py-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F6F3] text-[#59625F]">
                      <BuildingIcon />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#59625F]">
                        소속 조직
                      </p>

                      <p className="mt-1.5 truncate text-sm font-semibold text-[#303633]">
                        {profile?.organizationName ??
                          '-'}
                      </p>

                      <p className="mt-1 text-[11px] text-[#9AA39F]">
                        소속 조직은
                        현재 변경할 수
                        없습니다.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 계정 정보 */}
              <section>
                <div className="mb-4">
                  <h2 className="text-[15px] font-semibold text-[#101211]">
                    계정 정보
                  </h2>

                  <p className="mt-1 text-xs text-[#8A9490]">
                    로그인에 사용하는
                    계정 정보를 관리할 수
                    있습니다.
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#E3E9E6] bg-white">
                  {/* 이메일 */}
                  <div className="flex items-center gap-4 px-5 py-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F6F3] text-[#59625F]">
                      <MailIcon />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#59625F]">
                        이메일 주소
                      </p>

                      <p className="mt-1.5 truncate text-sm font-semibold text-[#303633]">
                        {profile?.email ??
                          '-'}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-[#F1F5F3] px-2.5 py-1 text-[10px] font-medium text-[#707A76]">
                      변경 불가
                    </span>
                  </div>

                  <div className="mx-5 border-t border-[#EDF1EF]" />

                  {/* 비밀번호 */}
                  <button
                    type="button"
                    onClick={
                      handleOpenPasswordModal
                    }
                    className="group flex w-full items-center gap-4 px-5 py-5 text-left transition hover:bg-[#FAFBFA]"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F6F3] text-[#59625F]">
                      <LockIcon />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[#59625F]">
                        비밀번호
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-[#303633]">
                        ••••••••
                      </p>

                      <p className="mt-1 text-[11px] text-[#9AA39F]">
                        비밀번호를
                        변경할 수
                        있습니다.
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-[#59625F] transition group-hover:text-[#101211]">
                      변경
                      <ChevronRightIcon />
                    </div>
                  </button>
                </div>
              </section>

              {/* 아직 서버 필드가 없는 정보 */}
              <section>
                <div className="mb-4">
                  <h2 className="text-[15px] font-semibold text-[#101211]">
                    추가 정보
                  </h2>

                  <p className="mt-1 text-xs text-[#8A9490]">
                    추가 프로필 정보는
                    추후 제공될 예정입니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#E3E9E6] bg-[#FAFBFA] px-5 py-4">
                    <p className="text-xs font-semibold text-[#707A76]">
                      직급
                    </p>

                    <p className="mt-2 text-sm text-[#A0A8A4]">
                      등록된 정보 없음
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E3E9E6] bg-[#FAFBFA] px-5 py-4">
                    <p className="text-xs font-semibold text-[#707A76]">
                      연락처
                    </p>

                    <p className="mt-2 text-sm text-[#A0A8A4]">
                      등록된 정보 없음
                    </p>
                  </div>
                </div>
              </section>

              {/* 하단 액션 */}
              <div className="flex items-center justify-between border-t border-[#EDF1EF] pt-6">
                <button
                  type="button"
                  onClick={
                    handleDeleteAccount
                  }
                  className="text-xs font-medium text-[#F64E42] transition hover:underline"
                >
                  계정 탈퇴
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() =>
                      navigate('/mypage')
                    }
                    className="h-10 rounded-lg border border-[#D8DFDC] bg-white px-5 text-xs font-semibold text-[#59625F] transition hover:bg-[#F5F7F6] disabled:opacity-40"
                  >
                    취소
                  </button>

                  <button
                    type="button"
                    disabled={
                      isSaving ||
                      !name.trim()
                    }
                    onClick={
                      handleSaveAndBack
                    }
                    className="h-10 min-w-[120px] rounded-lg bg-[#101211] px-5 text-xs font-semibold text-white transition hover:bg-[#292E2B] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSaving
                      ? '저장 중...'
                      : hasNameChanged
                        ? '저장'
                        : '완료'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <PasswordChangeModal
        isOpen={
          isPasswordModalOpen
        }
        isSubmitting={
          isChangingPassword
        }
        error={
          passwordError
        }
        onClose={() => {
          if (
            isChangingPassword
          ) {
            return;
          }

          setPasswordError('');

          setIsPasswordModalOpen(
            false,
          );
        }}
        onSubmit={
          handlePasswordChange
        }
      />
    </>
  );
}

export default ProfileSettingsPage;
