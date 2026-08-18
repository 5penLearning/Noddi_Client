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
      width="18"
      height="18"
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

function FolderIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function SectionHeader({
  title,
  description,
  count,
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[15px] font-semibold text-[#101211]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-[#8A9490]">
            {description}
          </p>
        )}
      </div>

      {typeof count ===
        'number' && (
          <span className="rounded-full bg-[#EFF4F1] px-2.5 py-1 text-[11px] font-semibold text-[#59625F]">
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

  return (
    <>
      <div className="h-full w-full overflow-y-auto pb-14">
        <div className="mx-auto w-full max-w-[820px]">
          <header className="mb-7">
            <h1 className="text-2xl font-semibold text-[#101211]">
              my
            </h1>

            <p className="mt-1 text-sm text-[#8A9490]">
              내 정보와 참여 중인
              프로젝트를 관리할 수
              있습니다.
            </p>
          </header>

          {pageError && (
            <div className="mb-5 rounded-xl border border-[#FFDAD6] bg-[#FFF5F4] px-4 py-3 text-sm text-[#D83D34]">
              {pageError}
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
                  내 정보를 불러오고
                  있습니다.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 프로필 */}
              <section className="flex items-center justify-between rounded-2xl border border-[#E3E9E6] bg-white px-7 py-6">
                <div className="flex min-w-0 items-center gap-5">
                  <ProfileAvatar
                    userId={profile?.userId}
                    profileImageUrl={profile?.profileImageUrl}
                    name={displayName}
                    className="size-20 shrink-0 border border-[#C7F9DF] text-2xl"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-xl font-semibold text-[#101211]">
                        {displayName}
                      </h2>

                      <button
                        type="button"
                        onClick={
                          handleOpenProfileSettings
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#59625F] transition hover:bg-[#F2F6F4] hover:text-[#101211]"
                        aria-label="프로필 설정"
                      >
                        <EditIcon />
                      </button>
                    </div>

                    <p className="mt-1 text-sm text-[#707A76]">
                      {profile?.organizationName ??
                        '소속 조직'}
                    </p>

                    <p className="mt-2 truncate text-xs text-[#9AA39F]">
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
                  className="shrink-0 rounded-lg border border-[#DCE3E0] bg-white px-4 py-2.5 text-xs font-semibold text-[#303633] transition hover:bg-[#F7F9F8]"
                >
                  프로필 설정
                </button>
              </section>

              {/* 계정 정보 */}
              <section>
                <SectionHeader
                  title="계정 정보"
                  description="가입한 계정과 소속 정보를 확인할 수 있습니다."
                />

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-4 rounded-xl border border-[#E3E9E6] bg-white px-5 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F6F3] text-[#59625F]">
                      <MailIcon />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-[#8A9490]">
                        이메일 주소
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-[#303633]">
                        {profile?.email ??
                          '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-xl border border-[#E3E9E6] bg-white px-5 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F6F3] text-[#59625F]">
                      <BuildingIcon />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-[#8A9490]">
                        소속 조직
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold text-[#303633]">
                        {profile?.organizationName ??
                          '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 초대장 */}
              <section>
                <SectionHeader
                  title="내가 받은 초대장"
                  description="프로젝트와 팀 초대를 확인하고 응답할 수 있습니다."
                  count={
                    invitations.length
                  }
                />

                {invitations.length ===
                  0 ? (
                  <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-[#DCE3E0] bg-[#FAFBFA]">
                    <p className="text-sm text-[#8A9490]">
                      받은 초대장이
                      없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invitations.map(
                      (invitation) => {
                        const isResponding =
                          respondingInvitationKey ===
                          invitation.key;

                        return (
                          <div
                            key={
                              invitation.key
                            }
                            className="flex items-center justify-between gap-5 rounded-xl border border-[#E3E9E6] bg-white px-5 py-4"
                          >
                            <div className="flex min-w-0 items-center gap-4">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFFFF7] text-[#16885B]">
                                <FolderIcon />
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="truncate text-sm font-semibold text-[#101211]">
                                    {
                                      invitation.targetName
                                    }
                                  </p>

                                  <span className="rounded-full bg-[#F1F5F3] px-2 py-1 text-[10px] font-medium text-[#59625F]">
                                    {invitation.type ===
                                      'TEAM'
                                      ? '팀 초대'
                                      : '프로젝트 초대'}
                                  </span>
                                </div>

                                <p className="mt-1 text-xs text-[#707A76]">
                                  {
                                    invitation.inviterName
                                  }
                                  님이 초대했습니다.
                                </p>

                                {invitation.role && (
                                  <p className="mt-1 text-[11px] text-[#9AA39F]">
                                    역할 ·{' '}
                                    {getRoleLabel(
                                      invitation.role,
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
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
                                className="h-9 rounded-lg border border-[#DCE3E0] px-4 text-xs font-semibold text-[#59625F] transition hover:bg-[#F5F7F6] disabled:opacity-40"
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
                                className="h-9 rounded-lg bg-[#101211] px-4 text-xs font-semibold text-white transition hover:bg-[#292E2B] disabled:opacity-40"
                              >
                                {isResponding
                                  ? '처리 중'
                                  : '수락'}
                              </button>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                )}
              </section>

              {/* 프로젝트 */}
              <section>
                <SectionHeader
                  title="현재 참여중인 프로젝트"
                  description="내가 참여하고 있는 프로젝트를 확인할 수 있습니다."
                  count={
                    myProjects.length
                  }
                />

                {myProjects.length ===
                  0 ? (
                  <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-[#DCE3E0] bg-[#FAFBFA]">
                    <p className="text-sm text-[#8A9490]">
                      참여 중인 프로젝트가
                      없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-visible rounded-xl border border-[#E3E9E6] bg-white">
                    {myProjects.map(
                      (
                        project,
                        index,
                      ) => (
                        <div
                          key={
                            project.projectId
                          }
                          className={`relative flex items-center justify-between gap-5 px-5 py-4 ${index !==
                            myProjects.length -
                            1
                            ? 'border-b border-[#EDF1EF]'
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
                            className="flex min-w-0 flex-1 items-center gap-4 text-left"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F1F6F3] text-[#59625F]">
                              <FolderIcon />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#101211]">
                                {
                                  project.name
                                }
                              </p>

                              <div className="mt-1.5 flex items-center gap-2">
                                <span className="rounded-full bg-[#EFFFF7] px-2 py-1 text-[10px] font-semibold text-[#16885B]">
                                  {getRoleLabel(
                                    project.myRole,
                                  )}
                                </span>

                                <span className="text-[11px] text-[#9AA39F]">
                                  프로젝트
                                </span>
                              </div>
                            </div>
                          </button>

                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleProjectMenu(
                                  project.projectId,
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#707A76] transition hover:bg-[#F2F6F4] hover:text-[#101211]"
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

              {/* 환경 설정 */}
              <section>
                <SectionHeader
                  title="환경 설정"
                  description="서비스 이용 환경을 설정할 수 있습니다."
                />

                <div className="overflow-hidden rounded-xl border border-[#E3E9E6] bg-white">
                  <div className="flex items-center justify-between gap-5 px-5 py-5">
                    <div>
                      <p className="text-sm font-semibold text-[#101211]">
                        자동 로그인
                      </p>

                      <p className="mt-1 text-xs text-[#8A9490]">
                        다음 접속에서도 로그인
                        상태를 유지합니다.
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
                      className={`relative h-6 w-11 shrink-0 rounded-full transition ${autoLogin
                        ? 'bg-[#31F5A0]'
                        : 'bg-[#D8DEDB]'
                        }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-[#101211] shadow-sm transition-all ${autoLogin
                          ? 'left-6'
                          : 'left-1'
                          }`}
                      />
                    </button>
                  </div>

                  <div className="border-t border-[#EDF1EF]" />

                  <div className="flex items-center justify-between gap-8 px-5 py-5">
                    <div className="shrink-0">
                      <p className="text-sm font-semibold text-[#101211]">
                        나라 / 시간
                      </p>

                      <p className="mt-1 text-xs text-[#8A9490]">
                        서비스에서 사용할
                        시간대를 선택합니다.
                      </p>
                    </div>

                    <div className="relative w-[260px]">
                      <select
                        value={timezone}
                        onChange={
                          handleTimezoneChange
                        }
                        className="h-10 w-full appearance-none rounded-lg border border-[#D8DFDC] bg-white px-3 pr-9 text-xs font-medium text-[#303633] outline-none transition focus:border-[#101211]"
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

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#707A76]">
                        <ChevronDownIcon />
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="flex justify-end border-t border-[#EDF1EF] pt-6">
                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="flex items-center gap-2 text-xs font-medium text-[#8A9490] transition hover:text-[#F64E42]"
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
