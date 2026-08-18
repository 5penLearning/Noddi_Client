import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { clearAuthSession, getApiErrorMessage } from '../api/axios';
import { getMyProfile } from '../api/mypageApi';
import {
  getNotifications,
  hideNotification,
  hideNotificationGroup,
  readNotification,
  readNotificationGroup,
} from '../api/notificationApi';
import NotificationModal from '../components/common/notification/NotificationModal';
import {
  getNotificationGroupPayload,
  normalizeNotification,
} from '../components/common/notification/notificationUtils';
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
  const [notificationFilter, setNotificationFilter] = useState('ALL');
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
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

      const result = await getNotifications({ filter: notificationFilter });

      setNotifications((result.items ?? []).map(normalizeNotification));
      setUnreadNotificationCount(result.unreadCount ?? 0);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotificationErrorMessage(getApiErrorMessage(error, '알림을 불러오지 못했습니다.'));
      setNotifications([]);
    } finally {
      setIsNotificationLoading(false);
    }
  }, [notificationFilter]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const navigateFromNotification = (notification) => {
    const navigation = notification.navigation ?? {};

    if (navigation.type === 'QA_QUESTION') {
      navigate('/qa', {
        state: {
          questionId: navigation.referenceId,
          teamId: navigation.teamId,
        },
      });
      return;
    }

    if (navigation.type === 'MEETING_SUMMARY') {
      navigate(`/meetings/${navigation.referenceId}/record`, {
        state: { teamId: navigation.teamId },
      });
      return;
    }

    if (navigation.type === 'TEAM') {
      navigate(`/projects/${navigation.projectId}/teams/${navigation.teamId}/meetings`);
      return;
    }

    if (navigation.type === 'PROJECT') {
      navigate(`/projects/${navigation.projectId ?? navigation.referenceId}`);
      return;
    }

    if (notification.type?.includes('INVITATION')) {
      navigate('/mypage');
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      setNotificationErrorMessage('');

      if (!notification.read) {
        if (notification.grouped) {
          await readNotificationGroup(getNotificationGroupPayload(notification));
        } else {
          await readNotification(notification.notificationId);
        }
      }

      setIsNotificationModalOpen(false);
      navigateFromNotification(notification);
      await loadNotifications();
    } catch (error) {
      setNotificationErrorMessage(getApiErrorMessage(error, '알림을 읽음 처리하지 못했습니다.'));
    }
  };

  const handleNotificationHide = async (notification) => {
    try {
      setNotificationErrorMessage('');

      if (notification.grouped) {
        await hideNotificationGroup({
          ...getNotificationGroupPayload(notification),
          read: notification.read,
        });
      } else {
        await hideNotification(notification.notificationId);
      }

      await loadNotifications();
    } catch (error) {
      setNotificationErrorMessage(getApiErrorMessage(error, '알림을 숨기지 못했습니다.'));
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
            notificationCount={unreadNotificationCount}
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
        filter={notificationFilter}
        unreadCount={unreadNotificationCount}
        isLoading={isNotificationLoading}
        errorMessage={notificationErrorMessage}
        onClose={() => setIsNotificationModalOpen(false)}
        onFilterChange={setNotificationFilter}
        onNotificationClick={handleNotificationClick}
        onNotificationHide={handleNotificationHide}
      />
    </div>
  );
}

export default AppLayout;
