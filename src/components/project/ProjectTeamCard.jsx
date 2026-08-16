import OutlineButton from '../common/OutlineButton';

const MAX_VISIBLE_MEMBERS = 4;

function ProjectTeamCard({ team, onAsk, className = '' }) {
  const visibleMembers = team.members.slice(0, MAX_VISIBLE_MEMBERS);
  const remainingMemberCount = Math.max(team.members.length - visibleMembers.length, 0);

  return (
    <section
      className={`h-[149px] w-[453px] overflow-hidden rounded-[10px] bg-[var(--color-gray-50)] px-[22px] pt-[23px] ${className}`}
    >
      <header className="flex h-[31px] items-center">
        <h2 className="headline-3 tracking-[0.24px] text-black">{team.name}</h2>

        <div className="ml-auto flex items-center">
          <div className="flex">
            {visibleMembers.map((member, index) => (
              <img
                key={member.id}
                src={member.avatarUrl}
                alt=""
                className={`size-7 rounded-full ${index === 0 ? '' : '-ml-[7px]'}`}
              />
            ))}
          </div>
          {remainingMemberCount > 0 && (
            <span className="ml-[6px] text-base leading-[1.3] font-medium">
              +{remainingMemberCount}
            </span>
          )}
        </div>
      </header>

      <div className="mt-[32px] flex items-center justify-between">
        <p className="subhead-2 text-[var(--color-gray-500)]">{team.status}</p>
        <OutlineButton
          variant="dark"
          onClick={() => onAsk?.(team.id)}
          className="h-[42px] !min-h-0 w-[114px] !px-0 !py-0"
        >
          질문하러 가기
        </OutlineButton>
      </div>
    </section>
  );
}

export default ProjectTeamCard;
