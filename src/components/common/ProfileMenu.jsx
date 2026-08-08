function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-5">
      <path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProfileMenu({ name = '김유진', department = '마케팅부', onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full min-w-[154px] items-center gap-2 rounded-[10px] bg-[var(--color-background)] px-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gray-400)] ${className}`}
    >
      <span className="size-8 shrink-0 rounded-full bg-[var(--color-gray-200)]" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium leading-[1.2] text-[var(--color-gray-800)]">{name}</span>
        <span className="mt-0.5 block truncate text-[10px] leading-[1.2] text-[var(--color-text-tertiary)]">{department}</span>
      </span>
      <span className="shrink-0 text-[#2b3f6c]">
        <ChevronDownIcon />
      </span>
    </button>
  );
}

export default ProfileMenu;
