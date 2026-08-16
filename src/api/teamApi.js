import api from './axios';

export const getMyTeams = async () => {
  const { data } = await api.get(
    '/api/v1/users/me/teams',
  );

  return data;
};

export const getTeamMembers = async (
  teamId,
) => {
  const { data } = await api.get(
    `/api/v1/teams/${teamId}/members`,
  );

  return data;
};
