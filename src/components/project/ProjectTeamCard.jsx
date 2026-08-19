import defaultTeamAvatar from '../../assets/icons/my-team-avatar.svg';
import questionDotIcon from '../../assets/icons/project-question-dot.svg';
import questionMessageIcon from '../../assets/icons/project-question-message.svg';
import questionSparkleIcon from '../../assets/icons/project-question-sparkle.svg';
import ProfileAvatar from '../common/ProfileAvatar';

const MAX_VISIBLE_MEMBERS = 4;

function QuestionIcon() {
  return (
    <span className="relative block size-4 shrink-0">
      <img
        src={questionMessageIcon}
        alt=""
        className="absolute top-[0.83px] left-[0.83px] size-[14.33px]"
      />
      {[3.87, 7.2, 10.53].map((left) => (
        <img
          key={left}
          src={questionDotIcon}
          alt=""
          className="absolute top-[7.2px] size-[1.67px]"
          style={{ left }}
        />
      ))}
      <img
        src={questionSparkleIcon}
        alt=""
        className="absolute top-0 left-[9.33px] size-[6.67px]"
      />
    </span>
  );
}

function ProjectTeamCard({ team, onAsk, className = '' }) {
  const members = team.members ?? [];
  const visibleMembers = members.slice(0, MAX_VISIBLE_MEMBERS);
  const remainingMemberCount = Math.max(members.length - visibleMembers.length, 0);

  return (
    <section
      className={`flex h-[173px] w-[442px] flex-col gap-[10px] overflow-hidden rounded-[10px] border border-[var(--color-gray-200)] bg-white p-4 ${className}`}
    >
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-3">
          <header className="flex items-start justify-between">
            <h2 className="text-[20px] leading-[1.3] font-semibold text-black">{team.name}</h2>

            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {visibleMembers.map((member, index) => (
                  <ProfileAvatar
                    key={member.id}
                    userId={member.userId ?? member.id}
                    profileImageUrl={member.profileImageUrl ?? member.avatarUrl}
                    name={member.name}
                    fallbackSrc={defaultTeamAvatar}
                    className={`size-6 rounded-full border-[0.5px] border-[var(--color-gray-200)] bg-[var(--color-gray-100)] object-cover ${index === 0 ? '' : '-ml-[7px]'}`}
                  />
                ))}
              </div>
              {remainingMemberCount > 0 && (
                <span className="text-[20px] leading-[1.4] tracking-[-0.1px] text-[var(--color-action-primary)]">
                  +{remainingMemberCount}
                </span>
              )}
            </div>
          </header>

          <p className="truncate text-[16px] leading-[1.3] font-medium text-[var(--color-gray-800)]">
            {team.description || team.status || '팀 소개가 아직 없습니다.'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAsk?.(team.id)}
        className="flex h-11 w-[110px] shrink-0 flex-row items-center justify-center gap-1 rounded-[10px] bg-[var(--color-gray-100)] px-5 py-[10px] text-[16px] leading-[1.3] font-semibold whitespace-nowrap text-[var(--color-gray-700)]"
      >
        <QuestionIcon />
        <span className="shrink-0 whitespace-nowrap">질문하기</span>
      </button>
    </section>
  );
}

export default ProjectTeamCard;
