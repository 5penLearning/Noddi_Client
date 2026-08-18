import api from './axios';

export const createActionItem = async (meetingId, { content, assigneeUserId, dueDate }) => {
  const { data } = await api.post(`/api/v1/meetings/${meetingId}/action-items`, {
    content,
    assigneeUserId: assigneeUserId || null,
    dueDate: dueDate || null,
  });

  return data;
};

export const updateActionItem = async (
  actionItemId,
  { content, assigneeUserId, dueDate, status },
) => {
  const { data } = await api.patch(`/api/v1/action-items/${actionItemId}`, {
    content,
    assigneeUserId: assigneeUserId || null,
    dueDate: dueDate || null,
    status,
  });

  return data;
};

export const deleteActionItem = async (actionItemId) => {
  const { data } = await api.delete(`/api/v1/action-items/${actionItemId}`);

  return data;
};

export const getMyActionItems = async () => {
  const { data } = await api.get('/api/v1/action-items/me');

  return data.result ?? [];
};

export const getMyActionItemsByTeam = async () => {
  const { data } = await api.get('/api/v1/action-items/me/by-team');

  return data.result ?? [];
};
