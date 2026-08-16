import NotificationButton from './NotificationButton';
import ProfileMenu from './ProfileMenu';

function SearchToolbar({
  className = '',
  notificationCount = 0,
  profileName,
  profileOrganization,
  onNotificationClick,
  onProfileClick,
}) {
  return (
    <section className={`flex h-14 shrink-0 items-center gap-[10px] ${className}`}>
      <NotificationButton notificationCount={notificationCount} onClick={onNotificationClick} />
      <ProfileMenu name={profileName} department={profileOrganization} onClick={onProfileClick} />
    </section>
  );
}

export default SearchToolbar;
