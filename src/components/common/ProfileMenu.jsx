import avatarDefault from '../../assets/icons/profile/avatar-default.svg';
import chevronIcon from '../../assets/icons/profile/chevron.svg';

function ProfileMenu({ name = '김유진', department = '마케팅부', onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 w-[346px] shrink-0 items-center justify-between rounded-[10px] bg-[var(--color-white)] p-[10px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gray-400)] ${className}`}
    >
      <span className="flex items-center gap-3">
        <img src={avatarDefault} alt="" className="size-7 shrink-0" />
        <span className="flex items-center gap-5 whitespace-nowrap">
          <span className="body-3 tracking-[-0.16px] text-[var(--color-black)]">{name}</span>
          <span className="caption-1 tracking-[-0.28px] text-[var(--color-text-secondary)]">{department}</span>
        </span>
      </span>
      <span className="flex size-6 items-center justify-center">
        <img src={chevronIcon} alt="" className="h-[7.12px] w-[15.5px] -rotate-90" />
      </span>
    </button>
  );
}

export default ProfileMenu;
