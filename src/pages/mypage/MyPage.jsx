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
  respondProjectInvitation,
} from '../../api/mypageApi';

import {
  clearAuthSession,
} from '../../api/axios';

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
    respondingInviteId,
    setRespondingInviteId,
  ] = useState(null);

  const [
    pageError,
    setPageError,
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
          invitationResponse,
          projectResponse,
        ] = await Promise.all([
          getMyProfile(),
          getProjectInvitations(),
          getOrganizationProjects(),
        ]);

        const profileData =
          profileResponse?.result ??
          null;

        const invitationData =
          invitationResponse?.result ??
          [];

        setProfile(
          profileData,
        );

        setInvitations(
          invitationData,
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
      inviteId,
      isAccepted,
    ) => {
      if (respondingInviteId) {
        return;
      }

      try {
        setRespondingInviteId(
          inviteId,
        );

        setPageError('');

        await respondProjectInvitation(
          inviteId,
          isAccepted,
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
        setRespondingInviteId(
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

  const initial =
    displayName
      .trim()
      .charAt(0);

  return (
    <div className="h-full w-full overflow-y-auto pb-12">
      <header className="mb-4">
        <h1 className="text-lg font-semibold text-[#101211]">
          my
        </h1>
      </header>

      <div className="mx-auto w-full max-w-[680px]">
        {pageError && (
          <div className="mb-5 rounded-xl bg-[#FFF1F0] px-4 py-3 text-sm text-[#F64E42]">
            {pageError}
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-[#DCE5E1] border-t-[#31F5A0]" />

              <p className="mt-4 text-sm text-[#8A9490]">
                내 정보를 불러오고
                있습니다.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* 프로필 */}
            <section className="flex flex-col items-center pt-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#D8D8D8] text-2xl font-semibold text-[#59625F]">
                {initial}
              </div>

              <button
                type="button"
                className="mt-4 flex items-center gap-2 text-base font-semibold text-[#101211]"
              >
                {displayName}

                <span className="text-[#506B8F]">
                  <EditIcon />
                </span>
              </button>

              <p className="mt-1 text-xs text-[#8A9490]">
                {profile?.organizationName ??
                  '소속 조직'}
              </p>
            </section>

            {/* 계정 정보 */}
            <section className="mt-12">
              <h2 className="text-sm font-semibold text-[#101211]">
                계정 정보
              </h2>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs text-[#8A9490]">
                    이메일 주소
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#303633]">
                    {profile?.email ??
                      '-'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#8A9490]">
                    소속 조직
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#303633]">
                    {profile?.organizationName ??
                      '-'}
                  </p>
                </div>
              </div>
            </section>

            {/* 초대장 */}
            <section className="mt-10">
              <h2 className="text-sm font-semibold text-[#101211]">
                내가 받은 초대장
              </h2>

              <div className="mt-3">
                {invitations.length ===
                  0 ? (
                  <div className="rounded-xl bg-[#F3F7F5] px-5 py-6 text-center">
                    <p className="text-xs text-[#8A9490]">
                      받은 초대장이
                      없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {invitations.map(
                      (invitation) => (
                        <div
                          key={
                            invitation.inviteId
                          }
                          className="flex items-center justify-between gap-4 rounded-xl bg-[#F1F6F3] px-4 py-5"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="h-7 w-7 shrink-0 rounded-full bg-[#D7DDDA]" />

                              <p className="truncate text-xs text-[#8A9490]">
                                {
                                  invitation.inviterName
                                }{' '}
                                님의 초대
                              </p>
                            </div>

                            <p className="mt-3 truncate text-sm font-semibold text-[#101211]">
                              {
                                invitation.projectName
                              }
                            </p>

                            <p className="mt-1 text-[11px] text-[#8A9490]">
                              역할 ·{' '}
                              {getRoleLabel(
                                invitation.offeredRole,
                              )}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-4">
                            <button
                              type="button"
                              disabled={
                                respondingInviteId ===
                                invitation.inviteId
                              }
                              onClick={() =>
                                handleInvitation(
                                  invitation.inviteId,
                                  true,
                                )
                              }
                              className="text-xs font-semibold text-[#101211] disabled:opacity-40"
                            >
                              수락
                            </button>

                            <button
                              type="button"
                              disabled={
                                respondingInviteId ===
                                invitation.inviteId
                              }
                              onClick={() =>
                                handleInvitation(
                                  invitation.inviteId,
                                  false,
                                )
                              }
                              className="text-xs font-medium text-[#59625F] disabled:opacity-40"
                            >
                              거절
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 참여 프로젝트 */}
            <section className="mt-10">
              <h2 className="text-sm font-semibold text-[#101211]">
                현재 참여중인 프로젝트
              </h2>

              <div className="mt-3 rounded-xl bg-[#F1F6F3] px-5 py-3">
                {myProjects.length ===
                  0 ? (
                  <div className="py-7 text-center">
                    <p className="text-xs text-[#8A9490]">
                      참여 중인 프로젝트가
                      없습니다.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E2E8E5]">
                    {myProjects.map(
                      (project) => (
                        <div
                          key={
                            project.projectId
                          }
                          className="flex items-start justify-between gap-3 py-4"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#101211]">
                              {
                                project.name
                              }
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded border border-[#D6DDDA] bg-white px-2 py-1 text-[10px] text-[#8A9490]">
                                {getRoleLabel(
                                  project.myRole,
                                )}
                              </span>

                              <span className="rounded border border-[#D6DDDA] bg-white px-2 py-1 text-[10px] text-[#8A9490]">
                                프로젝트
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            className="flex h-8 w-8 shrink-0 items-center justify-center text-[#59625F]"
                            aria-label="프로젝트 메뉴"
                          >
                            <MoreIcon />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* 환경 설정 */}
            <section className="mt-10">
              <h2 className="text-sm font-semibold text-[#101211]">
                환경 설정
              </h2>

              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#101211]">
                      자동 로그인 설정
                    </p>

                    <p className="mt-1 text-[11px] text-[#8A9490]">
                      로그인 상태 유지 설정
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
                    className={`relative h-6 w-11 rounded-full transition ${autoLogin
                      ? 'bg-[#DDEAE4]'
                      : 'bg-[#E4E8E6]'
                      }`}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-[#101211] transition ${autoLogin
                        ? 'left-6'
                        : 'left-1'
                        }`}
                    />
                  </button>
                </div>

                <div className="mt-8">
                  <label
                    htmlFor="mypage-timezone"
                    className="text-sm font-medium text-[#101211]"
                  >
                    나라/시간
                  </label>

                  <div className="relative mt-3">
                    <select
                      id="mypage-timezone"
                      value={timezone}
                      onChange={
                        handleTimezoneChange
                      }
                      className="h-11 w-full appearance-none rounded-lg border border-[#D8DFDC] bg-white px-4 pr-10 text-xs text-[#59625F] outline-none focus:border-[#101211]"
                    >
                      <option value="Asia/Seoul">
                        08:09 (대한민국)
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

                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#59708C]">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-12 text-xs font-medium text-[#A7B0AC] transition hover:text-[#F64E42]"
            >
              로그아웃하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default MyPage;
