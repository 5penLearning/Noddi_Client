import api from './axios';

export const getTeamPages = async (teamId, { page = 0, size = 20, sort } = {}) => {
  const { data } = await api.get(`/api/v1/teams/${teamId}/pages`, {
    params: {
      page,
      size,
      ...(sort ? { sort } : {}),
    },
  });

  return data.result ?? { content: [] };
};

export const createTeamPage = async (teamId, { title, content }) => {
  const { data } = await api.post(`/api/v1/teams/${teamId}/pages`, {
    title,
    content,
  });

  return data.result ?? data;
};

export const getTeamPage = async (teamId, pageId) => {
  const { data } = await api.get(`/api/v1/teams/${teamId}/pages/${pageId}`);

  return data.result ?? data;
};

export const updateTeamPage = async (teamId, pageId, { title, content }) => {
  const { data } = await api.patch(`/api/v1/teams/${teamId}/pages/${pageId}`, {
    title,
    content,
  });

  return data.result ?? data;
};

export const deleteTeamPage = async (teamId, pageId) => {
  const { data } = await api.delete(`/api/v1/teams/${teamId}/pages/${pageId}`);

  return data.result ?? data;
};
