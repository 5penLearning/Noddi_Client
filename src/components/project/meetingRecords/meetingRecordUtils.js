export const formatMeetingDateTime = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return '-';

  const dateText = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(date);
  const timeText = new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return `${dateText} ${timeText}`;
};

export const formatMeetingDuration = (startValue, endValue) => {
  const startDate = new Date(startValue);
  const endDate = new Date(endValue);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return '-';

  const totalSeconds = Math.max(0, Math.floor((endDate.getTime() - startDate.getTime()) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours ? `${hours}시간 ` : ''}${minutes}분 ${seconds}초`;
};

export const getRecordingUrlFromResponse = (response) => {
  const result = response?.result ?? response;
  const url = result?.recordingUrl ?? result?.url ?? result;

  return typeof url === 'string' ? url : '';
};

export const formatMeetingDate = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const weekday = new Intl.DateTimeFormat('ko-KR', { weekday: 'short' })
    .format(date)
    .replace('요일', '');

  return {
    date: `${year}-${month}-${day}`,
    displayDate: `${year}. ${month}. ${day}`,
    displayTime: `${hours}:${minutes}`,
    titleDate: `${year}년 ${month}월 ${day}일 (${weekday})`,
  };
};

export const formatMeetingRecord = (meeting, teamName) => {
  const meetingDate = formatMeetingDate(
    meeting.scheduledStartAt ?? meeting.startedAt ?? meeting.createdAt,
  );

  return {
    ...meeting,
    id: meeting.meetingId,
    date: meetingDate?.date ?? '',
    meetingDate: meetingDate?.titleDate ?? '-',
    title: meeting.title,
    createdDate: meetingDate?.displayDate ?? '-',
    createdTime: meetingDate?.displayTime ?? '-',
    teams: teamName ? [teamName] : [],
    summary: meeting.agenda || '등록된 회의 안건이 없습니다.',
  };
};
