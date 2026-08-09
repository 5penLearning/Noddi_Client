import { useState } from 'react';
import SearchToolbar from '../components/common/SearchToolbar';
import SidebarNavigation from '../components/common/SidebarNavigation';

function HomePage({ children }) {
  const [activeItem, setActiveItem] = useState('home');

  const handleNavigate = (id) => {
    setActiveItem(id);
    console.log(`${id} 메뉴로 이동`);
    // 여기서 라우팅 처리하기
  };

  const handleSettingsClick = () => {
    console.log('설정 버튼 클릭됨');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-gray-100)] p-[10px]">
      <SidebarNavigation
        activeItem={activeItem}
        onNavigate={handleNavigate}
        onSettingsClick={handleSettingsClick}
      />
      <main className="ml-[10px] flex min-w-0 flex-1 flex-col gap-[10px]">
        <header className="mx-auto flex h-14 w-[1204px] shrink-0 items-center justify-between">
          <h1 className="subhead-1 text-[var(--color-text-primary)]">home</h1>
          <SearchToolbar
            onNotificationClick={() => console.log('알림 버튼 클릭됨')}
            onProfileClick={() => console.log('프로필 버튼 클릭됨')}
          />
        </header>
        <div className="min-h-0 min-w-0 flex-1">{children}</div>
      </main>
    </div>
  );
}

export default HomePage;
