import api from './axios';

const normalizeTeamPage = (teamPage) => ({
  ...teamPage,
  createdAt:
    teamPage.createdAt ?? teamPage.createdDate ?? teamPage.createdTime ?? teamPage.created_at,
  updatedAt:
    teamPage.updatedAt ?? teamPage.updatedDate ?? teamPage.modifiedAt ?? teamPage.updated_at,
});

export const getTeamPages = async (teamId, { page = 0, size = 20, sort } = {}) => {
  const { data } = await api.get(`/api/v1/teams/${teamId}/pages`, {
    params: {
      page,
      size,
      ...(sort ? { sort } : {}),
    },
  });

  const result = data.result ?? { content: [] };

  return {
    ...result,
    content: (result.content ?? result.items ?? []).map(normalizeTeamPage),
  };
};

export const createTeamPage = async (teamId, { title, content }) => {
  const { data } = await api.post(`/api/v1/teams/${teamId}/pages`, {
    title,
    content,
  });

  return data.result ? normalizeTeamPage(data.result) : data.result;
};

export const getTeamPage = async (teamId, pageId) => {
  const { data } = await api.get(`/api/v1/teams/${teamId}/pages/${pageId}`);

  return data.result ? normalizeTeamPage(data.result) : data.result;
};

export const updateTeamPage = async (teamId, pageId, { title, content }) => {
  const { data } = await api.patch(`/api/v1/teams/${teamId}/pages/${pageId}`, {
    title,
    content,
  });

  return data.result;
};

export const deleteTeamPage = async (teamId, pageId) => {
  const { data } = await api.delete(`/api/v1/teams/${teamId}/pages/${pageId}`);

  return data.result;
};
