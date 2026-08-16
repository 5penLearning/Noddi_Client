import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../api/axios';
import {
  getProjectInvitations,
  getMyProfile,
  getTeamInvitations,
  respondProjectInvitation,
  respondTeamInvitation,
} from '../api/mypageApi';
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
  const [respondingNotificationId, setRespondingNotificationId] = useState(null);
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

    return () => {
      isCurrentRequest = false;
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
        createdAt: '대기 중',
        message: `${invitation.inviterName}님이 ${invitation.projectName} 프로젝트에 초대했어요.`,
        inviteId: invitation.inviteId,
        projectId: invitation.projectId,
      }));
      const teamInvitationNotifications = teamInvitations.map((invitation) => ({
        id: `team-invitation-${invitation.inviteId}`,
        type: 'invitation',
        invitationKind: 'team',
        scope: invitation.teamName,
        createdAt: '대기 중',
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

  const handleInvitationResponse = async (notification, isAccepted) => {
    try {
      setRespondingNotificationId(notification.id);
      setNotificationErrorMessage('');

      if (notification.invitationKind === 'team') {
        await respondTeamInvitation(notification.inviteId, isAccepted);
      } else {
        await respondProjectInvitation(notification.inviteId, isAccepted);
      }
      setNotifications((currentNotifications) =>
        currentNotifications.filter(
          (currentNotification) => currentNotification.id !== notification.id,
        ),
      );
    } catch (error) {
      console.error('Failed to respond invitation:', error);
      setNotificationErrorMessage(getApiErrorMessage(error, '초대 응답을 처리하지 못했습니다.'));
    } finally {
      setRespondingNotificationId(null);
    }
  };

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
            onNotificationClick={() => {
              setIsNotificationModalOpen(true);
              loadNotifications();
            }}
            onProfileClick={() => navigate('/mypage')}
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
        respondingNotificationId={respondingNotificationId}
        errorMessage={notificationErrorMessage}
        onClose={() => setIsNotificationModalOpen(false)}
        onDismiss={(notificationId) => {
          setNotifications((currentNotifications) =>
            currentNotifications.filter((notification) => notification.id !== notificationId),
          );
        }}
        onDetail={(notification) => {
          if (notification.type === 'invitation') {
            setIsNotificationModalOpen(false);
            navigate('/mypage');
            return;
          }

          console.log('알림 자세히 보기', notification);
        }}
        onInvitationResponse={handleInvitationResponse}
      />
    </div>
  );
}

export default AppLayout;
