import api from './axios';

export const getNotifications = async ({ filter = 'ALL', page = 0, size = 20 } = {}) => {
  const { data } = await api.get('/api/v1/notifications', {
    params: {
      filter,
      page,
      size,
    },
  });

  return data.result ?? { items: [], unreadCount: 0 };
};

export const readNotification = async (notificationId) => {
  const { data } = await api.patch(`/api/v1/notifications/${notificationId}/read`);

  return data.result;
};

export const hideNotification = async (notificationId) => {
  const { data } = await api.patch(`/api/v1/notifications/${notificationId}/hide`);

  return data.result;
};

export const readNotificationGroup = async ({ projectId, teamId, type }) => {
  const { data } = await api.patch('/api/v1/notifications/groups/read', {
    projectId,
    teamId,
    type,
  });

  return data.result;
};

export const hideNotificationGroup = async ({ projectId, teamId, type, read }) => {
  const { data } = await api.patch('/api/v1/notifications/groups/hide', {
    projectId,
    teamId,
    type,
    read,
  });

  return data.result;
};
