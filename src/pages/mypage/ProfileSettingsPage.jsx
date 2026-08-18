import {
  useEffect,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  deleteMyProfileImage,
  getMyProfile,
  updateMyProfileImage,
  updateMyPassword,
  updateMyProfile,
} from '../../api/mypageApi';

import ProfileAvatar from '../../components/common/ProfileAvatar';
import PasswordChangeModal from '../../components/feature/mypage/PasswordChangeModal';

const MAX_PROFILE_IMAGE_SIZE =
  5 * 1024 * 1024;

const PROFILE_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const MAX_PROFILE_TEXT_LENGTH = 20;

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

function DepartmentIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 7H20V19H4V7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M8 7V5H16V7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M8 11H16M8 15H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PositionIcon() {
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
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M6 19C6 15.6863 8.68629 13 12 13C15.3137 13 18 15.6863 18 19"
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
    department,
    setDepartment,
  ] = useState('');

  const [
    position,
    setPosition,
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

  const [
    isUpdatingImage,
    setIsUpdatingImage,
  ] = useState(false);

  const [
    profileImageRefreshKey,
    setProfileImageRefreshKey,
  ] = useState(0);

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

          setDepartment(
            nextProfile?.department ??
            '',
          );

          setPosition(
            nextProfile?.position ??
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
            requestError?.response?.data?.message ??
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

  const hasProfileChanged =
    name.trim() !==
    (profile?.name ?? '') ||
    department.trim() !==
    (profile?.department ?? '') ||
    position.trim() !==
    (profile?.position ?? '');

  const validateProfile = () => {
    if (!name.trim()) {
      return '이름을 입력해주세요.';
    }

    if (!department.trim()) {
      return '부서를 입력해주세요.';
    }

    if (!position.trim()) {
      return '직함을 입력해주세요.';
    }

    if (
      department.trim().length >
      MAX_PROFILE_TEXT_LENGTH
    ) {
      return '부서는 20자 이하로 입력해주세요.';
    }

    if (
      position.trim().length >
      MAX_PROFILE_TEXT_LENGTH
    ) {
      return '직함은 20자 이하로 입력해주세요.';
    }

    return '';
  };

  const handleSaveAndBack =
    async () => {
      if (isSaving) {
        return;
      }

      const validationError =
        validateProfile();

      if (validationError) {
        setError(
          validationError,
        );

        return;
      }

      if (!hasProfileChanged) {
        navigate('/mypage');

        return;
      }

      try {
        setIsSaving(true);
        setError('');

        await updateMyProfile({
          name:
            name.trim(),

          department:
            department.trim(),

          position:
            position.trim(),
        });

        window.dispatchEvent(
          new Event(
            'profile-updated',
          ),
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
          requestError?.response?.data?.message ??
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
          requestError?.response?.data?.message ??
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

  const handleProfileImageChange =
    async (event) => {
      const image =
        event.target.files?.[0];

      event.target.value = '';

      if (
        !image ||
        isUpdatingImage
      ) {
        return;
      }

      if (
        !PROFILE_IMAGE_TYPES.includes(
          image.type,
        )
      ) {
        setError(
          'JPEG, PNG, WebP 이미지만 등록할 수 있습니다.',
        );

        return;
      }

      if (
        image.size >
        MAX_PROFILE_IMAGE_SIZE
      ) {
        setError(
          '프로필 이미지는 최대 5MB까지 등록할 수 있습니다.',
        );

        return;
      }

      try {
        setIsUpdatingImage(
          true,
        );

        setError('');
        setSuccessMessage('');

        const response =
          await updateMyProfileImage(
            image,
          );

        const profileImageUrl =
          response?.result?.profileImageUrl ??
          null;

        setProfile(
          (currentProfile) => ({
            ...currentProfile,
            profileImageUrl,
          }),
        );

        setProfileImageRefreshKey(
          (currentKey) =>
            currentKey + 1,
        );

        setSuccessMessage(
          '프로필 이미지가 변경되었습니다.',
        );

        window.dispatchEvent(
          new Event(
            'profile-updated',
          ),
        );
      } catch (
      requestError
      ) {
        console.error(
          'Failed to update profile image:',
          requestError,
        );

        setError(
          requestError?.response?.data?.message ??
          '프로필 이미지를 변경하지 못했습니다.',
        );
      } finally {
        setIsUpdatingImage(
          false,
        );
      }
    };

  const handleProfileImageDelete =
    async () => {
      if (isUpdatingImage) {
        return;
      }

      if (
        !profile?.profileImageUrl
      ) {
        return;
      }

      try {
        setIsUpdatingImage(
          true,
        );

        setError('');
        setSuccessMessage('');

        await deleteMyProfileImage();

        setProfile(
          (currentProfile) => ({
            ...currentProfile,
            profileImageUrl: null,
          }),
        );

        setProfileImageRefreshKey(
          (currentKey) =>
            currentKey + 1,
        );

        setSuccessMessage(
          '프로필 이미지가 삭제되었습니다.',
        );

        window.dispatchEvent(
          new Event(
            'profile-updated',
          ),
        );
      } catch (
      requestError
      ) {
        console.error(
          'Failed to delete profile image:',
          requestError,
        );

        setError(
          requestError?.response?.data?.message ??
          '프로필 이미지를 삭제하지 못했습니다.',
        );
      } finally {
        setIsUpdatingImage(
          false,
        );
      }
    };

  const displayName =
    name ||
    profile?.name ||
    '사용자';

  return (
    <>
      <div className="h-full w-full overflow-y-auto pb-14">
        <div className="mx-auto w-full max-w-[820px]">
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
                내 프로필과 계정 정보를 관리할 수 있습니다.
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
                  프로필 정보를 불러오고 있습니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 프로필 이미지 */}
              <section className="flex items-center gap-5 rounded-2xl border border-[#E3E9E6] bg-white px-7 py-6">
                <ProfileAvatar
                  userId={
                    profile?.userId
                  }
                  profileImageUrl={
                    profile?.profileImageUrl
                  }
                  name={
                    displayName
                  }
                  refreshKey={
                    profileImageRefreshKey
                  }
                  className="size-20 shrink-0 border border-[#C7F9DF] text-2xl"
                />

                <div className="min-w-0 flex-1">
                  <p className="text-xl font-semibold text-[#101211]">
                    {displayName}
                  </p>

                  {(department ||
                    position) && (
                      <p className="mt-1 text-sm font-medium text-[#59625F]">
                        {[
                          department,
                          position,
                        ]
                          .filter(
                            Boolean,
                          )
                          .join(' · ')}
                      </p>
                    )}

                  <p className="mt-1 text-sm text-[#707A76]">
                    {profile?.organizationName ??
                      '소속 조직'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <label
                      className={`flex h-9 items-center rounded-lg bg-[#101211] px-3.5 text-xs font-semibold text-white transition ${isUpdatingImage
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer hover:bg-[#292E2B]'
                        }`}
                    >
                      {isUpdatingImage
                        ? '처리 중...'
                        : '이미지 변경'}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={
                          isUpdatingImage
                        }
                        onChange={
                          handleProfileImageChange
                        }
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      disabled={
                        isUpdatingImage ||
                        !profile?.profileImageUrl
                      }
                      onClick={
                        handleProfileImageDelete
                      }
                      className="h-9 rounded-lg border border-[#D8DFDC] px-3.5 text-xs font-semibold text-[#59625F] transition hover:bg-[#F5F7F6] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      이미지 삭제
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-[#9AA39F]">
                    JPEG, PNG, WebP · 최대 5MB
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
                    서비스에서 사용하는 프로필 정보를 수정할 수 있습니다.
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-[#E3E9E6] bg-white">
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
                          value={
                            name
                          }
                          onChange={(
                            event,
                          ) => {
                            setName(
                              event.target.value,
                            );

                            setError('');
                          }}
                          className="mt-2 h-10 w-full rounded-lg border border-[#D8DFDC] bg-white px-3 text-sm font-medium text-[#101211] outline-none transition focus:border-[#31F5A0]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mx-5 border-t border-[#EDF1EF]" />

                  {/* 부서 */}
                  <div className="px-5 py-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFFFF7] text-[#16885B]">
                        <DepartmentIcon />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <label
                            htmlFor="profile-setting-department"
                            className="text-xs font-semibold text-[#59625F]"
                          >
                            부서
                            <span className="ml-1 text-[#F64E42]">
                              *
                            </span>
                          </label>

                          <span className="text-[10px] text-[#A0A8A4]">
                            {department.length}
                            /20
                          </span>
                        </div>

                        <input
                          id="profile-setting-department"
                          type="text"
                          maxLength={
                            MAX_PROFILE_TEXT_LENGTH
                          }
                          value={
                            department
                          }
                          onChange={(
                            event,
                          ) => {
                            setDepartment(
                              event.target.value,
                            );

                            setError('');
                          }}
                          placeholder="부서를 입력해주세요"
                          className="mt-2 h-10 w-full rounded-lg border border-[#D8DFDC] bg-white px-3 text-sm font-medium text-[#101211] outline-none transition placeholder:text-[#A5AFAB] focus:border-[#31F5A0]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mx-5 border-t border-[#EDF1EF]" />

                  {/* 직함 */}
                  <div className="px-5 py-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EFFFF7] text-[#16885B]">
                        <PositionIcon />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <label
                            htmlFor="profile-setting-position"
                            className="text-xs font-semibold text-[#59625F]"
                          >
                            직함
                            <span className="ml-1 text-[#F64E42]">
                              *
                            </span>
                          </label>

                          <span className="text-[10px] text-[#A0A8A4]">
                            {position.length}
                            /20
                          </span>
                        </div>

                        <input
                          id="profile-setting-position"
                          type="text"
                          maxLength={
                            MAX_PROFILE_TEXT_LENGTH
                          }
                          value={
                            position
                          }
                          onChange={(
                            event,
                          ) => {
                            setPosition(
                              event.target.value,
                            );

                            setError('');
                          }}
                          placeholder="직함을 입력해주세요"
                          className="mt-2 h-10 w-full rounded-lg border border-[#D8DFDC] bg-white px-3 text-sm font-medium text-[#101211] outline-none transition placeholder:text-[#A5AFAB] focus:border-[#31F5A0]"
                        />
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
                        소속 조직은 변경할 수 없습니다.
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-[#F1F5F3] px-2.5 py-1 text-[10px] font-medium text-[#707A76]">
                      변경 불가
                    </span>
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
                    로그인에 사용하는 계정 정보를 확인하고 관리할 수 있습니다.
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
                        현재 비밀번호를 확인한 뒤 변경할 수 있습니다.
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-[#59625F] transition group-hover:text-[#101211]">
                      변경
                      <ChevronRightIcon />
                    </div>
                  </button>
                </div>
              </section>

              {/* 하단 액션 */}
              <div className="flex justify-end gap-2 border-t border-[#EDF1EF] pt-6">
                <button
                  type="button"
                  disabled={
                    isSaving
                  }
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
                    !name.trim() ||
                    !department.trim() ||
                    !position.trim()
                  }
                  onClick={
                    handleSaveAndBack
                  }
                  className={`h-10 min-w-[120px] rounded-lg px-5 text-xs font-semibold transition ${hasProfileChanged
                    ? 'bg-[#31F5A0] text-[#101211] hover:brightness-[0.97]'
                    : 'bg-[#101211] text-white hover:bg-[#292E2B]'
                    } disabled:cursor-not-allowed disabled:bg-[#DDE4E1] disabled:text-[#9FA8A4]`}
                >
                  {isSaving
                    ? '저장 중...'
                    : hasProfileChanged
                      ? '저장'
                      : '완료'}
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
