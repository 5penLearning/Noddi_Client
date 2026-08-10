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

export const projectTeamMockData = {
  id: 'marketing-team',
  name: '마케팅 팀',
  members: myTeamMockData.members,
  status: '현재 진행 상황',
};

export const projectPageMockData = {
  projects: [2, 1, 3, 1, 2, 4].map((myTeamCount, index) => ({
    id: `project-${index + 1}`,
    name: '노디 프로젝트',
    myTeamCount,
  })),
  dayCount: 54,
  description:
    '노디 프로젝트는 프로젝트 안의 여러 팀이 남긴 회의 내용을 AI가 기억하고, 이를 바탕으로 팀 간 질문과 답변을 가능하게 하는 서비스입니다.',
  notices: [
    {
      id: 'notice-1',
      teamName: '마케팅팀',
      title: '오늘 회의 일정',
      content:
        '내일 모레까지 매거진에 제출할 렌더 및 포스터 촬영 사진을 마케팅팀에 전달해주시길 바랍니다.',
    },
    {
      id: 'notice-2',
      teamName: '개발팀',
      title: '오늘 회의 일정',
      content:
        '내일 모레까지 매거진에 제출할 렌더 및 포스터 촬영 사진을 마케팅팀에 전달해주시길 바랍니다.',
    },
    {
      id: 'notice-3',
      teamName: '디자인팀',
      title: '오늘 회의 일정',
      content:
        '내일 모레까지 매거진에 제출할 렌더 및 포스터 촬영 사진을 마케팅팀에 전달해주시길 바랍니다.',
    },
  ],
  myTeams: Array.from({ length: 4 }, (_, index) => ({
    ...myTeamMockData,
    id: `marketing-team-${index + 1}`,
  })),
  teamCount: 8,
  teams: Array.from({ length: 3 }, (_, index) => ({
    ...projectTeamMockData,
    id: `project-team-${index + 1}`,
  })),
};
