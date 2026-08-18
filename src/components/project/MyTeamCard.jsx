import { useState } from 'react';
import { createPortal } from 'react-dom';

import OutlineButton from '../common/OutlineButton';
import ProfileAvatar from '../common/ProfileAvatar';
import { ActionItemForm, EditIcon, TrashIcon } from '../feature/meeting/ActionItemPanel';

import teamLogo from '../../assets/icons/my-team-logo.svg';
import todoLinkChainIcon from '../../assets/icons/home-todo/link-chain.svg';
import todoLinkLineIcon from '../../assets/icons/home-todo/link-line.svg';

const MAX_VISIBLE_MEMBERS = 4;

const INITIAL_EDIT_FORM = {
  content: '',
  assigneeUserId: '',
  dueDate: '',
  status: 'PENDING',
};

function MyTeamCard({
  team,
  onMove,
  onTodoToggle,
  onTodoEdit,
  onTodoDelete,
  onTodoOpen,
  className = '',
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingForm, setEditingForm] = useState(INITIAL_EDIT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
              <ProfileAvatar
                key={member.id}
                userId={member.userId ?? member.id}
                profileImageUrl={member.profileImageUrl ?? member.avatarUrl}
                name={member.name}
                showBrandFallback
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

      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="text-[20px] leading-[1.3] font-medium text-[var(--color-gray-700)]">
          오늘 회의 일정
        </h3>
        {meetings.length > 0 ? (
          <div className="relative min-w-0 overflow-hidden">
            <div className="flex min-w-0 touch-pan-x gap-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {meetings.map((meeting, index) => (
                <span
                  key={meeting.id ?? index}
                  className={`shrink-0 rounded-[10px] px-[10px] py-[6px] text-[16px] leading-[1.3] font-medium text-[#0C0D0D] ${
                    ['bg-[#B1F0D5]', 'bg-[#D5F2E6]', 'bg-[#E1F8EE]'][index % 3]
                  }`}
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
            onClick={() => setIsEditing((currentValue) => !currentValue)}
            aria-pressed={isEditing}
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
                className={`relative size-5 shrink-0 rounded-[5px] ${
                  todo.completed
                    ? 'bg-[#11E489]'
                    : 'border-[1.5px] border-[#2B3F6C] bg-transparent'
                }`}
              >
                {todo.completed && (
                  <span className="absolute top-[2px] left-[6px] h-[10px] w-[6px] rotate-45 border-r-2 border-b-2 border-white" />
                )}
              </button>
              <div className="flex min-w-0 flex-1 items-center gap-1">
                <span
                  className={`min-w-0 truncate text-[14px] leading-[1.4] tracking-[-0.21px] ${
                    todo.completed
                      ? 'text-[var(--color-gray-500)] line-through'
                      : 'text-[var(--color-gray-800)]'
                  }`}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  onClick={() => onTodoOpen?.(todo)}
                  className={`relative block size-5 shrink-0 ${
                    todo.completed ? 'opacity-30' : 'opacity-40'
                  }`}
                  aria-label={`${todo.title} 회의록으로 이동`}
                >
                  <span className="absolute top-[0.83px] left-[0.71px] flex size-[17.68px] items-center justify-center">
                    <img
                      src={todoLinkChainIcon}
                      alt=""
                      className="h-[16.67px] w-[8.33px] rotate-45"
                    />
                  </span>
                  <img
                    src={todoLinkLineIcon}
                    alt=""
                    className="absolute top-[8.2px] left-[7.8px] h-[1.5px] w-[6px] -rotate-45"
                  />
                </button>
              </div>
              {isEditing && (
                <div className="flex shrink-0 items-center gap-1 text-[#707673]">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTodo(todo);
                      setEditingForm({
                        content: todo.content ?? todo.title ?? '',
                        assigneeUserId: todo.assigneeUserId
                          ? String(todo.assigneeUserId)
                          : '',
                        dueDate: todo.dueDate ?? '',
                        status: todo.status ?? 'PENDING',
                      });
                    }}
                    className="size-5"
                    aria-label={`${todo.title} 수정`}
                  >
                    <EditIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => onTodoDelete?.(todo.id)}
                    className="size-5"
                    aria-label={`${todo.title} 삭제`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <OutlineButton
          variant="primary"
          onClick={() => onMove?.(team.id)}
          className="h-11 !min-h-0 w-[110px] !px-0 !py-0"
        >
          팀페이지로
        </OutlineButton>
      </div>

      {editingTodo && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSubmitting) setEditingTodo(null);
          }}
        >
          <div className="w-[440px] rounded-[16px] bg-white p-5 shadow-xl">
            <h3 className="mb-4 text-[20px] leading-[1.3] font-semibold text-black">
              할 일 수정
            </h3>
            <ActionItemForm
              form={editingForm}
              members={members}
              isSubmitting={isSubmitting}
              submitLabel="저장"
              showStatus
              onChange={(event) => {
                const { name, value } = event.target;
                setEditingForm((currentForm) => ({ ...currentForm, [name]: value }));
              }}
              onSubmit={async () => {
                if (!editingForm.content.trim()) return;

                try {
                  setIsSubmitting(true);
                  await onTodoEdit?.(editingTodo.id, {
                    content: editingForm.content.trim(),
                    assigneeUserId: editingForm.assigneeUserId
                      ? Number(editingForm.assigneeUserId)
                      : null,
                    dueDate: editingForm.dueDate || null,
                    status: editingForm.status,
                  });
                  setEditingTodo(null);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              onCancel={() => setEditingTodo(null)}
            />
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}

export default MyTeamCard;
