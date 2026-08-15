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

  const handleBack =
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

  const handleDeleteAccount =
    () => {
      setError(
        '현재 계정 탈퇴 API가 준비되지 않아 탈퇴 기능을 사용할 수 없습니다.',
      );
    };

  const displayInitial =
    (
      name ||
      profile?.name ||
      '사용자'
    )
      .trim()
      .charAt(0);

  return (
    <>
      <div className="h-full w-full overflow-y-auto pb-12">
        <div className="mx-auto w-full max-w-[760px]">
          <header className="mb-10">
            <button
              type="button"
              onClick={() =>
                navigate(
                  '/mypage',
                )
              }
              className="flex items-center gap-2 text-sm font-semibold text-[#101211]"
            >
              <ArrowLeftIcon />
              프로필 설정
            </button>
          </header>

          {error && (
            <div className="mb-5 rounded-lg bg-[#FFF1F0] px-4 py-3 text-xs text-[#F64E42]">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 rounded-lg bg-[#EFFFF8] px-4 py-3 text-xs text-[#16885B]">
              {successMessage}
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-[450px] items-center justify-center">
              <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#DCE5E1] border-t-[#31F5A0]" />
            </div>
          ) : (
            <div>
              <section>
                <p className="mb-6 text-xs font-semibold text-[#59625F]">
                  프로필 설정
                </p>

                <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-12">
                  <div className="flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#D8D8D8] text-xl font-semibold text-[#59625F]">
                      {
                        displayInitial
                      }
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="profile-setting-name"
                        className="text-xs font-semibold text-[#303633]"
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
                        ) =>
                          setName(
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-2 h-10 w-full rounded-md border border-[#E1E6E3] bg-[#F2F7F4] px-3 text-xs text-[#101211] outline-none focus:border-[#AAB8B1]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="profile-organization"
                          className="text-xs font-semibold text-[#303633]"
                        >
                          소속 조직
                        </label>

                        <input
                          id="profile-organization"
                          type="text"
                          value={
                            profile?.organizationName ??
                            ''
                          }
                          readOnly
                          className="mt-2 h-10 w-full rounded-md border border-[#E1E6E3] bg-[#F7F9F8] px-3 text-xs text-[#8A9490]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="profile-position"
                          className="text-xs font-semibold text-[#303633]"
                        >
                          직급
                        </label>

                        <input
                          id="profile-position"
                          type="text"
                          value="-"
                          disabled
                          className="mt-2 h-10 w-full rounded-md border border-[#E1E6E3] bg-[#F7F9F8] px-3 text-xs text-[#A7B0AC]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="profile-email"
                        className="text-xs font-semibold text-[#303633]"
                      >
                        이메일 주소
                      </label>

                      <input
                        id="profile-email"
                        type="email"
                        value={
                          profile?.email ??
                          ''
                        }
                        readOnly
                        className="mt-2 h-10 w-full rounded-md border border-[#E1E6E3] bg-[#F2F7F4] px-3 text-xs text-[#8A9490]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="profile-phone"
                        className="text-xs font-semibold text-[#303633]"
                      >
                        연락처
                      </label>

                      <input
                        id="profile-phone"
                        type="text"
                        value=""
                        placeholder="연락처 정보 없음"
                        disabled
                        className="mt-2 h-10 w-full rounded-md border border-[#E1E6E3] bg-[#F7F9F8] px-3 text-xs text-[#A7B0AC]"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#303633]">
                        비밀번호 변경
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setPasswordError(
                            '',
                          );

                          setIsPasswordModalOpen(
                            true,
                          );
                        }}
                        className="mt-2 flex h-10 w-full items-center justify-between rounded-md border border-[#E1E6E3] bg-[#F2F7F4] px-3 text-left text-xs text-[#59625F]"
                      >
                        <span>
                          ••••••••
                        </span>

                        <span className="text-[11px] font-semibold text-[#303633]">
                          변경
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <div className="mt-16 flex justify-center gap-3">
                <button
                  type="button"
                  disabled={
                    isSaving ||
                    !name.trim()
                  }
                  onClick={
                    handleBack
                  }
                  className="h-10 min-w-[170px] rounded-md bg-[#101211] px-6 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isSaving
                    ? '저장 중...'
                    : '이전으로 가기'}
                </button>

                <button
                  type="button"
                  onClick={
                    handleDeleteAccount
                  }
                  className="h-10 min-w-[100px] rounded-md bg-[#F64E42] px-5 text-xs font-semibold text-white"
                >
                  계정 탈퇴
                </button>
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
