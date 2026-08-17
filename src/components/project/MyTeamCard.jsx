import OutlineButton from '../common/OutlineButton';

import defaultTeamAvatar from '../../assets/icons/my-team-avatar.svg';
import teamLogo from '../../assets/icons/my-team-logo.svg';

const MAX_VISIBLE_MEMBERS = 4;

function MyTeamCard({ team, onMove, onTodoToggle, className = '' }) {
  const members = team.members ?? [];
  const todos = team.todos ?? [];
  const meetings = Array.isArray(team.todayMeetings)
    ? team.todayMeetings
    : team.todayMeeting
      ? [team.todayMeeting]
      : [];
  const visibleMembers = members.slice(0, MAX_VISIBLE_MEMBERS);
  const remainingMemberCount = Math.max(members.length - visibleMembers.length, 0);

  return (
    <section
      className={`flex h-[440px] w-[453px] flex-col justify-between overflow-hidden rounded-[10px] bg-[var(--color-gray-50)] px-5 py-6 ${className}`}
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[24px] leading-[1.3] font-semibold tracking-[0.24px] text-black">
            {team.name}
          </h2>
          <img src={teamLogo} alt="" className="h-[22px] w-[27px]" />
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {visibleMembers.map((member, index) => (
              <img
                key={member.id}
                src={member.avatarUrl || defaultTeamAvatar}
                alt=""
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

      <div className="flex flex-col gap-2">
        <h3 className="text-[20px] leading-[1.3] font-medium text-[var(--color-gray-700)]">
          오늘 회의 일정
        </h3>
        {meetings.length > 0 ? (
          <div className="relative overflow-hidden">
            <div className="flex [scrollbar-width:none] gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {meetings.map((meeting, index) => (
                <span
                  key={meeting.id ?? index}
                  className="shrink-0 rounded-[10px] bg-[#D5F2E6] px-[10px] py-[6px] text-[16px] leading-[1.3] font-medium text-[#0C0D0D]"
                >
                  {meeting.title ?? meeting}
                </span>
              ))}
            </div>
            <span className="pointer-events-none absolute top-0 right-0 h-full w-[164px] bg-gradient-to-l from-[var(--color-gray-50)] to-transparent" />
          </div>
        ) : (
          <p className="text-[16px] leading-[1.3] font-medium text-[var(--color-gray-500)]">
            오늘은 회의 일정이 없어요.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-[20px] leading-[1.3] font-medium text-[var(--color-gray-700)]">
              내 To-do
            </h3>
            <span className="text-[16px] leading-[1.3] font-medium text-[var(--color-gray-500)]">
              {todos.length}개
            </span>
          </div>
          <button
            type="button"
            className="text-[14px] leading-[1.4] tracking-[-0.21px] text-[var(--color-gray-700)] underline"
          >
            편집하기
          </button>
        </div>

        <ul className="h-[147px] [scrollbar-width:none] overflow-x-hidden overflow-y-auto rounded-[8px] border border-[var(--color-gray-200)] bg-[var(--color-gray-100)] px-[13px] py-[14px] [&::-webkit-scrollbar]:hidden">
          {todos.map((todo) => (
            <li key={todo.id} className="flex h-[31px] items-center gap-2">
              <button
                type="button"
                onClick={() => onTodoToggle?.(todo.id)}
                className={`size-5 shrink-0 rounded-[5px] border-[1.5px] border-[#2B3F6C] ${todo.completed ? 'bg-[#2B3F6C]' : 'bg-transparent'}`}
              />
              <span className="min-w-0 flex-1 truncate text-[14px] leading-[1.4] tracking-[-0.21px] text-[var(--color-gray-800)]">
                {todo.title}
              </span>
              {todo.dueDate && (
                <time className="shrink-0 text-[14px] leading-[1.4] tracking-[-0.21px] text-[var(--color-gray-600)]">
                  {todo.dueDate}
                </time>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end">
        <OutlineButton
          variant="primary"
          onClick={() => onMove?.(team.id)}
          className="h-11 !min-h-0 w-[110px] !px-0 !py-0"
        >
          이동하기
        </OutlineButton>
      </div>
    </section>
  );
}

export default MyTeamCard;
