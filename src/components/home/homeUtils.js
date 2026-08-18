import { getUserId } from '../../api/axios';

export const formatDateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const formatMeetingScheduleItem = (meeting, team) => {
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

export const normalizeUnreadAnswerCards = (cards) =>
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
