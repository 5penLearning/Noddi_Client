import api from './axios';

export const getProjects = async () => {
  const response = await api.get('/api/v1/projects');

  return response.data.result ?? [];
};
