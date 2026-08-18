import api from './axios';

export const getOrganizations = async () => {
  const response = await api.get(
    '/api/v1/organizations',
    {
      skipAuth: true,
    },
  );

  return response.data;
};
