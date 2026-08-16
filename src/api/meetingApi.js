import api from './axios';

export const getMeetings = async (teamId) => {
  const { data } = await api.get('/api/v1/meetings', {
    params: {
      teamId,
    },
  });

  return data.result ?? [];
};

export const createMeeting = async ({
  teamId,
  title,
  agenda,
  scheduledStartAt,
  scheduledEndAt,
}) => {
  const { data } = await api.post('/api/v1/meetings', {
    teamId,
    title,
    agenda,
    scheduledStartAt,
    scheduledEndAt,
  });

  return data;
};

export const getMeeting = async (meetingId) => {
  const { data } = await api.get(`/api/v1/meetings/${meetingId}`);

  return data;
};

export const startMeeting = async (meetingId) => {
  const { data } = await api.patch(`/api/v1/meetings/${meetingId}/start`);

  return data;
};

export const endMeeting = async (meetingId) => {
  const { data } = await api.patch(`/api/v1/meetings/${meetingId}/end`);

  return data;
};

export const getMeetingParticipants = async (meetingId) => {
  const { data } = await api.get(`/api/v1/meetings/${meetingId}/participants`);

  return data;
};

export const getMeetingRecordingUrl = async (meetingId) => {
  const { data } = await api.get(`/api/v1/meetings/${meetingId}/recording-url`);

  return data;
};
