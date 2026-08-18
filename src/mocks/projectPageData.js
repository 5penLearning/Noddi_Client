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

export const projectCreateTeamMockData = {
  id: 'marketing-team',
  name: '마케팅팀',
  leader: {
    id: 'leader-1',
    name: '홍길동',
    position: '디자인팀 과장',
  },
};

export const projectCreateTeamsMockData = Array.from({ length: 5 }, (_, index) => ({
  ...projectCreateTeamMockData,
  id: `project-create-team-${index + 1}`,
  leader: index === 0 || index === 3 ? projectCreateTeamMockData.leader : null,
}));

export const projectMemberModalMockData = {
  projectName: '노디 프로젝트',
  totalCount: 36,
  selectedMembers: [
    { id: 'selected-member-1', name: '김유진' },
    { id: 'selected-member-2', name: '김유진' },
  ],
  members: Array.from({ length: 5 }, (_, index) => ({
    id: `project-member-${index + 1}`,
    name: '홍길동',
    position: '디자인팀 과장',
  })),
};

export const meetingRecordMockData = [
  {
    id: 'meeting-record-1',
    title: '2026년 10월 03일 - 매거진 확정 회의',
    createdDate: '2026. 10. 03',
    createdTime: '10:05',
    date: '2026-10-03',
    teams: ['마케팅팀', '제품팀'],
    summary: '내용 한 줄 정리',
  },
  {
    id: 'meeting-record-2',
    title: '2026년 10월 04일 - 디자인 검토 회의',
    createdDate: '2026. 10. 04',
    createdTime: '14:30',
    date: '2026-10-04',
    teams: ['마케팅팀', '개발팀'],
    summary: '디자인 피드백 정리',
  },
  {
    id: 'meeting-record-3',
    title: '2026년 10월 05일 - 사용자 조사 결과 발표',
    createdDate: '2026. 10. 05',
    createdTime: '11:00',
    date: '2026-10-05',
    teams: ['마케팅팀'],
    summary: '조사 결과 요약',
  },
];

export const sharedMemoMockData = [
  {
    id: 'shared-memo-1',
    title: '세금 계산서 해야해요..',
    subtitle: '노디프로젝트 발주 넣은 거',
    description: '이런거 이런거 추가해주세요...',
    content: '노션에 있는 거 오키오키,, 확인..\n\n알잘딱?\n\n/',
  },
  {
    id: 'shared-memo-2',
    title: '랜딩페이지 수정 내용',
    subtitle: '메인 카피 최종 확인',
    description: '회의에서 정리한 수정 사항을 반영해주세요.',
    content: '디자인 수정본 링크 확인\n\n모바일 시안도 함께 검토하기',
  },
];

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
