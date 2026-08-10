import defaultTeamAvatar from '../assets/icons/my-team-avatar.svg';

export const myTeamMockData = {
  id: 'marketing-team',
  name: '마케팅 팀',
  members: Array.from({ length: 8 }, (_, index) => ({
    id: `member-${index + 1}`,
    name: `팀원 ${index + 1}`,
    avatarUrl: defaultTeamAvatar,
  })),
  todayMeeting: null,
  todoCount: 3,
  todos: Array.from({ length: 4 }, (_, index) => ({
    id: `todo-${index + 1}`,
    title: '세금 계산서 처리하기',
    dueDate: '08/23 까지',
    completed: false,
  })),
};
