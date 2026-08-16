function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExitIcon() {
  return (
    <svg
      width="15"
      height="15"
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

function ProjectActionMenu({
  isLeaving,
  onOpenProject,
  onLeaveProject,
}) {
  return (
    <div className="absolute right-0 top-9 z-20 w-[150px] overflow-hidden rounded-lg border border-[#E1E6E3] bg-white py-1 shadow-[0_8px_24px_rgba(16,18,17,0.12)]">
      <button
        type="button"
        onClick={onOpenProject}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-medium text-[#303633] transition hover:bg-[#F5F7F6]"
      >
        <span>
          프로젝트로 이동
        </span>

        <ArrowIcon />
      </button>

      <div className="mx-3 border-t border-[#EDF0EF]" />

      <button
        type="button"
        disabled={isLeaving}
        onClick={onLeaveProject}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-medium text-[#F64E42] transition hover:bg-[#FFF4F3] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ExitIcon />

        {isLeaving
          ? '탈퇴 중...'
          : '프로젝트 탈퇴'}
      </button>
    </div>
  );
}

export default ProjectActionMenu;
