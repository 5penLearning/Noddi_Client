const TYPE_LABELS = {
  QA_ANSWERED: 'AI 답변',
  QA_AI_REVIEW_REQUIRED: 'AI 답변 검토',
  PROJECT_INVITATION: '프로젝트 초대',
  TEAM_INVITATION: '팀 초대',
  MEETING_STARTED: '회의 알림',
  MEETING_SUMMARY_COMPLETED: 'AI 회의록',
};

const formatOccurredAt = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

export const normalizeNotification = (notification) => ({
  ...notification,
  id: notification.grouped
    ? `group-${notification.groupKey}-${notification.read}`
    : `notification-${notification.notificationId}`,
  scope: TYPE_LABELS[notification.type] ?? '알림',
  title: notification.message,
  detail:
    notification.grouped && notification.count > 1
      ? `${notification.count}개의 알림이 모여 있어요.`
      : '',
  createdAt: formatOccurredAt(notification.occurredAt),
});

export const getNotificationGroupPayload = (notification) => ({
  projectId: notification.navigation?.projectId,
  teamId: notification.navigation?.teamId,
  type: notification.type,
});
