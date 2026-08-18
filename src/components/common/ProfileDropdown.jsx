import avatarDefault from '../../assets/icons/profile/avatar-default.svg';
import chevronIcon from '../../assets/icons/profile/chevron.svg';
import userAvatarIcon from '../../assets/icons/sidebar/user-avatar.svg';
import userBodyIcon from '../../assets/icons/sidebar/user-body.svg';

function ProfileIcon() {
  return (
    <span className="relative block size-6 shrink-0">
      <img src={userAvatarIcon} className="absolute top-[3px] left-2 size-2" />
      <img src={userBodyIcon} className="absolute top-[13px] left-[5px] h-[7.5px] w-3.5" />
    </span>
  );
}

function ActivityIcon() {
  return (
    <span className="flex size-6 shrink-0 items-end justify-center gap-[2px] rounded-[5px] border-[1.5px] border-[#525654] px-1 pb-1">
      <span className="h-[5px] w-[2px] rounded-full bg-[#525654]" />
      <span className="h-[10px] w-[2px] rounded-full bg-[#525654]" />
      <span className="h-[7px] w-[2px] rounded-full bg-[#525654]" />
    </span>
  );
}

function ProjectIcon() {
  return (
    <span className="relative block size-6 shrink-0">
      <span className="absolute top-[6px] left-0.5 h-[15px] w-5 rounded-[4px] border-[1.5px] border-[#525654]" />
      <span className="absolute top-[3px] left-[8px] h-1 w-2 rounded-t-[2px] border-[1.5px] border-b-0 border-[#525654]" />
      <span className="absolute top-[11px] left-0.5 h-px w-5 bg-[#525654]" />
    </span>
  );
}

function HelpIcon() {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#525654] text-[15px] font-medium text-[#525654]">
      i
    </span>
  );
}

function LogoutIcon() {
  return (
    <span className="relative block size-6 shrink-0">
      <span className="absolute top-0.5 left-[3px] h-5 w-[13px] rounded-[4px] border-[1.5px] border-[#525654]" />
      <span className="absolute top-[11px] left-[9px] h-[1.5px] w-[13px] bg-[#525654]" />
      <span className="absolute top-[8px] right-0 size-[7px] rotate-45 border-t-[1.5px] border-r-[1.5px] border-[#525654]" />
    </span>
  );
}

const menuItems = [
  { id: 'profile', label: '내 프로필', icon: ProfileIcon },
  { id: 'activity', label: '내 참여도', icon: ActivityIcon },
  { id: 'projects', label: '내 프로젝트', icon: ProjectIcon },
];

const footerItems = [
  { id: 'help', label: '도움말', icon: HelpIcon },
  { id: 'logout', label: '로그아웃', icon: LogoutIcon },
];

function MenuButton({ item, onClick }) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-6 w-full items-center justify-between text-[#525654]"
    >
      <span className="flex items-center gap-2">
        <Icon />
        <span className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px]">
          {item.label}
        </span>
      </span>
      <span className="flex size-6 items-center justify-center">
        <img src={chevronIcon} className="h-[7px] w-[15px] rotate-90 opacity-70" />
      </span>
    </button>
  );
}

function ProfileDropdown({ name, organization, email, onSelect }) {
  const currentTime = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());

  return (
    <section className="absolute top-[52px] right-0 z-50 flex h-[412px] w-[284px] flex-col gap-6 overflow-hidden rounded-[10px] bg-white px-[18px] py-[26px] shadow-[0_11px_24px_rgba(0,0,0,0.10),0_43px_43px_rgba(0,0,0,0.09),0_97px_58px_rgba(0,0,0,0.05)]">
      <div className="flex h-32 shrink-0 flex-col gap-4">
        <div className="flex h-[68px] items-start gap-[13px]">
          <img src={avatarDefault} className="size-16 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[20px] leading-[1.3] font-medium text-black">{name}</p>
            <p className="truncate text-[16px] leading-[1.4] tracking-[-0.16px] text-[#707673]">
              {organization}
            </p>
            <p className="truncate text-[14px] leading-[1.4] tracking-[-0.21px] text-[#707673]">
              {email}
            </p>
          </div>
        </div>

        <div className="flex h-11 items-center justify-between rounded-[10px] border border-[#E9EFED] p-[10px]">
          <span className="flex items-center gap-1.5 text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#343836]">
            <span className="size-2 rounded-full bg-[#31F5A0]" />
            업무 중
          </span>
          <span className="text-[14px] leading-[1.4] tracking-[-0.21px] text-[#343836]">
            KST {currentTime}
          </span>
        </div>
      </div>

      <div className="flex h-52 shrink-0 flex-col gap-5">
        <div className="flex flex-col gap-4">
          {menuItems.map((item) => (
            <MenuButton key={item.id} item={item} onClick={() => onSelect?.(item.id)} />
          ))}
        </div>
        <div className="h-px w-full bg-[#D7DEDB]" />
        <div className="flex flex-col gap-4">
          {footerItems.map((item) => (
            <MenuButton key={item.id} item={item} onClick={() => onSelect?.(item.id)} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProfileDropdown;
