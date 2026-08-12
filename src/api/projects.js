import api from './axios';

export const getProjects = async () => {
  const response = await api.get('/api/v1/projects');

  return response.data.result ?? [];
};

export const createProject = async ({ name, description }) => {
  const response = await api.post('/api/v1/projects', {
    name,
    description,
  });

  return response.data.result;
};
