import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { deleteActionItem, getMyActionItems, updateActionItem } from '../../api/actionItemApi';
import { getApiErrorMessage, getUserId } from '../../api/axios';
import { getUnreadAnswerCards, getUnreadAnswerCountsByProject } from '../../api/homeApi';
import { getMeetings } from '../../api/meetingApi';
import { getMyTeams, getTeamMembers } from '../../api/teams';
import { ActionItemForm, EditIcon, TrashIcon } from '../feature/meeting/ActionItemPanel';
import ProfileAvatar from '../common/ProfileAvatar';
import logo from '../../assets/logo-green.svg';
import { homePageMockData } from '../../mocks/homePageData';

import calendarArrowIcon from '../../assets/icons/home-meeting/calendar-arrow.svg';
import meetingSymbolIcon from '../../assets/icons/home-meeting/meeting-symbol.svg';
import meetingSymbolSecondaryIcon from '../../assets/icons/home-meeting/meeting-symbol-secondary.svg';
import scheduleDotPrimaryIcon from '../../assets/icons/home-meeting/schedule-dot-primary.svg';
import scheduleDotSecondaryIcon from '../../assets/icons/home-meeting/schedule-dot-secondary.svg';
import todoLinkChainIcon from '../../assets/icons/home-todo/link-chain.svg';
import todoLinkLineIcon from '../../assets/icons/home-todo/link-line.svg';
import chevronIcon from '../../assets/icons/profile/chevron.svg';
import logoSimpleIcon from '../../assets/icons/sidebar/logo-simple.svg';

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const formatDateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const formatMeetingScheduleItem = (meeting, team) => {
  const startDate = new Date(meeting.scheduledStartAt);

  if (Number.isNaN(startDate.getTime())) return null;

  return {
    id: meeting.meetingId,
    meetingId: meeting.meetingId,
    projectId: meeting.projectId ?? team.projectId,
    teamId: meeting.teamId ?? team.teamId,
    date: formatDateKey(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()),
    time: `${String(startDate.getHours()).padStart(2, '0')}:${String(
      startDate.getMinutes(),
    ).padStart(2, '0')}`,
    title: meeting.title,
    projectName: meeting.projectName ?? team.projectName ?? '프로젝트',
    teams: [team.name],
    isOngoing: meeting.status === 'IN_PROGRESS',
    canJoin: meeting.status === 'IN_PROGRESS',
    rawMeeting: meeting,
  };
};

const formatQaTime = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .format(date)
    .replace(/\. /g, '. ');
};

const normalizeUnreadAnswerCards = (cards) =>
  (cards?.items ?? []).map((item) => {
    const source = item.sources?.[0];
    const currentUserId = getUserId();

    return {
      id: item.answerId ?? `question-${item.questionId}`,
      notificationId: item.notificationId,
      questionId: item.questionId,
      questionerId: item.questioner?.userId,
      profileImageUrl: item.questioner?.profileImageUrl,
      isMine: currentUserId
        ? Number(item.questioner?.userId) === Number(currentUserId)
        : false,
      name: item.questioner?.name ?? '알 수 없는 사용자',
      role: [item.questioner?.department, item.questioner?.position].filter(Boolean).join(' · '),
      time: formatQaTime(item.questionCreatedAt),
      projectId: item.projectId,
      projectName: item.projectName,
      teamId: item.teamId,
      teamName: item.teamName,
      question: item.questionContent,
      answer: item.answerContent,
      status: '답변이 완료되었어요.',
      referenceId: source?.referenceId,
      reference: source?.sourceTitle ?? '참고 회의록 없음',
      referenceNavigation: source?.navigation,
      answeredAt: item.questionCreatedAt,
    };
  });

