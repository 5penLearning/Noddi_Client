import homeIcon from '../../assets/icons/sidebar/home.svg';
import homeInactiveIcon from '../../assets/icons/sidebar/home-inactive.svg';
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
  {
    id: 'home',
    label: '홈',
    icon: HomeIcon,
  },
  {
    id: 'teams',
    label: '팀',
    icon: UsersIcon,
  },
  {
    id: 'meetings',
    label: '화상 회의',
    icon: VideoIcon,
  },
  {
    id: 'qa',
    label: 'Q&A',
    icon: MessageIcon,
  },
  {
    id: 'profile',
    label: '프로필',
    icon: UserIcon,
  },
];

function HomeIcon({ isActive }) {
  return (
    <img
      src={isActive ? homeIcon : homeInactiveIcon}
      alt=""
      className={`h-[23px] w-[23px] transition ${isActive ? 'brightness-0' : 'opacity-75'
        }`}
    />
  );
}

function UsersIcon({ isActive }) {
  const iconClass = isActive ? 'brightness-0' : 'opacity-75';

  return (
    <span
      className="relative block size-7"
      aria-hidden="true"
    >
      <img
        src={usersPrimaryIcon}
        alt=""
        className={`absolute left-[9.2px] top-[4.5px] h-[9.7px] w-[9.7px] ${iconClass}`}
      />

      <img
        src={usersSecondaryIcon}
        alt=""
        className={`absolute left-[6.2px] top-[15px] h-[7.9px] w-[15.7px] ${iconClass}`}
      />

      <img
        src={userGroupSmallIcon}
        alt=""
        className={`absolute left-[19.3px] top-[6.1px] h-[8px] w-[4.9px] ${iconClass}`}
      />

      <img
        src={userGroupSideIcon}
        alt=""
        className={`absolute left-[21.8px] top-[15.6px] h-[6.3px] w-[4.7px] ${iconClass}`}
      />

      <img
        src={userGroupSmallIcon}
        alt=""
        className={`absolute left-[3.8px] top-[6.1px] h-[8px] w-[4.9px] -scale-x-100 ${iconClass}`}
      />

      <img
        src={userGroupSideIcon}
        alt=""
        className={`absolute left-[1.5px] top-[15.6px] h-[6.3px] w-[4.7px] -scale-x-100 ${iconClass}`}
      />
    </span>
  );
}

function VideoIcon({ isActive }) {
  return (
    <span
      className="relative block size-7"
      aria-hidden="true"
    >
      <span
        className={`absolute left-[2px] top-[6.2px] h-[15px] w-[16.5px] rounded-[4px] border-[1.6px] ${isActive
          ? 'border-[#101211]'
          : 'border-[#536D62]'
          }`}
      />

      <img
        src={videoIcon}
        alt=""
        className={`absolute left-[17.8px] top-[7.6px] h-[12px] w-[8.7px] ${isActive ? 'brightness-0' : 'opacity-75'
          }`}
      />
    </span>
  );
}

function MessageIcon({ isActive }) {
  const iconClass = isActive ? 'brightness-0' : 'opacity-75';

  return (
    <span
      className="relative block size-7"
      aria-hidden="true"
    >
      <img
        src={messageIcon}
        alt=""
        className={`absolute left-[1.5px] top-[1.5px] size-[25px] ${iconClass}`}
      />

      {[6.8, 12.6, 18.4].map((left) => (
        <img
          key={left}
          src={messageDotIcon}
          alt=""
          className={`absolute top-[12.6px] size-[2.8px] ${iconClass}`}
          style={{ left }}
        />
      ))}
    </span>
  );
}

function UserIcon({ isActive }) {
  const iconClass = isActive ? 'brightness-0' : 'opacity-75';

  return (
    <span
      className="relative block size-7"
      aria-hidden="true"
    >
      <img
        src={userAvatarIcon}
        alt=""
        className={`absolute left-[8.5px] top-[2.5px] size-[11px] ${iconClass}`}
      />

      <img
        src={userBodyIcon}
        alt=""
        className={`absolute left-[5px] top-[14.5px] h-[9px] w-[18px] ${iconClass}`}
      />
    </span>
  );
}

function SettingsIcon() {
  return (
    <span
      className="relative block size-7"
      aria-hidden="true"
    >
      <img
        src={settingsIcon}
        alt=""
        className="absolute left-[2px] top-[1.5px] h-[25px] w-[24px] opacity-65"
      />

      <img
        src={settingsCenterIcon}
        alt=""
        className="absolute left-[12.6px] top-[12.6px] size-[2.9px] opacity-65"
      />
    </span>
  );
}

function SidebarNavigation({
  activeItem = 'home',
  className = '',
  onNavigate,
  onSettingsClick,
}) {
  return (
    <aside
      className={`flex h-full w-[76px] shrink-0 flex-col items-center justify-between rounded-[12px] border border-[#DCEDE4] bg-white px-3 py-4 ${className}`}
    >
      <div className="flex size-12 items-center justify-center rounded-[13px] bg-[#31F5A0]">
        <img
          src={logoIcon}
          alt="Noddi"
          className="h-[29px] w-[24px]"
        />
      </div>

      <nav
        className="flex flex-col gap-3.5"
        aria-label="주요 메뉴"
      >
        {navigationItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeItem === id;

          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              title={label}
              onClick={() => onNavigate?.(id)}
              className={`flex size-12 items-center justify-center rounded-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31F5A0] ${isActive
                ? 'bg-[#31F5A0]'
                : 'bg-transparent hover:bg-[#EFFFF7]'
                }`}
            >
              <Icon isActive={isActive} />
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        aria-label="설정"
        title="설정"
        onClick={onSettingsClick}
        className="flex size-12 items-center justify-center rounded-[13px] transition-colors hover:bg-[#EFFFF7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31F5A0]"
      >
        <SettingsIcon />
      </button>
    </aside>
  );
}

export default SidebarNavigation;
