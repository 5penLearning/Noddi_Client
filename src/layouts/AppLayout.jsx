import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SearchToolbar from '../components/common/SearchToolbar';
import SidebarNavigation from '../components/common/SidebarNavigation';

const navigationPaths = {
  home: '/home',
  teams: '/projects',
  meetings: '/meetings',
  messages: '/chat',
  profile: '/mypage',
};

const pageTitles = {
  '/home': 'home',
  '/projects': '프로젝트',
  '/meetings': '화상회의',
  '/chat': '채팅',
  '/mypage': '마이페이지',
  '/settings': '설정',
};

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem = Object.entries(navigationPaths).find(([, path]) => path === location.pathname)?.[0];
  const pageTitle = pageTitles[location.pathname] ?? '페이지를 찾을 수 없습니다.';

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-gray-100)] p-[10px]">
      <SidebarNavigation
        activeItem={activeItem ?? ''}
        onNavigate={(id) => navigate(navigationPaths[id])}
        onSettingsClick={() => navigate('/settings')}
      />
      <main className="ml-[10px] flex min-w-0 flex-1 flex-col gap-[10px]">
        <header className="mx-auto flex h-14 w-[1204px] shrink-0 items-center justify-between">
          <h1 className="subhead-1 text-[var(--color-text-primary)]">{pageTitle}</h1>
          <SearchToolbar
            onNotificationClick={() => console.log('알림 버튼 클릭됨')}
            onProfileClick={() => console.log('프로필 버튼 클릭됨')}
          />
        </header>
        <div className="min-h-0 min-w-0 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
