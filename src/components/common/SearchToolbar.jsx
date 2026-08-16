import NotificationButton from './NotificationButton';
import ProfileMenu from './ProfileMenu';

function SearchToolbar({ className = '', onNotificationClick, onProfileClick }) {
  return (
    <section className={`flex h-14 shrink-0 items-center gap-[10px] ${className}`}>
      <NotificationButton onClick={onNotificationClick} />
      <ProfileMenu onClick={onProfileClick} />
    </section>
  );
}

export default SearchToolbar;
