import NotificationButton from './NotificationButton';
import ProfileMenu from './ProfileMenu';
import SearchBar from './SearchBar';

function SearchToolbar({ className = '', onSearchClick, onNotificationClick, onProfileClick }) {
  return (
    <section className={`flex h-14 w-full items-center gap-[10px] ${className}`}>
      <SearchBar onSearchClick={onSearchClick} />
      <NotificationButton onClick={onNotificationClick} />
      <ProfileMenu onClick={onProfileClick} />
    </section>
  );
}

export default SearchToolbar;
