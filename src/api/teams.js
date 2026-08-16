import api from './axios';

const normalizeProjectTeam = (team) => ({
  id: team.teamId,
  name: team.name,
  status:
    team.description || (team.creatorName ? `${team.creatorName}님이 만든 팀` : '현재 진행 상황'),
  creatorName: team.creatorName,
  members: [],
});

const normalizeMyTeam = (team) => ({
  id: team.teamId,
  teamId: team.teamId,
  name: team.name,
  description: team.description,
  myRole: team.myRole,
  members: [],
  todayMeeting: null,
  todoCount: 0,
  todos: [],
});

export const getProjectTeams = async (projectId) => {
  const response = await api.get(`/api/v1/projects/${projectId}/teams`);

  return (response.data.result ?? []).map(normalizeProjectTeam);
};

export const getMyTeams = async () => {
  const response = await api.get('/api/v1/users/me/teams');

  return (response.data.result ?? []).map(normalizeMyTeam);
};

export const createTeam = async (projectId, { name, description }) => {
  const response = await api.post(`/api/v1/projects/${projectId}/teams`, {
    name,
    description,
  });

  return response.data.result;
};

export const updateTeam = async (teamId, { name, description }) => {
  const response = await api.patch(`/api/v1/teams/${teamId}`, {
    name,
    description,
  });

  return response.data.result;
};

export const deleteTeam = async (teamId) => {
  const response = await api.delete(`/api/v1/teams/${teamId}`);

  return response.data.result;
};

export const getProjectMembers = async (projectId) => {
  const response = await api.get(`/api/v1/projects/${projectId}/members`);

  return response.data.result ?? [];
};

export const getTeamMembers = async (teamId) => {
  const response = await api.get(`/api/v1/teams/${teamId}/members`);

  return response.data.result ?? [];
};

export const inviteTeamMember = async (teamId, targetUserId) => {
  const response = await api.post(`/api/v1/teams/${teamId}/members/invite`, {
    targetUserId,
  });

  return response.data.result;
};

export const updateTeamMemberRole = async (teamId, targetUserId, role) => {
  const response = await api.patch(`/api/v1/teams/${teamId}/members/${targetUserId}/role`, {
    role,
  });

  return response.data.result;
};

export const removeTeamMember = async (teamId, targetUserId) => {
  const response = await api.delete(`/api/v1/teams/${teamId}/members/${targetUserId}`);

  return response.data.result;
};
