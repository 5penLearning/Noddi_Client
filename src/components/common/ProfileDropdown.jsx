import avatarDefault from '../../assets/icons/profile/avatar-default.svg';

import ProfileAvatar from './ProfileAvatar';

function ProfileIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M5.5 20C5.5 16.6863 8.41015 14 12 14C15.5899 14 18.5 16.6863 18.5 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 20V13M12 20V5M19 20V9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProjectIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7.5C3 6.11929 4.11929 5 5.5 5H9L11 7H18.5C19.8807 7 21 8.11929 21 9.5V17.5C21 18.8807 19.8807 20 18.5 20H5.5C4.11929 20 3 18.8807 3 17.5V7.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M9.8 9C10 7.7 10.9 7 12.2 7C13.7 7 14.7 7.9 14.7 9.2C14.7 10.3 14.2 10.9 13.1 11.6C12.3 12.1 12 12.6 12 13.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="17"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 5H6C4.89543 5 4 5.89543 4 7V17C4 18.1046 4.89543 19 6 19H10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M14 8L18 12L14 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M18 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const menuItems = [
  {
    id: 'profile',
    label: '내 프로필',
    icon: ProfileIcon,
  },
  {
    id: 'activity',
    label: '내 참여도',
    icon: ActivityIcon,
  },
  {
    id: 'projects',
    label: '내 프로젝트',
    icon: ProjectIcon,
  },
];

const footerItems = [
  {
    id: 'help',
    label: '도움말',
    icon: HelpIcon,
  },
  {
    id: 'logout',
    label: '로그아웃',
    icon: LogoutIcon,
    danger: true,
  },
];

function MenuButton({
  item,
  onClick,
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex h-12 w-full items-center gap-3 rounded-[10px] px-3 text-left transition ${item.danger
        ? 'text-[#F64E42] hover:bg-[#FFF3F1]'
        : 'text-[#314F42] hover:bg-[#EFFFF7]'
        }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center">
        <Icon />
      </span>

      <span
        className={`min-w-0 flex-1 text-[14px] font-medium ${item.danger
          ? 'text-[#F64E42]'
          : 'text-[#20342C]'
          }`}
      >
        {item.label}
      </span>

      {!item.danger && (
        <span className="shrink-0 text-[#718A7F] transition group-hover:translate-x-0.5 group-hover:text-[#101211]">
          <ChevronRightIcon />
        </span>
      )}
    </button>
  );
}

function ProfileDropdown({
  userId,
  profileImageUrl,
  name = '사용자',
  organization = '',
  email = '',
  onSelect,
}) {
  const currentTime =
    new Intl.DateTimeFormat(
      'ko-KR',
      {
        timeZone: 'Asia/Seoul',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
    ).format(new Date());

  return (
    <section className="absolute right-0 top-[52px] z-50 w-[min(320px,calc(100vw-32px))] overflow-hidden rounded-[16px] border border-[#D8ECE2] bg-white p-3 shadow-[0_16px_40px_rgba(16,18,17,0.12)]">
      {/* Profile */}
      <div className="rounded-[12px] bg-[#F4FFF9] p-4">
        <div className="flex items-center gap-3.5">
          <ProfileAvatar
            userId={userId}
            profileImageUrl={profileImageUrl}
            name={name}
            fallbackSrc={avatarDefault}
            className="size-14 shrink-0 border border-[#C9EFDB]"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-[16px] font-semibold tracking-[-0.02em] text-[#101211]">
              {name}
            </p>

            {organization && (
              <p className="mt-1 truncate text-[13px] font-medium text-[#537466]">
                {organization}
              </p>
            )}

            {email && (
              <p className="mt-1 truncate text-[12px] text-[#738A80]">
                {email}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex h-10 items-center justify-between rounded-[9px] border border-[#D6EFE2] bg-white px-3">
          <span className="flex items-center gap-2 text-[13px] font-medium text-[#355C4B]">
            <span className="size-2 rounded-full bg-[#31F5A0]" />
            업무 중
          </span>

          <span className="text-[12px] text-[#698277]">
            KST {currentTime}
          </span>
        </div>
      </div>

      <div className="mt-2 space-y-0.5">
        {menuItems.map((item) => (
          <MenuButton
            key={item.id}
            item={item}
            onClick={() => onSelect?.(item.id)}
          />
        ))}
      </div>

      <div className="my-2 border-t border-[#E5F3EC]" />

      <div className="space-y-0.5">
        {footerItems.map((item) => (
          <MenuButton
            key={item.id}
            item={item}
            onClick={() => onSelect?.(item.id)}
          />
        ))}
      </div>
    </section>
  );
}

export default ProfileDropdown;