function MeetingSchedule({ initialDate, meetings, isLoading, errorMessage, onJoin }) {
  const initial = new Date(`${initialDate}T00:00:00`);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(initial.getFullYear(), initial.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarWeekCount = Math.ceil((firstDay + daysInMonth) / 7);
  const isLongMonth = calendarWeekCount === 6;
  const calendarDays = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  const selectedMeetings = meetings.filter((meeting) => meeting.date === selectedDate);
  const meetingCountByDate = meetings.reduce((counts, meeting) => {
    counts[meeting.date] = (counts[meeting.date] ?? 0) + 1;

    return counts;
  }, {});
  const selected = new Date(`${selectedDate}T00:00:00`);
  const selectedDateLabel = `${String(selected.getMonth() + 1).padStart(2, '0')}월 ${String(selected.getDate()).padStart(2, '0')}일(${selected.toLocaleDateString('ko-KR', { weekday: 'short' })})`;

  const moveMonth = (direction) => {
    setVisibleMonth(new Date(year, month + direction, 1));
  };

  return (
    <section
      className={`${isLongMonth ? 'h-[448px]' : 'h-[400px]'} overflow-hidden rounded-[10px] bg-[var(--color-white)] p-5`}
    >
      <div className="flex items-end gap-[9px]">
        <h2 className="text-[20px] leading-[1.3] font-semibold">회의 일정</h2>
        <p className="body-3 text-[var(--color-gray-500)]">
          캘린더의 날짜를 눌러 일정을 체크해보세요.
        </p>
      </div>

      <div className={`mt-4 flex gap-5 ${isLongMonth ? 'h-[354px]' : 'h-[306px]'}`}>
        <div className="w-[319px] shrink-0">
          <div className="flex h-10 items-center justify-center gap-2 py-2">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="flex size-6 items-center justify-center"
            >
              <img
                src={calendarArrowIcon}
                className="h-[7.12px] w-[15.5px] -rotate-90 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(86%)_saturate(1165%)_hue-rotate(91deg)_brightness(101%)_contrast(92%)]"
              />
            </button>
            <span className="text-[16px] leading-[1.3] font-medium text-[var(--color-black)]">
              {month + 1}월 {year}
            </span>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="flex size-6 items-center justify-center"
            >
              <img
                src={calendarArrowIcon}
                className="h-[7.12px] w-[15.5px] rotate-90 [filter:brightness(0)_saturate(100%)_invert(82%)_sepia(86%)_saturate(1165%)_hue-rotate(91deg)_brightness(101%)_contrast(92%)]"
              />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 text-center text-[13px] leading-[18px] font-semibold text-[rgba(60,60,67,0.3)]">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>
          <div className="mt-[5px] grid grid-cols-7 gap-y-2">
            {calendarDays.map((day, index) => {
              const dateKey = day ? formatDateKey(year, month, day) : '';
              const isSelected = dateKey === selectedDate;
              const meetingCount = meetingCountByDate[dateKey] ?? 0;

              return (
                <button
                  key={`${dateKey}-${index}`}
                  type="button"
                  disabled={!day}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`relative mx-auto flex size-10 items-center justify-center rounded-full text-[20px] leading-[1.4] ${isSelected ? 'bg-[var(--color-action-primary)] font-medium text-white' : 'text-[var(--color-black)]'}`}
                >
                  {day}
                  {meetingCount > 0 && !isSelected && (
                    <span className="absolute top-1 left-1/2 flex -translate-x-1/2 gap-0.5">
                      <img src={scheduleDotPrimaryIcon} className="size-1" />
                      {meetingCount > 1 && (
                        <img src={scheduleDotSecondaryIcon} className="size-1" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-full w-px shrink-0 bg-[var(--color-gray-100)]" />

        <div className="min-w-0 flex-1">
          <div className="flex gap-2">
            <span className="body-3 text-[var(--color-gray-800)]">{selectedDateLabel}</span>
            <span className="body-4 text-[var(--color-gray-500)]">{selectedMeetings.length}개</span>
          </div>
          <div
            className={`mt-2 [scrollbar-width:none] overflow-y-auto px-1 py-5 pr-4 [&::-webkit-scrollbar]:hidden ${isLongMonth ? 'h-[311px]' : 'h-[263px]'}`}
          >
            {isLoading && (
              <p className="py-10 text-center text-[14px] text-[var(--color-gray-500)]">
                회의 일정을 불러오는 중입니다.
              </p>
            )}
            {!isLoading && errorMessage && (
              <p className="py-10 text-center text-[14px] text-[var(--color-gray-500)]">
                {errorMessage}
              </p>
            )}
            {!isLoading && !errorMessage && selectedMeetings.length === 0 && (
              <p className="py-10 text-center text-[14px] text-[var(--color-gray-500)]">
                선택한 날짜에 회의가 없습니다.
              </p>
            )}
            {selectedMeetings.map((meeting, index) => (
              <article
                key={meeting.id}
                className="relative flex min-h-[103px] justify-between pb-6"
              >
                {index < selectedMeetings.length - 1 && (
                  <span className="absolute top-[26px] bottom-0 left-[12px] border-l border-dashed border-[var(--color-gray-300)]" />
                )}
                <img
                  src={meeting.isOngoing ? meetingSymbolIcon : meetingSymbolSecondaryIcon}
                  className="mt-0.5 h-5 w-[25px] shrink-0"
                />
                <div className="ml-3 min-w-0 flex-1">
                  {meeting.isOngoing && (
                    <p className="caption-1 text-[#11e489]">현재 진행중이에요</p>
                  )}
                  <p className="body-3 mt-0.5 truncate">
                    <span className="mr-1">{meeting.time}</span>
                    {meeting.title}
                  </p>
                  <p className="caption-1 mt-1 text-[var(--color-gray-600)]">
                    {meeting.projectName}
                  </p>
                  <div className="mt-4 flex gap-1">
                    {meeting.teams.map((team) => (
                      <span
                        key={team}
                        className="caption-1 rounded-[4px] border border-[var(--color-gray-200)] px-1.5 py-1 text-[var(--color-gray-600)]"
                      >
                        {team}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={!meeting.canJoin}
                  onClick={() => onJoin(meeting)}
                  className="ml-3 h-11 w-[110px] shrink-0 rounded-[10px] bg-[var(--color-action-primary)] text-[16px] leading-[1.3] font-semibold disabled:bg-[var(--color-gray-100)] disabled:text-[var(--color-gray-300)]"
                >
                  참여하기
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TodoLinkIcon({ isCompleted }) {
  return (
    <span className={`relative block size-5 shrink-0 ${isCompleted ? 'opacity-30' : ''}`}>
      <span className="absolute top-[0.83px] left-[0.71px] flex size-[17.68px] items-center justify-center">
        <img src={todoLinkChainIcon} className="h-[16.67px] w-[8.33px] rotate-45" />
      </span>
      <img
        src={todoLinkLineIcon}
        className="absolute top-[8.2px] left-[7.8px] h-[1.5px] w-[6px] -rotate-45"
      />
    </span>
  );
}

function AiReplyStatus({ replies, projects, isLoading, errorMessage, onDetail, onReference }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedReplyIndex, setSelectedReplyIndex] = useState(0);
  const [isAnswerOverflowing, setIsAnswerOverflowing] = useState(false);
  const answerRef = useRef(null);
  const selectedProject = projects.find(
    (project) =>
      Number(project.projectId) === Number(selectedProjectId) && project.unreadAnswerCount > 0,
  );
  const activeProjectId =
    selectedProject?.projectId ??
    projects.find((project) => project.unreadAnswerCount > 0)?.projectId;
  const projectReplies = replies.filter(
    (reply) => Number(reply.projectId) === Number(activeProjectId),
  );
  const selectedReply = projectReplies[selectedReplyIndex];

  const moveReply = (direction) => {
    setSelectedReplyIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0) return projectReplies.length - 1;
      if (nextIndex >= projectReplies.length) return 0;

      return nextIndex;
    });
  };

  useEffect(() => {
    const answerElement = answerRef.current;

    if (!answerElement) return;

    setIsAnswerOverflowing(answerElement.scrollHeight > 240);
  }, [selectedReply]);

  useEffect(() => {
    if (selectedReplyIndex >= projectReplies.length) {
      setSelectedReplyIndex(0);
    }
  }, [projectReplies.length, selectedReplyIndex]);

  if (isLoading || errorMessage || !selectedReply) {
    return (
      <section className="flex h-full min-h-[712px] flex-col overflow-hidden rounded-[10px] bg-white px-4 pt-5">
        <div className="flex items-end gap-2">
          <h2 className="text-[20px] leading-[1.3] font-semibold text-black">AI 답변 현황</h2>
          <p className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#8E9592]">
            내가 없는 동안 쌓인 답변이에요.
          </p>
        </div>
        <p className="flex flex-1 items-center justify-center text-[14px] text-[var(--color-gray-500)]">
          {isLoading
            ? 'AI 답변을 불러오는 중입니다.'
            : errorMessage || '새로 쌓인 AI 답변이 없습니다.'}
        </p>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-[712px] flex-col overflow-hidden rounded-[10px] bg-white">
      <div className="shrink-0 px-4 pt-5">
        <div className="flex items-end gap-2">
          <h2 className="text-[20px] leading-[1.3] font-semibold text-black">AI 답변 현황</h2>
          <p className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#8E9592]">
            내가 없는 동안 쌓인 답변이에요.
          </p>
        </div>

        <div className="mt-3 flex [scrollbar-width:none] gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {projects.map((project) => {
            const count = project.unreadAnswerCount ?? 0;

            return (
              <button
                key={project.projectId}
                type="button"
                disabled={count === 0}
                onClick={() => {
                  setSelectedProjectId(project.projectId);
                  setSelectedReplyIndex(0);
                }}
                className={`flex h-[30px] shrink-0 items-center gap-2 rounded-[30px] py-1.5 pr-1.5 pl-3 text-[14px] leading-[1.3] tracking-[-0.28px] ${
                  Number(activeProjectId) === Number(project.projectId)
                    ? 'bg-[#101211] text-white'
                    : 'bg-[#F2F7F4] text-[#343836] disabled:opacity-50'
                }`}
              >
                {project.projectName}
                <span
                  className={`flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[12px] font-medium tracking-[-0.24px] ${
                    Number(activeProjectId) === Number(project.projectId)
                      ? 'bg-[#6EFFC0] text-[#101211]'
                      : 'bg-[#C5CCC9] text-white'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-8 rounded-[10px] bg-gradient-to-b from-[#FAFAFA] to-white p-5">
        <div className="flex h-6 shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={() => moveReply(-1)}
            className="flex size-6 items-center justify-center text-[30px] leading-none text-[#343836]"
          >
            <img src={chevronIcon} className="h-[7px] w-[15px] -rotate-90" />
          </button>
          <strong className="text-[16px] leading-[1.3] font-semibold text-[#343836]">
            {selectedReplyIndex + 1}/{projectReplies.length}
          </strong>
          <button
            type="button"
            onClick={() => moveReply(1)}
            className="flex size-6 items-center justify-center text-[30px] leading-none text-[#343836]"
          >
            <img src={chevronIcon} className="h-[7px] w-[15px] rotate-90" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className={`flex flex-col ${selectedReply.isMine ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2">
              <ProfileAvatar
                userId={selectedReply.questionerId}
                profileImageUrl={selectedReply.profileImageUrl}
                name={selectedReply.name}
                fallbackSrc={logoSimpleIcon}
                className="size-6 shrink-0 border border-[#D7DEDB] bg-[#E9EFED]"
              />
              <strong className="text-[16px] leading-[1.3] font-medium text-black">
                {selectedReply.name}
              </strong>
              {selectedReply.role && (
                <span className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#8E9592]">
                  {selectedReply.role}
                </span>
              )}
            </div>

            <div className="mt-[10px] w-[min(328px,calc(100%-32px))] rounded-[10px] bg-[#E9EFED] px-3 py-2">
              <p className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#101211]">
                {selectedReply.question}
              </p>
              <time className="mt-1 block text-[14px] leading-[1.3] tracking-[-0.28px] text-[#A9B0AD]">
                {selectedReply.time}
              </time>
            </div>
          </div>

          <div
            className={`mt-5 flex min-h-0 w-[84%] flex-1 flex-col ${
              selectedReply.isMine ? 'mr-auto items-start' : 'ml-auto items-end'
            }`}
          >
            <p
              className={`w-full text-[14px] leading-[1.3] tracking-[-0.28px] text-[#A9B0AD] ${
                selectedReply.isMine ? 'text-left' : 'text-right'
              }`}
            >
              {selectedReply.projectName}/{selectedReply.teamName}
            </p>
            <div className="relative mt-3 w-full">
              <p
                ref={answerRef}
                className={`text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-pre-line text-[#343836] ${
                  selectedReply.isMine ? 'text-left' : 'text-right'
                } ${isAnswerOverflowing ? 'line-clamp-[12] max-h-[240px] overflow-hidden' : ''}`}
              >
                {selectedReply.answer}
              </p>
              {isAnswerOverflowing && (
                <span className="pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-b from-transparent to-white" />
              )}
            </div>
            <p
              className={`mt-3 w-full text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-pre-line text-[#A9B0AD] ${
                selectedReply.isMine ? 'text-left' : 'text-right'
              }`}
            >
              {selectedReply.status}
            </p>

            <button
              type="button"
              onClick={() => onDetail(selectedReply)}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#E9EFED] text-[16px] leading-[1.3] font-semibold text-[#343836]"
            >
              자세히 보기
            </button>
            <button
              type="button"
              disabled={!selectedReply.referenceId}
              onClick={() => onReference(selectedReply)}
              className="mt-3 flex h-[42px] w-full items-center justify-between rounded-[10px] border border-[#8E9592] px-3 text-[14px] leading-[1.4] tracking-[-0.21px] text-[#343836] disabled:opacity-50"
            >
              <span>
                <strong className="mr-2 font-medium">참고 회의록</strong>
                {selectedReply.reference}
              </span>
              <img src={chevronIcon} className="h-[7px] w-[15px] -rotate-90 opacity-40" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const INITIAL_ACTION_ITEM_FORM = {
  content: '',
  assigneeUserId: '',
  dueDate: '',
  status: 'PENDING',
};

function TodoList({ description, meetings, onOpenMeetingRecord }) {
  const [todoItems, setTodoItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editingForm, setEditingForm] = useState(INITIAL_ACTION_ITEM_FORM);
  const [editingMembers, setEditingMembers] = useState([]);
  const [isEditingMembersLoading, setIsEditingMembersLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    const loadActionItems = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const actionItems = await getMyActionItems();

        if (isCurrentRequest) {
          setTodoItems(actionItems);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setTodoItems([]);
          setErrorMessage(getApiErrorMessage(error, '할 일 목록을 불러오지 못했습니다.'));
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadActionItems();

    return () => {
      isCurrentRequest = false;
    };
  }, []);

  const toggleTodo = async (actionItem) => {
    const nextStatus = actionItem.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    try {
      setUpdatingItemId(actionItem.actionItemId);
      setErrorMessage('');
      setTodoItems((currentItems) =>
        currentItems.map((item) =>
          item.actionItemId === actionItem.actionItemId ? { ...item, status: nextStatus } : item,
        ),
      );

      await updateActionItem(actionItem.actionItemId, {
        content: actionItem.content,
        assigneeUserId: actionItem.assigneeUserId,
        dueDate: actionItem.dueDate,
        status: nextStatus,
      });
    } catch (error) {
      setTodoItems((currentItems) =>
        currentItems.map((item) =>
          item.actionItemId === actionItem.actionItemId
            ? { ...item, status: actionItem.status }
            : item,
        ),
      );
      setErrorMessage(getApiErrorMessage(error, '할 일 상태를 변경하지 못했습니다.'));
    } finally {
      setUpdatingItemId(null);
    }
  };

  const openEditModal = async (actionItem) => {
    setEditingItem(actionItem);
    setEditingForm({
      content: actionItem.content ?? '',
      assigneeUserId: actionItem.assigneeUserId ? String(actionItem.assigneeUserId) : '',
      dueDate: actionItem.dueDate ?? '',
      status: actionItem.status ?? 'PENDING',
    });
    setEditingMembers([]);
    setErrorMessage('');

    const matchingMeeting = meetings.find(
      (meeting) => String(meeting.meetingId) === String(actionItem.meetingId),
    );
    const teamId = matchingMeeting?.rawMeeting?.teamId;

    if (!teamId) return;

    try {
      setIsEditingMembersLoading(true);
      const members = await getTeamMembers(teamId);
      setEditingMembers(members);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '담당자 목록을 불러오지 못했습니다.'));
    } finally {
      setIsEditingMembersLoading(false);
    }
  };

  const closeEditModal = () => {
    if (updatingItemId) return;

    setEditingItem(null);
    setEditingForm(INITIAL_ACTION_ITEM_FORM);
    setEditingMembers([]);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditingForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
    setErrorMessage('');
  };

  const handleUpdateTodo = async () => {
    const content = editingForm.content.trim();

    if (!editingItem || !content) {
      setErrorMessage('할 일 내용을 입력해주세요.');
      return;
    }

    try {
      setUpdatingItemId(editingItem.actionItemId);
      setErrorMessage('');
      await updateActionItem(editingItem.actionItemId, {
        content,
        assigneeUserId: editingForm.assigneeUserId ? Number(editingForm.assigneeUserId) : null,
        dueDate: editingForm.dueDate || null,
        status: editingForm.status,
      });
      setTodoItems((currentItems) =>
        currentItems.map((item) =>
          item.actionItemId === editingItem.actionItemId
            ? {
                ...item,
                content,
                assigneeUserId: editingForm.assigneeUserId
                  ? Number(editingForm.assigneeUserId)
                  : null,
                dueDate: editingForm.dueDate || null,
                status: editingForm.status,
              }
            : item,
        ),
      );
      setEditingItem(null);
      setEditingForm(INITIAL_ACTION_ITEM_FORM);
      setEditingMembers([]);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '할 일을 수정하지 못했습니다.'));
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDeleteTodo = async (actionItem) => {
    if (!window.confirm('이 할 일을 삭제할까요?')) return;

    try {
      setDeletingItemId(actionItem.actionItemId);
      setErrorMessage('');
      await deleteActionItem(actionItem.actionItemId);
      setTodoItems((currentItems) =>
        currentItems.filter((item) => item.actionItemId !== actionItem.actionItemId),
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '할 일을 삭제하지 못했습니다.'));
    } finally {
      setDeletingItemId(null);
    }
  };

  const visibleItems = todoItems.slice(0, 10);

  return (
    <section className="flex h-[311px] min-h-0 flex-col gap-5 overflow-hidden rounded-[10px] bg-white p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-2">
          <h2 className="text-[20px] leading-[1.3] font-semibold text-black">To-do list</h2>
          <p className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#8E9592]">
            {description}
          </p>
        </div>

      </div>

      <div className="relative grid h-[184px] grid-flow-col grid-cols-2 grid-rows-5 gap-x-[60px] gap-y-4">
        {isLoading && (
          <p className="absolute inset-0 flex items-center justify-center text-[14px] text-[#8E9592]">
            할 일 목록을 불러오는 중입니다.
          </p>
        )}
        {!isLoading && errorMessage && todoItems.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-[14px] text-[#8E9592]">
            {errorMessage}
          </p>
        )}
        {!isLoading && !errorMessage && todoItems.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-[14px] text-[#8E9592]">
            등록된 할 일이 없습니다.
          </p>
        )}
        {!isLoading &&
          visibleItems.map((item) => {
            const isCompleted = item.status === 'COMPLETED';
            const matchingMeeting = meetings.find(
              (meeting) => String(meeting.meetingId) === String(item.meetingId),
            );

            return (
              <div key={item.actionItemId} className="flex h-6 min-w-0 items-center gap-2">
                <button
                  type="button"
                  disabled={updatingItemId === item.actionItemId}
                  onClick={() => toggleTodo(item)}
                  className={`relative size-6 shrink-0 rounded-[5px] ${
                    isCompleted ? 'bg-[#11E489]' : 'border-[1.5px] border-[#2B3F6C] bg-white'
                  } disabled:opacity-60`}
                >
                  {isCompleted && (
                    <span className="absolute top-[3px] left-[7px] h-[11px] w-[7px] rotate-45 border-r-2 border-b-2 border-white" />
                  )}
                </button>
                <div className="flex min-w-0 flex-1 items-center gap-1">
                  <span
                    className={`truncate text-[14px] leading-[1.4] tracking-[-0.21px] ${
                      isCompleted ? 'text-[#A9B0AD] line-through' : 'text-[#343836]'
                    }`}
                  >
                    {item.content}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenMeetingRecord(item, matchingMeeting)}
                    className="shrink-0"
                  >
                    <TodoLinkIcon isCompleted={isCompleted} />
                  </button>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-1 text-[#707673]">
                  <button type="button" onClick={() => openEditModal(item)} className="size-5">
                    <EditIcon />
                  </button>
                  <button
                    type="button"
                    disabled={deletingItemId === item.actionItemId}
                    onClick={() => handleDeleteTodo(item)}
                    className="size-5 disabled:opacity-40"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        {errorMessage && todoItems.length > 0 && (
          <p className="absolute right-0 bottom-[-18px] text-[12px] text-[var(--color-red)]">
            {errorMessage}
          </p>
        )}
      </div>

      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEditModal();
          }}
        >
          <div className="w-[440px] rounded-[16px] bg-white p-5 shadow-xl">
            <h3 className="mb-4 text-[20px] leading-[1.3] font-semibold text-black">할 일 수정</h3>
            {isEditingMembersLoading && (
              <p className="mb-3 text-[12px] text-[var(--color-gray-500)]">
                담당자 목록을 불러오는 중입니다.
              </p>
            )}
            {errorMessage && (
              <p className="mb-3 text-[12px] text-[var(--color-red)]">{errorMessage}</p>
            )}
            <ActionItemForm
              form={editingForm}
              members={editingMembers}
              isSubmitting={Boolean(updatingItemId)}
              submitLabel="저장"
              showStatus
              onChange={handleEditChange}
              onSubmit={handleUpdateTodo}
              onCancel={closeEditModal}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function HomeDashboard() {
  const navigate = useNavigate();
  const { hero, todoList } = homePageMockData;
  const [projects, setProjects] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [isMeetingsLoading, setIsMeetingsLoading] = useState(true);
  const [meetingErrorMessage, setMeetingErrorMessage] = useState('');
  const [aiReplies, setAiReplies] = useState([]);
  const [isAiRepliesLoading, setIsAiRepliesLoading] = useState(true);
  const [aiRepliesErrorMessage, setAiRepliesErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    const loadProjects = async () => {
      try {
        setIsMeetingsLoading(true);
        setIsAiRepliesLoading(true);
        setMeetingErrorMessage('');
        setAiRepliesErrorMessage('');

        const [answerProjects, myTeams] = await Promise.all([
          getUnreadAnswerCountsByProject(),
          getMyTeams(),
        ]);

        const [meetingResults, answerCardResults] = await Promise.all([
          Promise.allSettled(myTeams.map((team) => getMeetings(team.teamId))),
          Promise.allSettled(
            answerProjects.map((project) => getUnreadAnswerCards(project.projectId)),
          ),
        ]);
        const nextMeetings = meetingResults
          .flatMap((result, index) => {
            if (result.status !== 'fulfilled') return [];

            return result.value
              .map((meeting) => formatMeetingScheduleItem(meeting, myTeams[index]))
              .filter(Boolean);
          })
          .sort((firstMeeting, secondMeeting) =>
            `${firstMeeting.date}T${firstMeeting.time}`.localeCompare(
              `${secondMeeting.date}T${secondMeeting.time}`,
            ),
          );
        const nextAiReplies = answerCardResults
          .flatMap((result) =>
            result.status === 'fulfilled' ? normalizeUnreadAnswerCards(result.value) : [],
          )
          .sort(
            (firstReply, secondReply) =>
              new Date(secondReply.answeredAt).getTime() -
              new Date(firstReply.answeredAt).getTime(),
          );

        if (isCurrentRequest) {
          setProjects(answerProjects);
          setMeetings(nextMeetings);
          setAiReplies(nextAiReplies);

          if (
            answerCardResults.length > 0 &&
            answerCardResults.every((result) => result.status === 'rejected')
          ) {
            setAiRepliesErrorMessage('AI 답변을 불러오지 못했습니다.');
          }
        }
      } catch (error) {
        console.error('Failed to load home projects:', error);

        if (isCurrentRequest) {
          setProjects([]);
          setMeetings([]);
          setAiReplies([]);
          setMeetingErrorMessage(getApiErrorMessage(error, '회의 일정을 불러오지 못했습니다.'));
          setAiRepliesErrorMessage(getApiErrorMessage(error, 'AI 답변을 불러오지 못했습니다.'));
        }
      } finally {
        if (isCurrentRequest) {
          setIsMeetingsLoading(false);
          setIsAiRepliesLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      isCurrentRequest = false;
    };
  }, []);

  const today = new Date();
  const initialMeetingDate = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const handleJoinMeeting = (meeting) => {
    navigate(`/meetings/${meeting.meetingId}/room`, {
      state: {
        meeting: meeting.rawMeeting,
      },
    });
  };

  const handleOpenMeetingRecord = (actionItem, meeting) => {
    if (!actionItem.meetingId) return;

    navigate(`/meetings/${actionItem.meetingId}/record`, {
      state: { teamName: meeting?.teams[0] },
    });
  };

  const handleOpenQaDetail = (reply) => {
    navigate('/qa', { state: { questionId: reply.questionId, teamId: reply.teamId } });
  };

  const handleOpenReference = (reply) => {
    if (!reply.referenceId) return;

    const meetingId = reply.referenceNavigation?.meetingId ?? reply.referenceId;
    const teamId = reply.referenceNavigation?.teamId ?? reply.teamId;

    navigate(`/projects/${reply.projectId}/teams/${teamId}/meetings/${meetingId}`, {
      state: { teamName: reply.teamName },
    });
  };

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto flex min-h-full w-full max-w-[1346px] flex-col gap-5">
        <section className="h-[183px] shrink-0 rounded-[10px] bg-[linear-gradient(180deg,#2affa3_0%,#37efd9_100%)] px-6 py-5 text-[var(--color-black)]">
          <img src={logo} alt="Noddi" className="h-auto w-[190px] brightness-0" />
          <p className="subhead-3 mt-2">{hero.tagline}</p>
        </section>

        <div className="grid min-h-[400px] flex-1 grid-cols-[minmax(0,818px)_minmax(370px,1fr)] gap-4">
          <div className="grid grid-rows-[auto_1fr] gap-3">
            <MeetingSchedule
              initialDate={initialMeetingDate}
              meetings={meetings}
              isLoading={isMeetingsLoading}
              errorMessage={meetingErrorMessage}
              onJoin={handleJoinMeeting}
            />
            <TodoList
              {...todoList}
              meetings={meetings}
              onOpenMeetingRecord={handleOpenMeetingRecord}
            />
          </div>
          <AiReplyStatus
            replies={aiReplies}
            projects={projects}
            isLoading={isAiRepliesLoading}
            errorMessage={aiRepliesErrorMessage}
            onDetail={handleOpenQaDetail}
            onReference={handleOpenReference}
          />
        </div>
      </div>
    </div>
  );
}

export default HomeDashboard;
