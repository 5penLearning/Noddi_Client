import api from './axios';

export const getMyTeams = async () => {
  const { data } = await api.get(
    '/api/v1/users/me/teams',
  );

  return data;
};
