import usersActiveRightIcon from '../../assets/icons/sidebar/users-active-right.svg';
import usersActiveLeftIcon from '../../assets/icons/sidebar/users-active-left.svg';
import usersActiveCenterIcon from '../../assets/icons/sidebar/users-active-center.svg';
import videoActiveIcon from '../../assets/icons/sidebar/video-active.svg';
import messageActiveIcon from '../../assets/icons/sidebar/message-active.svg';
import userAvatarActiveIcon from '../../assets/icons/sidebar/user-avatar-active.svg';
import userBodyActiveIcon from '../../assets/icons/sidebar/user-body-active.svg';
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

function HomeIcon({
  isActive,
}) {
  return (
    <img
      src={
        isActive
          ? homeIcon
          : homeInactiveIcon
      }
      alt=""
      className="h-[20.4px] w-[20.5px]"
    />
  );
}

function UsersIcon({
  isActive,
}) {
  if (isActive) {
    return (
      <span className="relative block size-6" aria-hidden="true">
        <img src={usersActiveRightIcon} alt="" className="absolute left-[16.18px] top-[6px] h-[13px] w-[6.82px]" />
        <img src={usersActiveLeftIcon} alt="" className="absolute left-[1.38px] top-[6px] h-[13px] w-[6.82px] -scale-x-100" />
        <img src={usersActiveCenterIcon} alt="" className="absolute left-[5.51px] top-[4.25px] h-[16.14px] w-[13.415px]" />
      </span>
    );
  }

  return (
    <span
      className="relative block size-6"
      aria-hidden="true"
    >
      <img
        src={
          usersPrimaryIcon
        }
        alt=""
        className="absolute left-[7.85px] top-[3.85px] h-[8.31px] w-[8.31px]"
      />

      <img
        src={
          usersSecondaryIcon
        }
        alt=""
        className="absolute left-[5.29px] top-[12.89px] h-[6.75px] w-[13.42px]"
      />

      <img
        src={
          userGroupSmallIcon
        }
        alt=""
        className="absolute left-[16.57px] top-[5.25px] h-[6.85px] w-[4.18px]"
      />

      <img
        src={
          userGroupSideIcon
        }
        alt=""
        className="absolute left-[18.7px] top-[13.39px] h-[5.42px] w-[4.05px]"
      />

      <img
        src={
          userGroupSmallIcon
        }
        alt=""
        className="absolute left-[3.25px] top-[5.25px] h-[6.85px] w-[4.18px] -scale-x-100"
      />

      <img
        src={
          userGroupSideIcon
        }
        alt=""
        className="absolute left-[1.25px] top-[13.39px] h-[5.42px] w-[4.05px] -scale-x-100"
      />
    </span>
  );
}

function VideoIcon({
  isActive,
}) {
  return (
    <span
      className="relative block size-6"
      aria-hidden="true"
    >
      <span
        className={`absolute left-[2px] h-[13px] w-[14px] rounded-[3.5px] border-[1.5px] ${isActive
          ? 'top-[6px] border-white bg-white'
          : 'top-[5.5px] border-[#2b3f6c]'
          }`}
      />

      <img
        src={isActive ? videoActiveIcon : videoIcon}
        alt=""
        className={`absolute left-[15.25px] h-[10.34px] w-[7.5px] ${isActive
          ? 'top-[7.34px]'
          : 'top-[6.75px]'
          }`}
      />
    </span>
  );
}

function MessageIcon({
  isActive,
}) {
  if (isActive) {
    return (
      <span className="relative block size-6" aria-hidden="true">
        <img src={messageActiveIcon} alt="" className="absolute left-[1.25px] top-[1.25px] size-[21.5px]" />
      </span>
    );
  }

  return (
    <span
      className="relative block size-6"
      aria-hidden="true"
    >
      <img
        src={messageIcon}
        alt=""
        className="absolute left-[1.25px] top-[1.25px] size-[21.5px]"
      />

      {[
        5.8,
        10.8,
        15.8,
      ].map((left) => (
        <img
          key={left}
          src={
            messageDotIcon
          }
          alt=""
          className="absolute top-[10.8px] size-[2.5px]"
          style={{
            left,
          }}
        />
      ))}
    </span>
  );
}

function UserIcon({
  isActive,
}) {
  if (isActive) {
    return (
      <span className="relative block size-6" aria-hidden="true">
        <img src={userAvatarActiveIcon} alt="" className="absolute left-[7.25px] top-[2.25px] size-[9.5px] -scale-x-100 brightness-0 invert" />
        <img src={userBodyActiveIcon} alt="" className="absolute left-[4.25px] top-[13.29px] h-[7.66px] w-[15.5px] brightness-0 invert" />
      </span>
    );
  }

  return (
    <span
      className="relative block size-6"
      aria-hidden="true"
    >
      <img
        src={
          userAvatarIcon
        }
        alt=""
        className="absolute left-[7.25px] top-[2.25px] size-[9.5px]"
      />

      <img
        src={userBodyIcon}
        alt=""
        className="absolute left-[4.25px] top-[12.5px] h-[7.66px] w-[15.5px]"
      />
    </span>
  );
}

function SettingsIcon() {
  return (
    <span
      className="relative block size-6"
      aria-hidden="true"
    >
      <img
        src={settingsIcon}
        alt=""
        className="absolute left-[1.77px] top-[1.25px] h-[21.5px] w-[20.47px] opacity-30"
      />

      <img
        src={
          settingsCenterIcon
        }
        alt=""
        className="absolute left-[10.75px] top-[10.75px] size-[2.5px] opacity-30"
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
      className={`flex h-full w-16 min-w-16 shrink-0 flex-col items-center justify-between rounded-[10px] bg-[var(--color-white)] p-[10px] ${className}`}
    >
      <button
        type="button"
        onClick={() =>
          onNavigate?.(
            'home',
          )
        }
        className="flex size-11 shrink-0 items-center justify-center rounded-[30px] bg-[linear-gradient(180deg,#2affa3_0%,#37efd9_100%)] transition hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gray-400)]"
        aria-label="Noddi 홈"
        title="Noddi 홈"
      >
        <img
          src={logoIcon}
          alt=""
          className="h-[26px] w-[21px]"
        />
      </button>

      <nav
        className="flex flex-col gap-5"
        aria-label="주요 메뉴"
      >
        {navigationItems.map(
          ({
            id,
            label,
            icon: Icon,
          }) => {
            const isActive =
              activeItem === id;

            return (
              <button
                key={id}
                type="button"
                aria-label={
                  label
                }
                title={label}
                aria-current={
                  isActive
                    ? 'page'
                    : undefined
                }
                onClick={() =>
                  onNavigate?.(
                    id,
                  )
                }
                className={`flex size-11 items-center justify-center rounded-[30px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gray-400)] ${isActive
                  ? 'bg-[var(--color-gray-800)]'
                  : 'bg-[var(--color-gray-100)] hover:bg-[var(--color-gray-200)]'
                  }`}
              >
                <Icon
                  isActive={
                    isActive
                  }
                />
              </button>
            );
          },
        )}
      </nav>

      <button
        type="button"
        aria-label="설정"
        title="설정"
        onClick={
          onSettingsClick
        }
        className="flex size-11 shrink-0 items-center justify-center rounded-[30px] transition-colors hover:bg-[var(--color-background-subtle)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gray-400)]"
      >
        <SettingsIcon />
      </button>
    </aside>
  );
}

export default SidebarNavigation;
