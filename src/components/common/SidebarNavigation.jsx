import homeIcon from '../../assets/icons/sidebar/home.svg';
import logoIcon from '../../assets/icons/sidebar/logo-simple.svg';
import messageDotIcon from '../../assets/icons/sidebar/message-dot.svg';
import messageIcon from '../../assets/icons/sidebar/message.svg';
import settingsCenterIcon from '../../assets/icons/sidebar/settings-center.svg';
import settingsIcon from '../../assets/icons/sidebar/settings.svg';
import userAvatarIcon from '../../assets/icons/sidebar/user-avatar.svg';
import userBodyIcon from '../../assets/icons/sidebar/user-body.svg';
import userGroupSideIcon from '../../assets/icons/sidebar/user-group-side.svg';
import userGroupSmallIcon from '../../assets/icons/sidebar/user-group-small.svg';
import usersPrimaryIcon from '../../assets/icons/sidebar/users-primary.svg';
import usersSecondaryIcon from '../../assets/icons/sidebar/users-secondary.svg';
import videoIcon from '../../assets/icons/sidebar/video.svg';

const navigationItems = [
  { id: 'home', label: '홈', icon: HomeIcon },
  { id: 'teams', label: '팀', icon: UsersIcon },
  { id: 'meetings', label: '화상 회의', icon: VideoIcon },
  { id: 'messages', label: '메시지', icon: MessageIcon },
  { id: 'profile', label: '프로필', icon: UserIcon },
];

function HomeIcon({ isActive }) {
  return (
    <img
      src={homeIcon}
      alt=""
      className={`h-[20.4px] w-[20.5px] ${
        isActive ? '' : 'brightness-0 saturate-100 invert-[24%] sepia-[23%] saturate-[1638%] hue-rotate-[181deg] brightness-[88%] contrast-[89%]'
      }`}
    />
  );
}

function UsersIcon({ isActive }) {
  const activeIconClass = isActive ? 'brightness-0 invert' : '';

  return (
    <span className="relative block size-6" aria-hidden="true">
      <img
        src={usersPrimaryIcon}
        alt=""
        className={`absolute top-[3.85px] left-[7.85px] h-[8.31px] w-[8.31px] ${activeIconClass}`}
      />
      <img
        src={usersSecondaryIcon}
        alt=""
        className={`absolute top-[12.89px] left-[5.29px] h-[6.75px] w-[13.42px] ${activeIconClass}`}
      />
      <img
        src={userGroupSmallIcon}
        alt=""
        className={`absolute top-[5.25px] left-[16.57px] h-[6.85px] w-[4.18px] ${activeIconClass}`}
      />
      <img
        src={userGroupSideIcon}
        alt=""
        className={`absolute top-[13.39px] left-[18.7px] h-[5.42px] w-[4.05px] ${activeIconClass}`}
      />
      <img
        src={userGroupSmallIcon}
        alt=""
        className={`absolute top-[5.25px] left-[3.25px] h-[6.85px] w-[4.18px] -scale-x-100 ${activeIconClass}`}
      />
      <img
        src={userGroupSideIcon}
        alt=""
        className={`absolute top-[13.39px] left-[1.25px] h-[5.42px] w-[4.05px] -scale-x-100 ${activeIconClass}`}
      />
    </span>
  );
}

function VideoIcon({ isActive }) {
  return (
    <span className="relative block size-6" aria-hidden="true">
      <span
        className={`absolute top-[5.5px] left-[2px] h-[13px] w-[14px] rounded-[3.5px] border-[1.5px] ${
          isActive ? 'border-white' : 'border-[#2b3f6c]'
        }`}
      />
      <img
        src={videoIcon}
        alt=""
        className={`absolute top-[6.75px] left-[15.25px] h-[10.34px] w-[7.5px] ${isActive ? 'brightness-0 invert' : ''}`}
      />
    </span>
  );
}

function MessageIcon({ isActive }) {
  const activeIconClass = isActive ? 'brightness-0 invert' : '';

  return (
    <span className="relative block size-6" aria-hidden="true">
      <img src={messageIcon} alt="" className={`absolute top-[1.25px] left-[1.25px] size-[21.5px] ${activeIconClass}`} />
      {[5.8, 10.8, 15.8].map((left) => (
        <img
          key={left}
          src={messageDotIcon}
          alt=""
          className={`absolute top-[10.8px] size-[2.5px] ${activeIconClass}`}
          style={{ left }}
        />
      ))}
    </span>
  );
}

function UserIcon({ isActive }) {
  const activeIconClass = isActive ? 'brightness-0 invert' : '';

  return (
    <span className="relative block size-6" aria-hidden="true">
      <img
        src={userAvatarIcon}
        alt=""
        className={`absolute top-[2.25px] left-[7.25px] size-[9.5px] ${activeIconClass}`}
      />
      <img
        src={userBodyIcon}
        alt=""
        className={`absolute top-[12.5px] left-[4.25px] h-[7.66px] w-[15.5px] ${activeIconClass}`}
      />
    </span>
  );
}

function SettingsIcon() {
  return (
    <span className="relative block size-6" aria-hidden="true">
      <img
        src={settingsIcon}
        alt=""
        className="absolute top-[1.25px] left-[1.77px] h-[21.5px] w-[20.47px] opacity-30"
      />
      <img
        src={settingsCenterIcon}
        alt=""
        className="absolute top-[10.75px] left-[10.75px] size-[2.5px] opacity-30"
      />
    </span>
  );
}

function SidebarNavigation({ activeItem = 'home', className = '', onNavigate, onSettingsClick }) {
  return (
    <aside
      className={`flex h-full w-16 shrink-0 flex-col items-center justify-between rounded-[10px] bg-[var(--color-white)] p-[10px] ${className}`}
    >
      <div className="flex size-11 items-center justify-center rounded-[30px] bg-[linear-gradient(180deg,#2affa3_0%,#37efd9_100%)]">
        <img src={logoIcon} alt="Noddi" className="h-[26px] w-[21px]" />
      </div>

      <nav className="flex flex-col gap-5">
        {navigationItems.map(({ id, icon: Icon }) => {
          const isActive = activeItem === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate?.(id)}
              className={`flex size-11 items-center justify-center rounded-[30px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gray-400)] ${
                isActive
                  ? 'bg-[var(--color-gray-800)]'
                  : 'bg-[var(--color-background-subtle)] hover:bg-[var(--color-gray-100)]'
              }`}
            >
              <Icon isActive={isActive} />
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onSettingsClick}
        className="flex size-11 items-center justify-center rounded-[30px] transition-colors hover:bg-[var(--color-background-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gray-400)]"
      >
        <SettingsIcon />
      </button>
    </aside>
  );
}

export default SidebarNavigation;
