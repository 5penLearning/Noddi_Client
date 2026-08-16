import api from './axios';

export const getMeetingSummary = async (meetingId) => {
  const { data } = await api.get(
    `/api/v1/meetings/${meetingId}/summary`,
  );

  return data;
};

export const updateMeetingSummary = async (
  meetingId,
  {
    summary,
    decisions,
    issues,
  },
) => {
  const { data } = await api.patch(
    `/api/v1/meetings/${meetingId}/summary`,
    {
      summary,
      decisions,
      issues,
    },
  );

  return data;
};

export const retryMeetingSummary = async (meetingId) => {
  const { data } = await api.post(
    `/api/v1/meetings/${meetingId}/summary/retry`,
  );

  return data;
};
