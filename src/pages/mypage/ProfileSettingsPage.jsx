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
      width="19"
      height="19"
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
      width="19"
      height="19"
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
      width="19"
      height="19"
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
      width="19"
      height="19"
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

function CameraIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 8.5C4 7.11929 5.11929 6 6.5 6H8.5L10 4H14L15.5 6H17.5C18.8807 6 20 7.11929 20 8.5V17.5C20 18.8807 18.8807 20 17.5 20H6.5C5.11929 20 4 18.8807 4 17.5V8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="13"
        r="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7H19M9 7V5H15V7M7 7L8 20H16L17 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="17"
      height="17"
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

function SectionTitle({
  title,
  description,
}) {
  return (
    <div className="mb-4">
      <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#101211]">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-[13px] leading-5 text-[#6C8177]">
          {description}
        </p>
      )}
    </div>
  );
}

function FieldIcon({
  children,
}) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#EFFFF7] text-[#14885A]">
      {children}
    </div>
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
      if (
        isUpdatingImage ||
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

  const profileMeta = [
    department,
    position,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <div className="green-border-theme h-full w-full overflow-y-auto bg-[#FAFFFC] pb-16">
        <div className="mx-auto w-full max-w-[1080px] px-4 pt-1 sm:px-6 lg:px-8 xl:px-0">
          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() =>
                navigate('/mypage')
              }
              className="-ml-2 flex h-9 items-center gap-1 rounded-[10px] px-2 text-[13px] font-semibold text-[#527064] transition hover:bg-[#EFFFF7] hover:text-[#101211]"
            >
              <ArrowLeftIcon />
              마이페이지
            </button>
          </header>

          {error && (
            <div className="mb-5 rounded-[14px] border border-[#FFD7D2] bg-[#FFF6F5] px-4 py-3 text-[13px] text-[#D84A40]">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 rounded-[14px] border border-[#BFF4D9] bg-[#EDFFF6] px-4 py-3 text-[13px] text-[#14794F]">
              {successMessage}
            </div>
          )}

          {isLoading ? (
            <div className="flex min-h-[520px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-[3px] border-[#DDF7EA] border-t-[#31F5A0]" />

                <p className="mt-4 text-sm font-medium text-[#668077]">
                  프로필 정보를 불러오고 있습니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-7 sm:space-y-9">
              {/* Profile Hero */}
              <section className="relative overflow-hidden rounded-[24px] border border-[#D7F5E6] bg-white px-5 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-8">
                <div className="pointer-events-none absolute -right-16 -top-24 h-[250px] w-[250px] rounded-full bg-[#31F5A0]/10 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-24 left-[30%] h-[210px] w-[210px] rounded-full bg-[#31F7BD]/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
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
                    className="size-[82px] shrink-0 border-2 border-[#C8F8DE] text-2xl sm:size-[94px]"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-[22px] font-semibold tracking-[-0.02em] text-[#101211] sm:text-[26px]">
                      {displayName}
                    </h2>

                    {profileMeta && (
                      <p className="mt-1.5 text-[13px] font-semibold text-[#2B6650] sm:text-[14px]">
                        {profileMeta}
                      </p>
                    )}

                    <p className="mt-1 text-[13px] font-medium text-[#687F75]">
                      {profile?.organizationName ??
                        '소속 조직'}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <label
                        className={`flex h-10 items-center gap-2 rounded-[11px] bg-[#101211] px-4 text-[12px] font-semibold text-white transition ${isUpdatingImage
                          ? 'cursor-not-allowed opacity-50'
                          : 'cursor-pointer hover:bg-[#242826]'
                          }`}
                      >
                        <CameraIcon />

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
                        className="flex h-10 items-center gap-2 rounded-[11px] border border-[#D4EDE1] bg-white px-4 text-[12px] font-semibold text-[#557267] transition hover:bg-[#F3FFF9] hover:text-[#101211] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <TrashIcon />
                        이미지 삭제
                      </button>
                    </div>

                    <p className="mt-2.5 text-[11px] text-[#82998F]">
                      JPEG, PNG, WebP · 최대 5MB
                    </p>
                  </div>
                </div>
              </section>

              {/* Basic information */}
              <section>
                <SectionTitle
                  title="기본 정보"
                  description="서비스에서 사용하는 프로필 정보를 수정할 수 있습니다."
                />

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  {/* Name */}
                  <div className="rounded-[18px] border border-[#D8F2E5] bg-white p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <FieldIcon>
                        <UserIcon />
                      </FieldIcon>

                      <div className="min-w-0 flex-1">
                        <label
                          htmlFor="profile-setting-name"
                          className="text-[12px] font-semibold text-[#426456]"
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
                          placeholder="이름을 입력해주세요"
                          className="mt-2.5 h-11 w-full rounded-[11px] border border-[#D1EADB] bg-[#F8FFFB] px-3.5 text-[13px] font-medium text-[#101211] outline-none transition placeholder:text-[#91A69D] focus:border-[#31F5A0] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="rounded-[18px] border border-[#D8F2E5] bg-white p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <FieldIcon>
                        <DepartmentIcon />
                      </FieldIcon>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <label
                            htmlFor="profile-setting-department"
                            className="text-[12px] font-semibold text-[#426456]"
                          >
                            부서
                            <span className="ml-1 text-[#F64E42]">
                              *
                            </span>
                          </label>

                          <span className="text-[10px] font-medium text-[#8DA399]">
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
                          className="mt-2.5 h-11 w-full rounded-[11px] border border-[#D1EADB] bg-[#F8FFFB] px-3.5 text-[13px] font-medium text-[#101211] outline-none transition placeholder:text-[#91A69D] focus:border-[#31F5A0] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Position */}
                  <div className="rounded-[18px] border border-[#D8F2E5] bg-white p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <FieldIcon>
                        <PositionIcon />
                      </FieldIcon>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <label
                            htmlFor="profile-setting-position"
                            className="text-[12px] font-semibold text-[#426456]"
                          >
                            직함
                            <span className="ml-1 text-[#F64E42]">
                              *
                            </span>
                          </label>

                          <span className="text-[10px] font-medium text-[#8DA399]">
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
                          className="mt-2.5 h-11 w-full rounded-[11px] border border-[#D1EADB] bg-[#F8FFFB] px-3.5 text-[13px] font-medium text-[#101211] outline-none transition placeholder:text-[#91A69D] focus:border-[#31F5A0] focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Organization */}
                  <div className="rounded-[18px] border border-[#D8F2E5] bg-white p-5 sm:p-6">
                    <div className="flex items-center gap-4">
                      <FieldIcon>
                        <BuildingIcon />
                      </FieldIcon>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[12px] font-semibold text-[#426456]">
                            소속 조직
                          </p>

                          <span className="rounded-full bg-[#E9FFF4] px-2 py-0.5 text-[9px] font-semibold text-[#3C765D]">
                            변경 불가
                          </span>
                        </div>

                        <p className="mt-2 truncate text-[14px] font-semibold text-[#101211]">
                          {profile?.organizationName ??
                            '-'}
                        </p>

                        <p className="mt-1 text-[11px] text-[#7B9288]">
                          가입한 조직 정보입니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Account */}
              <section>
                <SectionTitle
                  title="계정 정보"
                  description="로그인에 사용하는 계정 정보를 확인하고 관리할 수 있습니다."
                />

                <div className="overflow-hidden rounded-[20px] border border-[#D8F2E5] bg-white">
                  {/* Email */}
                  <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
                    <FieldIcon>
                      <MailIcon />
                    </FieldIcon>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[12px] font-semibold text-[#426456]">
                          이메일 주소
                        </p>

                        <span className="rounded-full bg-[#E9FFF4] px-2 py-0.5 text-[9px] font-semibold text-[#3C765D]">
                          변경 불가
                        </span>
                      </div>

                      <p className="mt-1.5 truncate text-[14px] font-semibold text-[#101211]">
                        {profile?.email ??
                          '-'}
                      </p>
                    </div>
                  </div>

                  <div className="mx-5 border-t border-[#E5F5ED] sm:mx-6" />

                  {/* Password */}
                  <button
                    type="button"
                    onClick={
                      handleOpenPasswordModal
                    }
                    className="group flex w-full items-center gap-4 px-5 py-5 text-left transition hover:bg-[#F4FFF9] sm:px-6"
                  >
                    <FieldIcon>
                      <LockIcon />
                    </FieldIcon>

                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-[#426456]">
                        비밀번호
                      </p>

                      <p className="mt-1.5 text-[14px] font-semibold tracking-[0.08em] text-[#101211]">
                        ••••••••
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-[#7B9288]">
                        현재 비밀번호를 확인한 뒤 변경할 수 있습니다.
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-[#4F7162] transition group-hover:text-[#101211]">
                      변경
                      <ChevronRightIcon />
                    </div>
                  </button>
                </div>
              </section>

              {/* Bottom actions */}
              <div className="sticky bottom-0 z-10 -mx-4 border-t border-[#DCF0E6] bg-[#FAFFFC]/95 px-4 py-4 backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={
                      isSaving
                    }
                    onClick={() =>
                      navigate('/mypage')
                    }
                    className="h-11 rounded-[11px] border border-[#D2E9DE] bg-white px-6 text-[12px] font-semibold text-[#587368] transition hover:bg-[#F5FFF9] hover:text-[#101211] disabled:opacity-40 sm:min-w-[100px]"
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
                    className={`h-11 rounded-[11px] px-6 text-[12px] font-semibold transition sm:min-w-[130px] ${hasProfileChanged
                      ? 'bg-[#31F5A0] text-[#101211] hover:brightness-[0.97]'
                      : 'bg-[#101211] text-white hover:bg-[#242826]'
                      } disabled:cursor-not-allowed disabled:bg-[#DDEDE5] disabled:text-[#8DA198]`}
                  >
                    {isSaving
                      ? '저장 중...'
                      : hasProfileChanged
                        ? '변경사항 저장'
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
