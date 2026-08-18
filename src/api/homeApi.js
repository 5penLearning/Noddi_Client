import api from './axios';

export const getUnreadAnswerCountsByProject = async () => {
  const { data } = await api.get('/api/v1/home/ai-answers/projects');

  return data.result ?? [];
};

export const getUnreadAnswerCards = async (projectId, { page = 0, size = 10 } = {}) => {
  const { data } = await api.get(`/api/v1/home/ai-answers/projects/${projectId}`, {
    params: {
      page,
      size,
    },
  });

  return data.result ?? { items: [] };
};
