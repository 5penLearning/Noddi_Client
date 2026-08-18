import avatarDefault from '../../assets/icons/profile/avatar-default.svg';

import ProfileAvatar from './ProfileAvatar';

function ChevronDownIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfileMenu({
  userId,
  profileImageUrl,
  name = '사용자',
  department = '소속 조직',
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex h-12 w-full max-w-[360px] shrink-0 items-center justify-between rounded-[12px] border border-transparent bg-white px-3 text-left transition hover:border-[#DCEEE5] hover:bg-[#F8FFFB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#31F5A0] ${className}`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <ProfileAvatar
          userId={userId}
          profileImageUrl={profileImageUrl}
          name={name}
          fallbackSrc={avatarDefault}
          className="size-9 shrink-0 border border-[#D2EADF]"
        />

        <span className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-[14px] font-semibold text-[#101211]">
            {name}
          </span>

          <span className="hidden truncate text-[13px] text-[#6B8278] sm:block">
            {department}
          </span>
        </span>
      </span>

      <span className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[#617A70] transition group-hover:bg-[#EFFFF7] group-hover:text-[#101211]">
        <ChevronDownIcon />
      </span>
    </button>
  );
}

export default ProfileMenu;
