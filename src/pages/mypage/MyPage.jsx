import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  getMyProfile,
  getOrganizationProjects,
  getProjectInvitations,
  getProjectMembers,
  getTeamInvitations,
  leaveProject,
  respondProjectInvitation,
  respondTeamInvitation,
  verifyCurrentPassword,
} from '../../api/mypageApi';

import {
  clearAuthSession,
} from '../../api/axios';

import ProfileAvatar from '../../components/common/ProfileAvatar';
import PasswordConfirmModal from '../../components/feature/mypage/PasswordConfirmModal';
import ProjectActionMenu from '../../components/feature/mypage/ProjectActionMenu';

function MoreIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="5"
        cy="12"
        r="1.5"
        fill="currentColor"
      />

      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill="currentColor"
      />

      <circle
        cx="19"
        cy="12"
        r="1.5"
        fill="currentColor"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13.5 6.5L17.5 10.5M4 20L8.2 19.2L19 8.4C20.1 7.3 20.1 5.5 19 4.4C17.9 3.3 16.1 3.3 15 4.4L4.2 15.2L4 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7.5C3 6.11929 4.11929 5 5.5 5H9L11 7H18.5C19.8807 7 21 8.11929 21 9.5V17.5C21 18.8807 19.8807 20 18.5 20H5.5C4.11929 20 3 18.8807 3 17.5V7.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InvitationIcon() {
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

      <path
        d="M18 4V9M15.5 6.5H20.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 5H6C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19H10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M14 8L18 12L14 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
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
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M3.5 12H20.5M12 3C14.3 5.5 15.5 8.5 15.5 12C15.5 15.5 14.3 18.5 12 21M12 3C9.7 5.5 8.5 8.5 8.5 12C8.5 15.5 9.7 18.5 12 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getRoleLabel(role) {
  if (role === 'LEADER') {
    return '리더';
  }

  return '멤버';
}

function normalizeProjects(response) {
  const result =
    response?.result;

  if (Array.isArray(result)) {
    return result;
  }

  if (result) {
    return [result];
  }

  return [];
}

function normalizeInvitations(
  projectInvitations,
  teamInvitations,
) {
  const projects =
    projectInvitations.map(
      (invitation) => ({
        ...invitation,

        key: `PROJECT-${invitation.inviteId}`,

        type: 'PROJECT',

        targetName:
          invitation.projectName,

        targetDescription:
          invitation.projectDescription ??
          '',

        role:
          invitation.offeredRole ??
          null,
      }),
    );

  const teams =
    teamInvitations.map(
      (invitation) => ({
        ...invitation,

        key: `TEAM-${invitation.inviteId}`,

        type: 'TEAM',

        targetName:
          invitation.teamName,

        targetDescription:
          '팀 초대',

        role: null,
      }),
    );

  return [
    ...projects,
    ...teams,
  ];
}

function SectionTitle({
  title,
  description,
  count,
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-[#101211]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-[13px] leading-5 text-[#6C8177]">
            {description}
          </p>
        )}
      </div>

      {typeof count === 'number' && (
        <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-[#E7FFF3] px-2.5 text-[11px] font-semibold text-[#14885A]">
          {count}
        </span>
      )}
    </div>
  );
}

function MyPage() {
  const navigate = useNavigate();

  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    invitations,
    setInvitations,
  ] = useState([]);

  const [
    myProjects,
    setMyProjects,
  ] = useState([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    respondingInvitationKey,
    setRespondingInvitationKey,
  ] = useState(null);

  const [
    openProjectMenuId,
    setOpenProjectMenuId,
  ] = useState(null);

  const [
    leavingProjectId,
    setLeavingProjectId,
  ] = useState(null);

  const [
    pageError,
    setPageError,
  ] = useState('');

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('');

  const [
    isPasswordConfirmOpen,
    setIsPasswordConfirmOpen,
  ] = useState(false);

  const [
    isVerifyingPassword,
    setIsVerifyingPassword,
  ] = useState(false);

  const [
    passwordConfirmError,
    setPasswordConfirmError,
  ] = useState('');

  const [
    autoLogin,
    setAutoLogin,
  ] = useState(() => {
    return (
      localStorage.getItem(
        'noddi_auto_login',
      ) !== 'false'
    );
  });

  const [
    timezone,
    setTimezone,
  ] = useState(() => {
    return (
      localStorage.getItem(
        'noddi_timezone',
      ) ?? 'Asia/Seoul'
    );
  });

  const loadMyPage =
    useCallback(async () => {
      try {
        setIsLoading(true);

        setPageError('');

        const [
          profileResponse,
          projectInvitationResponse,
          teamInvitationResponse,
          projectResponse,
        ] = await Promise.all([
          getMyProfile(),
          getProjectInvitations(),
          getTeamInvitations(),
          getOrganizationProjects(),
        ]);

        const profileData =
          profileResponse?.result ??
          null;

        const projectInvitations =
          projectInvitationResponse
            ?.result ?? [];

        const teamInvitations =
          teamInvitationResponse
            ?.result ?? [];

        setProfile(
          profileData,
        );

        setInvitations(
          normalizeInvitations(
            projectInvitations,
            teamInvitations,
          ),
        );

        if (
          !profileData?.userId
        ) {
          setMyProjects([]);

          return;
        }

        const projects =
          normalizeProjects(
            projectResponse,
          );

        const projectResults =
          await Promise.all(
            projects.map(
              async (project) => {
                try {
                  const memberResponse =
                    await getProjectMembers(
                      project.projectId,
                    );

                  const members =
                    memberResponse?.result ??
                    [];

                  const me =
                    members.find(
                      (member) =>
                        Number(
                          member.userId,
                        ) ===
                        Number(
                          profileData.userId,
                        ),
                    );

                  if (!me) {
                    return null;
                  }

                  return {
                    ...project,

                    myRole:
                      me.role ??
                      'MEMBER',
                  };
                } catch (error) {
                  console.error(
                    `Failed to load project members: ${project.projectId}`,
                    error,
                  );

                  return null;
                }
              },
            ),
          );

        setMyProjects(
          projectResults.filter(
            Boolean,
          ),
        );
      } catch (error) {
        console.error(
          'Failed to load my page:',
          error,
        );

        setPageError(
          error?.response?.data
            ?.message ??
          '마이페이지 정보를 불러오지 못했습니다.',
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    loadMyPage();
  }, [loadMyPage]);

  const handleInvitation =
    async (
      invitation,
      isAccepted,
    ) => {
      if (
        respondingInvitationKey
      ) {
        return;
      }

      try {
        setRespondingInvitationKey(
          invitation.key,
        );

        setPageError('');
        setSuccessMessage('');

        if (
          invitation.type ===
          'TEAM'
        ) {
          await respondTeamInvitation(
            invitation.inviteId,
            isAccepted,
          );
        } else {
          await respondProjectInvitation(
            invitation.inviteId,
            isAccepted,
          );
        }

        setSuccessMessage(
          isAccepted
            ? '초대를 수락했습니다.'
            : '초대를 거절했습니다.',
        );

        await loadMyPage();
      } catch (error) {
        console.error(
          'Failed to respond invitation:',
          error,
        );

        setPageError(
          error?.response?.data
            ?.message ??
          '초대 응답에 실패했습니다.',
        );
      } finally {
        setRespondingInvitationKey(
          null,
        );
      }
    };

  const handleOpenProfileSettings =
    () => {
      setPasswordConfirmError('');

      setIsPasswordConfirmOpen(
        true,
      );
    };

  const handleClosePasswordConfirm =
    () => {
      if (isVerifyingPassword) {
        return;
      }

      setPasswordConfirmError('');

      setIsPasswordConfirmOpen(
        false,
      );
    };

  const handleVerifyPassword =
    async (password) => {
      if (!profile?.email) {
        setPasswordConfirmError(
          '사용자 이메일 정보를 확인할 수 없습니다.',
        );

        return;
      }

      try {
        setIsVerifyingPassword(
          true,
        );

        setPasswordConfirmError('');

        const response =
          await verifyCurrentPassword({
            email:
              profile.email,

            password,
          });

        const verifiedUserId =
          response?.result?.userId;

        if (
          verifiedUserId &&
          Number(
            verifiedUserId,
          ) !==
          Number(
            profile.userId,
          )
        ) {
          throw new Error(
            '사용자 정보를 확인하지 못했습니다.',
          );
        }

        setIsPasswordConfirmOpen(
          false,
        );

        navigate(
          '/mypage/profile',
          {
            state: {
              passwordVerified:
                true,
            },
          },
        );
      } catch (error) {
        console.error(
          'Failed to verify password:',
          error,
        );

        setPasswordConfirmError(
          error?.response?.data
            ?.message ??
          error?.message ??
          '비밀번호가 일치하지 않습니다.',
        );
      } finally {
        setIsVerifyingPassword(
          false,
        );
      }
    };

  const handleToggleProjectMenu =
    (projectId) => {
      setOpenProjectMenuId(
        (previousId) =>
          previousId === projectId
            ? null
            : projectId,
      );
    };

  const handleOpenProject = (
    projectId,
  ) => {
    setOpenProjectMenuId(
      null,
    );

    navigate(
      `/projects/${projectId}`,
    );
  };

  const handleLeaveProject =
    async (project) => {
      if (
        !profile?.userId ||
        leavingProjectId
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `${project.name} 프로젝트에서 탈퇴할까요?`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setLeavingProjectId(
          project.projectId,
        );

        setOpenProjectMenuId(
          null,
        );

        setPageError('');
        setSuccessMessage('');

        await leaveProject(
          project.projectId,
          profile.userId,
        );

        setSuccessMessage(
          '프로젝트에서 탈퇴했습니다.',
        );

        await loadMyPage();
      } catch (error) {
        console.error(
          'Failed to leave project:',
          error,
        );

        setPageError(
          error?.response?.data
            ?.message ??
          '프로젝트에서 탈퇴하지 못했습니다.',
        );
      } finally {
        setLeavingProjectId(
          null,
        );
      }
    };

  const handleAutoLoginChange =
    () => {
      const nextValue =
        !autoLogin;

      setAutoLogin(
        nextValue,
      );

      localStorage.setItem(
        'noddi_auto_login',
        String(nextValue),
      );
    };

  const handleTimezoneChange =
    (event) => {
      const value =
        event.target.value;

      setTimezone(value);

      localStorage.setItem(
        'noddi_timezone',
        value,
      );
    };

  const handleLogout = () => {
    clearAuthSession();

    navigate('/login', {
      replace: true,
    });
  };

  const displayName =
    profile?.name ??
    '사용자';

  const profileMeta = [
    profile?.department,
    profile?.position,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <div className="h-full w-full overflow-y-auto bg-[#FAFFFC] pb-16">
        <div className="mx-auto w-full max-w-[1180px] px-4 pt-1 sm:px-6 lg:px-8 xl:px-0">
          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-[#101211] sm:text-[30px]">
              my
            </h1>

            <p className="mt-1.5 text-[13px] font-medium text-[#688077] sm:text-[14px]">
              내 정보와 참여 중인 프로젝트를 관리할 수 있습니다.
            </p>
          </header>

          {pageError && (
            <div className="mb-5 rounded-[14px] border border-[#FFD7D2] bg-[#FFF6F5] px-4 py-3 text-[13px] text-[#D84A40]">
              {pageError}
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
                  내 정보를 불러오고 있습니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Profile Hero */}
              <section className="relative overflow-hidden rounded-[24px] border border-[#D7F5E6] bg-white px-5 py-6 sm:px-7 sm:py-7 lg:px-9 lg:py-8">
                <div className="pointer-events-none absolute -right-20 -top-24 h-[250px] w-[250px] rounded-full bg-[#31F5A0]/10 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-28 left-[35%] h-[220px] w-[220px] rounded-full bg-[#31F7BD]/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4 sm:gap-6">
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
                      className="size-[72px] shrink-0 border-2 border-[#C9F9DF] text-xl sm:size-[86px] sm:text-2xl"
                    />

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-[21px] font-semibold tracking-[-0.02em] text-[#101211] sm:text-[25px]">
                          {displayName}
                        </h2>

                        <button
                          type="button"
                          onClick={
                            handleOpenProfileSettings
                          }
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#45685A] transition hover:bg-[#E9FFF4] hover:text-[#101211] sm:hidden"
                          aria-label="프로필 설정"
                        >
                          <EditIcon />
                        </button>
                      </div>

                      {profileMeta && (
                        <p className="mt-1.5 text-[13px] font-semibold text-[#2B6650] sm:text-[14px]">
                          {profileMeta}
                        </p>
                      )}

                      <p className="mt-1 text-[13px] font-medium text-[#617A70]">
                        {profile?.organizationName ??
                          '소속 조직'}
                      </p>

                      <p className="mt-2 truncate text-[12px] text-[#82998F]">
                        {profile?.email ??
                          ''}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleOpenProfileSettings
                    }
                    className="hidden h-11 shrink-0 items-center gap-2 rounded-[12px] bg-[#101211] px-5 text-[13px] font-semibold text-white transition hover:bg-[#232725] sm:flex"
                  >
                    <EditIcon />
                    프로필 설정
                  </button>
                </div>
              </section>

              {/* Main contents */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)]">
                {/* Projects */}
                <section className="min-w-0">
                  <SectionTitle
                    title="현재 참여중인 프로젝트"
                    description="참여하고 있는 프로젝트와 내 역할을 확인해보세요."
                    count={
                      myProjects.length
                    }
                  />

                  {myProjects.length ===
                    0 ? (
                    <div className="flex min-h-[230px] items-center justify-center rounded-[20px] border border-[#D8F2E5] bg-white px-6">
                      <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#EFFFF7] text-[#16885B]">
                          <FolderIcon />
                        </div>

                        <p className="mt-4 text-[14px] font-semibold text-[#335F4E]">
                          참여 중인 프로젝트가 없습니다.
                        </p>

                        <p className="mt-1 text-[12px] text-[#789084]">
                          프로젝트에 초대되면 이곳에서 확인할 수 있어요.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-visible rounded-[20px] border border-[#D8F2E5] bg-white px-3 py-2 sm:px-4 sm:py-3">
                      {myProjects.map(
                        (
                          project,
                          index,
                        ) => (
                          <div
                            key={
                              project.projectId
                            }
                            className={`relative flex items-center gap-3 rounded-[15px] px-3 py-4 transition hover:bg-[#F1FFF8] sm:gap-4 sm:px-4 ${index !==
                              myProjects.length -
                              1
                              ? 'border-b border-[#EAF8F1]'
                              : ''
                              }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenProject(
                                  project.projectId,
                                )
                              }
                              className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
                            >
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#EFFFF7] text-[#14885A] sm:h-12 sm:w-12">
                                <FolderIcon />
                              </div>

                              <div className="min-w-0">
                                <div className="flex min-w-0 flex-wrap items-center gap-2">
                                  <p className="max-w-full truncate text-[14px] font-semibold text-[#101211] sm:text-[15px]">
                                    {
                                      project.name
                                    }
                                  </p>

                                  <span
                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${project.myRole ===
                                      'LEADER'
                                      ? 'bg-[#31F5A0] text-[#101211]'
                                      : 'bg-[#E6FFF2] text-[#147A50]'
                                      }`}
                                  >
                                    {getRoleLabel(
                                      project.myRole,
                                    )}
                                  </span>
                                </div>

                                <p className="mt-1.5 line-clamp-1 text-[12px] leading-5 text-[#718A7F]">
                                  {project.description ??
                                    '프로젝트에 참여하고 있습니다.'}
                                </p>
                              </div>
                            </button>

                            <div className="relative shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleProjectMenu(
                                    project.projectId,
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-full text-[#567267] transition hover:bg-[#E8FFF3] hover:text-[#101211]"
                                aria-label="프로젝트 메뉴"
                              >
                                <MoreIcon />
                              </button>

                              {openProjectMenuId ===
                                project.projectId && (
                                  <ProjectActionMenu
                                    isLeaving={
                                      leavingProjectId ===
                                      project.projectId
                                    }
                                    onOpenProject={() =>
                                      handleOpenProject(
                                        project.projectId,
                                      )
                                    }
                                    onLeaveProject={() =>
                                      handleLeaveProject(
                                        project,
                                      )
                                    }
                                  />
                                )}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </section>

                {/* Invitations */}
                <section className="min-w-0">
                  <SectionTitle
                    title="받은 초대장"
                    description="새로운 프로젝트와 팀 초대를 확인하세요."
                    count={
                      invitations.length
                    }
                  />

                  <div className="rounded-[20px] border border-[#D8F2E5] bg-white p-3 sm:p-4">
                    {invitations.length ===
                      0 ? (
                      <div className="flex min-h-[230px] items-center justify-center px-5">
                        <div className="text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#EFFFF7] text-[#16885B]">
                            <InvitationIcon />
                          </div>

                          <p className="mt-4 text-[14px] font-semibold text-[#335F4E]">
                            새로운 초대가 없습니다.
                          </p>

                          <p className="mt-1 text-[12px] text-[#789084]">
                            초대가 도착하면 바로 알려드릴게요.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {invitations.map(
                          (
                            invitation,
                          ) => {
                            const isResponding =
                              respondingInvitationKey ===
                              invitation.key;

                            return (
                              <article
                                key={
                                  invitation.key
                                }
                                className="rounded-[16px] bg-[#F4FFF9] p-4"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-white text-[#15845A] shadow-[0_3px_10px_rgba(49,245,160,0.12)]">
                                    <InvitationIcon />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <p className="truncate text-[14px] font-semibold text-[#101211]">
                                        {
                                          invitation.targetName
                                        }
                                      </p>

                                      <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[9px] font-semibold text-[#358061]">
                                        {invitation.type ===
                                          'TEAM'
                                          ? '팀'
                                          : '프로젝트'}
                                      </span>
                                    </div>

                                    <p className="mt-1.5 text-[11px] leading-5 text-[#6E877B]">
                                      {
                                        invitation.inviterName
                                      }
                                      님이 초대했습니다.
                                    </p>

                                    {invitation.role && (
                                      <p className="mt-0.5 text-[11px] font-medium text-[#4C7564]">
                                        {getRoleLabel(
                                          invitation.role,
                                        )}{' '}
                                        역할
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    disabled={
                                      isResponding
                                    }
                                    onClick={() =>
                                      handleInvitation(
                                        invitation,
                                        false,
                                      )
                                    }
                                    className="h-9 rounded-[10px] border border-[#D8EEE4] bg-white text-[11px] font-semibold text-[#587469] transition hover:bg-[#F9FFFC] disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    거절
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      isResponding
                                    }
                                    onClick={() =>
                                      handleInvitation(
                                        invitation,
                                        true,
                                      )
                                    }
                                    className="h-9 rounded-[10px] bg-[#31F5A0] text-[11px] font-semibold text-[#101211] transition hover:brightness-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    {isResponding
                                      ? '처리 중'
                                      : '수락'}
                                  </button>
                                </div>
                              </article>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Settings */}
              <section>
                <SectionTitle
                  title="환경 설정"
                  description="서비스 이용 환경을 관리할 수 있습니다."
                />

                <div className="overflow-hidden rounded-[20px] border border-[#D8F2E5] bg-white">
                  <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <p className="text-[14px] font-semibold text-[#101211]">
                        자동 로그인
                      </p>

                      <p className="mt-1 text-[12px] leading-5 text-[#708A7E]">
                        다음 접속에서도 로그인 상태를 유지합니다.
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={
                        autoLogin
                      }
                      onClick={
                        handleAutoLoginChange
                      }
                      className={`relative h-7 w-12 shrink-0 rounded-full transition ${autoLogin
                        ? 'bg-[#31F5A0]'
                        : 'bg-[#DCEDE5]'
                        }`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-[#101211] shadow-sm transition-all ${autoLogin
                          ? 'left-6'
                          : 'left-1'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="mx-5 border-t border-[#E6F6EE] sm:mx-6" />

                  <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#EFFFF7] text-[#16885B]">
                        <GlobeIcon />
                      </div>

                      <div>
                        <p className="text-[14px] font-semibold text-[#101211]">
                          나라 / 시간
                        </p>

                        <p className="mt-1 text-[12px] leading-5 text-[#708A7E]">
                          서비스에서 사용할 시간대를 선택합니다.
                        </p>
                      </div>
                    </div>

                    <div className="relative w-full sm:w-[260px]">
                      <select
                        value={
                          timezone
                        }
                        onChange={
                          handleTimezoneChange
                        }
                        className="h-11 w-full appearance-none rounded-[11px] border border-[#CDEADB] bg-[#F7FFFB] px-4 pr-10 text-[12px] font-semibold text-[#315B4A] outline-none transition focus:border-[#31F5A0] focus:bg-white"
                      >
                        <option value="Asia/Seoul">
                          대한민국 · UTC+9
                        </option>

                        <option value="America/New_York">
                          미국 동부
                        </option>

                        <option value="Europe/London">
                          영국
                        </option>

                        <option value="Asia/Kolkata">
                          인도
                        </option>
                      </select>

                      <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4C7262]">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Logout */}
              <div className="flex justify-center pt-1 sm:justify-end">
                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="flex h-10 items-center gap-2 rounded-[10px] px-3 text-[12px] font-medium text-[#688077] transition hover:bg-[#FFF1EF] hover:text-[#F64E42]"
                >
                  <LogoutIcon />
                  로그아웃
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <PasswordConfirmModal
        isOpen={
          isPasswordConfirmOpen
        }
        isSubmitting={
          isVerifyingPassword
        }
        error={
          passwordConfirmError
        }
        onClose={
          handleClosePasswordConfirm
        }
        onSubmit={
          handleVerifyPassword
        }
      />
    </>
  );
}

export default MyPage;
