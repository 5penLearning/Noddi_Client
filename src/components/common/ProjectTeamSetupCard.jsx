import closeLineLeftIcon from '../../assets/icons/project-create/close-line-left.svg';
import closeLineRightIcon from '../../assets/icons/project-create/close-line-right.svg';
import editIcon from '../../assets/icons/project-create/edit.svg';
import defaultMemberAvatar from '../../assets/icons/project-create/member-avatar.svg';
import searchIcon from '../../assets/icons/project-create/search.svg';

function ProjectTeamSetupCard({
  team,
  onEdit,
  onRemove,
  onSearchLeader,
  className = '',
}) {
  const leader = team.leader;

  return (
    <article
      className={`h-[137px] w-[287px] overflow-hidden rounded-[10px] border border-[var(--color-gray-200)] bg-[var(--color-white)] px-[14px] pt-[13px] ${className}`}
    >
      <div className="flex h-6 items-center">
        <span className="body-3 tracking-[-0.16px] text-[var(--color-black)]">
          {team.name}
        </span>

        <button
          type="button"
          onClick={() => onEdit?.(team.id)}
          className="ml-[14px] flex size-6 items-center justify-center"
        >
          <img src={editIcon} className="h-[18px] w-[19px]" />
        </button>

        <button
          type="button"
          onClick={() => onRemove?.(team.id)}
          className="relative ml-auto size-6"
        >
          <img
            src={closeLineLeftIcon}
            className="absolute left-[7px] top-[11px] h-[1.5px] w-[10px] rotate-45"
          />
          <img
            src={closeLineRightIcon}
            className="absolute left-[7px] top-[11px] h-[1.5px] w-[10px] -rotate-45"
          />
        </button>
      </div>

      <p className="body-5 mt-[16px] tracking-[-0.21px] text-[var(--color-black)]">
        팀장 설정
      </p>

      <button
        type="button"
        onClick={() => onSearchLeader?.(team.id)}
        className="mt-[8px] flex h-8 w-[225px] items-center rounded-[10px] border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-1"
      >
        {leader && (
          <>
            <img
              src={leader.avatarUrl || defaultMemberAvatar}
              className="size-5 shrink-0 rounded-full"
            />
            <span className="body-5 ml-[10px] shrink-0 tracking-[-0.21px] text-[var(--color-black)]">
              {leader.name}
            </span>
            <span className="caption-1 ml-[10px] min-w-0 truncate tracking-[-0.28px] text-[var(--color-gray-500)]">
              {leader.position}
            </span>
          </>
        )}

        <img src={searchIcon} className="ml-auto size-6 shrink-0" />
      </button>
    </article>
  );
}

export default ProjectTeamSetupCard;
