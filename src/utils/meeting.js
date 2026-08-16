export function getMeetingStatus(meeting, now = new Date()) {
  const startDateTime = new Date(
    `${meeting.date}T${meeting.startTime}:00`,
  );

  const endDateTime = new Date(
    `${meeting.date}T${meeting.endTime}:00`,
  );

  if (now < startDateTime) {
    return 'SCHEDULED';
  }

  if (now >= startDateTime && now < endDateTime) {
    return 'IN_PROGRESS';
  }

  return 'ENDED';
}

export function formatMeetingTime(time) {
  const [hour, minute] = time.split(':');

  if (minute === '00') {
    return `${Number(hour)}시`;
  }

  return `${Number(hour)}:${minute}`;
}
