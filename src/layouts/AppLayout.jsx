import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { clearAuthSession, getApiErrorMessage } from '../api/axios';
import { getProjectInvitations, getMyProfile, getTeamInvitations } from '../api/mypageApi';
import NotificationModal from '../components/common/notification/NotificationModal';
import SearchToolbar from '../components/common/SearchToolbar';
import SidebarNavigation from '../components/common/SidebarNavigation';

const navigationPaths = {
  home: '/home',
  teams: '/projects',
  meetings: '/meetings',
  qa: '/qa',
  profile: '/mypage',
};

const pageTitles = {
  '/home': 'home',
  '/projects': '프로젝트',
  '/meetings': '화상회의',
  '/qa': 'Q&A',
  '/mypage': '마이페이지',
  '/settings': '설정',
};

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationLoading, setIsNotificationLoading] = useState(true);
  const [notificationErrorMessage, setNotificationErrorMessage] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadProfile = async () => {
      try {
        const response = await getMyProfile();

        if (isCurrentRequest) {
          setProfile(response?.result ?? null);
        }
      } catch (error) {
        console.error('Failed to load header profile:', error);
      }
    };

    loadProfile();
    window.addEventListener('profile-updated', loadProfile);

    return () => {
      isCurrentRequest = false;
      window.removeEventListener('profile-updated', loadProfile);
    };
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      setIsNotificationLoading(true);
      setNotificationErrorMessage('');

      const [projectResponse, teamResponse] = await Promise.all([
        getProjectInvitations(),
        getTeamInvitations(),
      ]);
      const projectInvitations = projectResponse?.result ?? [];
      const teamInvitations = teamResponse?.result ?? [];
      const invitationNotifications = projectInvitations.map((invitation) => ({
        id: `project-invitation-${invitation.inviteId}`,
        type: 'invitation',
        invitationKind: 'project',
        scope: invitation.projectName,
        createdAt: '방금 전',
        title: '프로젝트 초대장이 날라왔어요',
        message: `${invitation.inviterName}님이 ${invitation.projectName} 프로젝트에 초대했어요.`,
        inviteId: invitation.inviteId,
        projectId: invitation.projectId,
      }));
      const teamInvitationNotifications = teamInvitations.map((invitation) => ({
        id: `team-invitation-${invitation.inviteId}`,
        type: 'invitation',
        invitationKind: 'team',
        scope: invitation.teamName,
        createdAt: '방금 전',
        title: '팀 초대장이 날라왔어요',
        message: `${invitation.inviterName}님이 ${invitation.teamName} 팀에 초대했어요.`,
        inviteId: invitation.inviteId,
        teamId: invitation.teamId,
      }));

      setNotifications([...invitationNotifications, ...teamInvitationNotifications]);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotificationErrorMessage(getApiErrorMessage(error, '초대 알림을 불러오지 못했습니다.'));
      setNotifications([]);
    } finally {
      setIsNotificationLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const activeItem = Object.entries(navigationPaths).find(
    ([, path]) => location.pathname === path || location.pathname.startsWith(`${path}/`),
  )?.[0];

  const currentPagePath = Object.keys(pageTitles).find(
    (path) => location.pathname === path || location.pathname.startsWith(`${path}/`),
  );

  const pageTitle = pageTitles[currentPagePath] ?? '페이지를 찾을 수 없습니다.';
  const teamPageMatch = location.pathname.match(/^\/projects\/([^/]+)\/teams\/([^/]+)\//);
  const isTeamPage = Boolean(teamPageMatch);
  const currentProjectId = teamPageMatch?.[1];
  const teamPageTitle = `${location.state?.projectName ?? '프로젝트'} / ${
    location.state?.teamName ?? '팀'
  }`;

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-gray-100)] p-[10px]">
      <SidebarNavigation
        activeItem={activeItem ?? ''}
        onNavigate={(id) => navigate(navigationPaths[id])}
        onSettingsClick={() => navigate('/settings')}
      />

      <main className="ml-[10px] flex min-w-0 flex-1 flex-col gap-[10px]">
        <header className="mx-auto flex h-14 w-full max-w-[1346px] shrink-0 items-center justify-between">
          <div className="flex items-center">
            {isTeamPage && (
              <button
                type="button"
                onClick={() => navigate(`/projects/${currentProjectId}`)}
                className="mr-[10px] flex size-6 items-center justify-center text-[26px] leading-none text-[#2B3F6C]"
              >
                ‹
              </button>
            )}
            <h1 className="subhead-1 text-[var(--color-text-primary)]">
              {isTeamPage ? teamPageTitle : pageTitle}
            </h1>
          </div>

          <SearchToolbar
            notificationCount={notifications.length}
            profileName={profile?.name}
            profileOrganization={profile?.organizationName}
            profileEmail={profile?.email}
            profileUserId={profile?.userId}
            profileImageUrl={profile?.profileImageUrl}
            onNotificationClick={() => {
              setIsNotificationModalOpen(true);
              loadNotifications();
            }}
            onProfileClick={() => navigate('/mypage')}
            onProjectClick={() => navigate('/projects')}
            onActivityClick={() => navigate('/mypage')}
            onHelpClick={() => {}}
            onLogoutClick={() => {
              clearAuthSession();
              navigate('/login', { replace: true });
            }}
          />
        </header>

        <div className="min-h-0 min-w-0 flex-1">
          <Outlet />
        </div>
      </main>

      <NotificationModal
        isOpen={isNotificationModalOpen}
        notifications={notifications}
        isLoading={isNotificationLoading}
        errorMessage={notificationErrorMessage}
        onClose={() => setIsNotificationModalOpen(false)}
        onNotificationClick={(notification) => {
          setIsNotificationModalOpen(false);

          if (notification.type === 'invitation') {
            navigate('/mypage');
            return;
          }

          if (notification.type === 'reply') {
            navigate('/qa', {
              state: {
                questionId: notification.questionId,
                teamId: notification.teamId,
              },
            });
            return;
          }

          if (notification.type === 'meeting' || notification.type === 'meeting-summary') {
            navigate('/meetings');
          }
        }}
      />
    </div>
  );
}

export default AppLayout;
