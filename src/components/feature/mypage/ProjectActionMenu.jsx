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

function FolderIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function ExitIcon() {
  return (
    <svg
      width="16"
      height="16"
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
    <div className="absolute right-0 top-[42px] z-30 w-[180px] overflow-hidden rounded-[14px] border border-[#D5EFE2] bg-white p-1.5 shadow-[0_14px_40px_rgba(16,18,17,0.12)]">
      <button
        type="button"
        onClick={
          onOpenProject
        }
        className="group flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition hover:bg-[#F0FFF7]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#EFFFF7] text-[#16885B]">
          <FolderIcon />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold text-[#254E3D]">
            프로젝트로 이동
          </span>

          <span className="mt-0.5 block text-[9px] text-[#789084]">
            프로젝트 상세 보기
          </span>
        </span>

        <span className="text-[#739186] transition group-hover:translate-x-0.5 group-hover:text-[#101211]">
          <ArrowIcon />
        </span>
      </button>

      <div className="my-1 border-t border-[#E7F6EF]" />

      <button
        type="button"
        disabled={
          isLeaving
        }
        onClick={
          onLeaveProject
        }
        className="group flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left transition hover:bg-[#FFF4F2] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#FFF0EE] text-[#F64E42]">
          <ExitIcon />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold text-[#E44B41]">
            {isLeaving
              ? '탈퇴 중...'
              : '프로젝트 탈퇴'}
          </span>

          <span className="mt-0.5 block text-[9px] text-[#B57B76]">
            프로젝트에서 나가기
          </span>
        </span>
      </button>
    </div>
  );
}

export default ProjectActionMenu;
