export const homePageMockData = {
  hero: {
    tagline: 'We weave teams into one context',
  },
  meetingSchedule: {
    calendarLabel: '캘린더',
    meetings: Array.from({ length: 5 }, (_, index) => ({
      id: `meeting-${index + 1}`,
      title: '18시 전체 회의',
      time: '18시 전체 회의',
    })),
  },
  aiReplies: [
    {
      id: 'reply-1',
      name: '홍길동',
      role: '디자인팀 과장',
      time: '08. 08 21:09',
      question: '어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구?',
      answer: '어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구...',
    },
    {
      id: 'reply-2',
      name: '홍길동',
      role: '디자인팀 과장',
      time: '08. 08 21:09',
      question: '어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구?',
      answer: '어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구 어쩌구 저쩌구...',
    },
  ],
  todoList: {
    description: 'AI가 저번 회의록을 기반으로 만들었어요',
    items: Array.from({ length: 10 }, (_, index) => ({
      id: `todo-${index + 1}`,
      title: '세금 계산서 처리하기',
      completed: false,
    })),
  },
};
