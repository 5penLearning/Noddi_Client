import teamLogo from '../../assets/icons/my-team-logo.svg';
import OutlineButton from './OutlineButton';

const MAX_VISIBLE_MEMBERS = 4; // 지금 화면에 동그라미 4개 있어서 4로 함

function MyTeamCard({ team, onMove, onTodoToggle, className = '' }) {
  const visibleMembers = team.members.slice(0, MAX_VISIBLE_MEMBERS);
  const remainingMemberCount = Math.max(team.members.length - visibleMembers.length, 0); // +n명 으로 표시될 나머지 멤버수

  return (
    <section
      className={`h-[440px] w-[453px] overflow-hidden rounded-[10px] bg-[var(--color-gray-50)] px-[22px] pt-[23px] ${className}`}
    >
      <header className="flex h-[31px] items-center">
        <h2 className="headline-3 tracking-[0.24px] text-black">{team.name}</h2>
        <img src={teamLogo} alt="" className="mt-[6px] ml-[10px] h-[22px] w-[27px] self-start" />

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

      <div className="mt-[30px]">
        <h3 className="subhead-3 text-[var(--color-gray-700)]">오늘 회의 일정</h3>
        <p className="mt-[10px] text-base leading-[1.3] font-medium text-[var(--color-gray-500)]">
          {team.todayMeeting ?? '오늘은 회의 일정이 없어요'}
        </p>
      </div>

      <div className="mt-[31px] flex items-center gap-[10px]">
        <h3 className="subhead-3 text-[var(--color-gray-700)]">내 To-do</h3>
        <span className="body-5 text-[var(--color-gray-500)]">{team.todoCount}개</span>
      </div>

      <ul className="mt-[14px] h-[150px] [scrollbar-width:none] overflow-x-hidden overflow-y-auto bg-[var(--color-gray-100)] px-[11px] py-[14px] [&::-webkit-scrollbar]:hidden">
        {team.todos.map((todo) => (
          <li key={todo.id} className="flex h-[40px] items-start">
            <button
              type="button"
              onClick={() => onTodoToggle?.(todo.id)}
              className="mt-[1px] h-[26px] w-[27px] shrink-0 rounded-[8px] border border-black bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gray-500)]"
            />
            <span className="body-4 ml-[10px] min-w-0 flex-1 truncate tracking-[-0.16px] text-black">
              {todo.title}
            </span>
            <time className="body-4 ml-3 shrink-0 tracking-[-0.16px] text-black">
              {todo.dueDate}
            </time>
          </li>
        ))}
      </ul>

      <div className="mt-[13px] flex justify-end pr-[1px]">
        <OutlineButton
          variant="primary"
          onClick={() => onMove?.(team.id)}
          className="h-[42px] !min-h-0 w-[114px]"
        >
          이동하기
        </OutlineButton>
      </div>
    </section>
  );
}

export default MyTeamCard;
