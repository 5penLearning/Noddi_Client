import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  clearAuthSession,
  getApiErrorMessage,
} from '../api/axios';

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

function MenuIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7H19M5 12H19M5 17H19"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AppLayout() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    isDesktopSidebarOpen,
    setIsDesktopSidebarOpen,
  ] = useState(true);

  const [
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  ] = useState(false);

  const [
    isNotificationModalOpen,
    setIsNotificationModalOpen,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const [
    notificationFilter,
    setNotificationFilter,
  ] = useState('ALL');

  const [
    unreadNotificationCount,
    setUnreadNotificationCount,
  ] = useState(0);

  const [
    isNotificationLoading,
    setIsNotificationLoading,
  ] = useState(true);

  const [
    notificationErrorMessage,
    setNotificationErrorMessage,
  ] = useState('');

  const [
    profile,
    setProfile,
  ] = useState(null);

  /*
   * 모바일에서 메뉴를 연 뒤 페이지를 이동하면
   * 사이드바를 자동으로 닫는다.
   */
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  /*
   * 모바일 사이드바가 열려 있을 때
   * ESC 키로 닫을 수 있도록 한다.
   */
  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadProfile =
      async () => {
        try {
          const response =
            await getMyProfile();

          if (
            isCurrentRequest
          ) {
            setProfile(
              response?.result ??
              null,
            );
          }
        } catch (error) {
          console.error(
            'Failed to load header profile:',
            error,
          );
        }
      };

    loadProfile();

    window.addEventListener(
      'profile-updated',
      loadProfile,
    );

    return () => {
      isCurrentRequest =
        false;

      window.removeEventListener(
        'profile-updated',
        loadProfile,
      );
    };
  }, []);

  const loadNotifications =
    useCallback(async () => {
      try {
        setIsNotificationLoading(
          true,
        );

        setNotificationErrorMessage(
          '',
        );

        const result =
          await getNotifications({
            filter:
              notificationFilter,
          });

        setNotifications(
          (
            result.items ?? []
          ).map(
            normalizeNotification,
          ),
        );

        setUnreadNotificationCount(
          result.unreadCount ??
          0,
        );
      } catch (error) {
        console.error(
          'Failed to load notifications:',
          error,
        );

        setNotificationErrorMessage(
          getApiErrorMessage(
            error,
            '알림을 불러오지 못했습니다.',
          ),
        );

        setNotifications([]);
      } finally {
        setIsNotificationLoading(
          false,
        );
      }
    }, [notificationFilter]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const navigateFromNotification =
    (notification) => {
      const navigation =
        notification.navigation ??
        {};

      if (
        navigation.type ===
        'QA_QUESTION'
      ) {
        navigate('/qa', {
          state: {
            questionId:
              navigation.referenceId,

            teamId:
              navigation.teamId,
          },
        });

        return;
      }

      if (
        navigation.type ===
        'MEETING_SUMMARY'
      ) {
        navigate(
          `/meetings/${navigation.referenceId}/record`,
          {
            state: {
              teamId:
                navigation.teamId,
            },
          },
        );

        return;
      }

      if (
        navigation.type ===
        'TEAM'
      ) {
        navigate(
          `/projects/${navigation.projectId}/teams/${navigation.teamId}/meetings`,
        );

        return;
      }

      if (
        navigation.type ===
        'PROJECT'
      ) {
        navigate(
          `/projects/${navigation.projectId ??
          navigation.referenceId
          }`,
        );

        return;
      }

      if (
        notification.type?.includes(
          'INVITATION',
        )
      ) {
        navigate('/mypage');
      }
    };

  const handleNotificationClick =
    async (notification) => {
      try {
        setNotificationErrorMessage(
          '',
        );

        if (
          !notification.read
        ) {
          if (
            notification.grouped
          ) {
            await readNotificationGroup(
              getNotificationGroupPayload(
                notification,
              ),
            );
          } else {
            await readNotification(
              notification.notificationId,
            );
          }
        }

        setIsNotificationModalOpen(
          false,
        );

        navigateFromNotification(
          notification,
        );

        await loadNotifications();
      } catch (error) {
        setNotificationErrorMessage(
          getApiErrorMessage(
            error,
            '알림을 읽음 처리하지 못했습니다.',
          ),
        );
      }
    };

  const handleNotificationHide =
    async (notification) => {
      try {
        setNotificationErrorMessage(
          '',
        );

        if (
          notification.grouped
        ) {
          await hideNotificationGroup({
            ...getNotificationGroupPayload(
              notification,
            ),

            read:
              notification.read,
          });
        } else {
          await hideNotification(
            notification.notificationId,
          );
        }

        await loadNotifications();
      } catch (error) {
        setNotificationErrorMessage(
          getApiErrorMessage(
            error,
            '알림을 숨기지 못했습니다.',
          ),
        );
      }
    };

  const activeItem =
    Object.entries(
      navigationPaths,
    ).find(
      ([, path]) =>
        location.pathname ===
        path ||
        location.pathname.startsWith(
          `${path}/`,
        ),
    )?.[0];

  const teamPageMatch =
    location.pathname.match(
      /^\/projects\/([^/]+)\/teams\/([^/]+)\//,
    );

  const isTeamPage =
    Boolean(teamPageMatch);

  const handleSidebarNavigate =
    (id) => {
      const path =
        navigationPaths[id];

      if (!path) {
        return;
      }

      setIsMobileSidebarOpen(
        false,
      );

      navigate(path);
    };

  const handleSettingsClick =
    () => {
      setIsMobileSidebarOpen(
        false,
      );

      navigate('/settings');
    };

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#FAFFFC] p-[10px]">
      {/*
       * Desktop Sidebar
       *
       * lg 이상에서는 기존 사이드바를 그대로 사용하고,
       * 햄버거 버튼으로 너비를 0 ↔ 64px 전환한다.
       */}
      <div
        className={`hidden h-full shrink-0 overflow-hidden transition-[width,opacity] duration-200 ease-out lg:block ${isDesktopSidebarOpen
          ? 'w-16 opacity-100'
          : 'w-0 opacity-0'
          }`}
      >
        <SidebarNavigation
          activeItem={
            activeItem ?? ''
          }
          onNavigate={
            handleSidebarNavigate
          }
          onSettingsClick={
            handleSettingsClick
          }
        />
      </div>

      <main
        className={`flex min-w-0 flex-1 flex-col gap-[10px] transition-[margin] duration-200 ease-out ${isDesktopSidebarOpen
          ? 'lg:ml-[10px]'
          : 'lg:ml-0'
          }`}
      >
        <header className="mx-auto flex h-14 w-full max-w-[1346px] shrink-0 items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            {/*
             * Mobile hamburger
             */}
            <button
              type="button"
              onClick={() =>
                setIsMobileSidebarOpen(
                  true,
                )
              }
              className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-white text-[#2B3F6C] transition hover:bg-[#F1F6F3] lg:hidden"
              aria-label="메뉴 열기"
              aria-expanded={
                isMobileSidebarOpen
              }
            >
              <MenuIcon />
            </button>

            {/*
             * Desktop hamburger
             */}
            <button
              type="button"
              onClick={() =>
                setIsDesktopSidebarOpen(
                  (previous) =>
                    !previous,
                )
              }
              className={`hidden size-10 shrink-0 items-center justify-center rounded-[10px] transition lg:flex ${isDesktopSidebarOpen
                ? 'bg-[#EFFFF7] text-[#19382B]'
                : 'bg-white text-[#2B3F6C] hover:bg-[#F1F6F3]'
                }`}
              aria-label={
                isDesktopSidebarOpen
                  ? '사이드바 접기'
                  : '사이드바 펼치기'
              }
              aria-expanded={
                isDesktopSidebarOpen
              }
            >
              <MenuIcon />
            </button>

            {isTeamPage && (
              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                className="flex size-8 shrink-0 items-center justify-center text-[26px] leading-none text-[#2B3F6C]"
                aria-label="이전 페이지로 이동"
              >
                ‹
              </button>
            )}
          </div>

          <SearchToolbar
            notificationCount={
              unreadNotificationCount
            }
            profileName={
              profile?.name
            }
            profileOrganization={
              profile?.organizationName
            }
            profileEmail={
              profile?.email
            }
            profileUserId={
              profile?.userId
            }
            profileImageUrl={
              profile?.profileImageUrl
            }
            onNotificationClick={() => {
              setIsNotificationModalOpen(
                true,
              );

              loadNotifications();
            }}
            onProfileClick={() =>
              navigate('/mypage')
            }
            onProjectClick={() =>
              navigate('/projects')
            }
            onActivityClick={() =>
              navigate('/mypage')
            }
            onHelpClick={() => { }}
            onLogoutClick={() => {
              clearAuthSession();

              navigate('/login', {
                replace: true,
              });
            }}
          />
        </header>

        <div className="min-h-0 min-w-0 flex-1">
          <Outlet />
        </div>
      </main>

      {/*
       * Mobile Sidebar
       *
       * lg 미만에서는 기본적으로 숨겨두고
       * 햄버거 클릭 시 overlay drawer 형태로 표시한다.
       */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            onClick={() =>
              setIsMobileSidebarOpen(
                false,
              )
            }
            className="absolute inset-0 bg-[#101211]/35 backdrop-blur-[1px]"
            aria-label="메뉴 닫기"
          />

          <div className="absolute bottom-[10px] left-[10px] top-[10px] flex items-start gap-2">
            <SidebarNavigation
              activeItem={
                activeItem ?? ''
              }
              onNavigate={
                handleSidebarNavigate
              }
              onSettingsClick={
                handleSettingsClick
              }
              className="shadow-[8px_0_32px_rgba(16,18,17,0.16)]"
            />

            <button
              type="button"
              onClick={() =>
                setIsMobileSidebarOpen(
                  false,
                )
              }
              className="mt-1 flex size-10 items-center justify-center rounded-full bg-white text-[#44534C] shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition hover:bg-[#F1F6F3]"
              aria-label="메뉴 닫기"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}

      <NotificationModal
        isOpen={
          isNotificationModalOpen
        }
        notifications={
          notifications
        }
        filter={
          notificationFilter
        }
        unreadCount={
          unreadNotificationCount
        }
        isLoading={
          isNotificationLoading
        }
        errorMessage={
          notificationErrorMessage
        }
        onClose={() =>
          setIsNotificationModalOpen(
            false,
          )
        }
        onFilterChange={
          setNotificationFilter
        }
        onNotificationClick={
          handleNotificationClick
        }
        onNotificationHide={
          handleNotificationHide
        }
      />
    </div>
  );
}

export default AppLayout;
