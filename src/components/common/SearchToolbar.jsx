import { useEffect, useRef, useState } from 'react';

import NotificationButton from './NotificationButton';
import ProfileDropdown from './ProfileDropdown';
import ProfileMenu from './ProfileMenu';

function SearchToolbar({
  className = '',
  notificationCount = 0,
  profileName,
  profileOrganization,
  profileEmail,
  profileUserId,
  profileImageUrl,
  onNotificationClick,
  onProfileClick,
  onProjectClick,
  onActivityClick,
  onHelpClick,
  onLogoutClick,
}) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileAreaRef = useRef(null);

  useEffect(() => {
    if (!isProfileDropdownOpen) return undefined;

    const closeProfileDropdown = (event) => {
      if (!profileAreaRef.current?.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', closeProfileDropdown);

    return () => {
      document.removeEventListener('mousedown', closeProfileDropdown);
    };
  }, [isProfileDropdownOpen]);

  const handleProfileMenuSelect = (menuId) => {
    setIsProfileDropdownOpen(false);

    if (menuId === 'profile') onProfileClick?.();
    if (menuId === 'projects') onProjectClick?.();
    if (menuId === 'activity') onActivityClick?.();
    if (menuId === 'help') onHelpClick?.();
    if (menuId === 'logout') onLogoutClick?.();
  };

  return (
    <section className={`flex h-14 shrink-0 items-center gap-[10px] ${className}`}>
      <NotificationButton notificationCount={notificationCount} onClick={onNotificationClick} />
      <div ref={profileAreaRef} className="relative">
        <ProfileMenu
          userId={profileUserId}
          profileImageUrl={profileImageUrl}
          name={profileName}
          department={profileOrganization}
          onClick={() => setIsProfileDropdownOpen((isOpen) => !isOpen)}
        />
        {isProfileDropdownOpen && (
          <ProfileDropdown
            userId={profileUserId}
            profileImageUrl={profileImageUrl}
            name={profileName ?? '사용자'}
            organization={profileOrganization ?? '소속 조직'}
            email={profileEmail ?? ''}
            onSelect={handleProfileMenuSelect}
          />
        )}
      </div>
    </section>
  );
}

export default SearchToolbar;
