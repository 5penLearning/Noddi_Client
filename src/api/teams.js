import api from './axios';

const normalizeProjectTeam = (team) => ({
  id: team.teamId,
  name: team.name,
  status:
    team.description || (team.creatorName ? `${team.creatorName}님이 만든 팀` : '현재 진행 상황'),
  creatorName: team.creatorName,
  members: [],
});

export const getProjectTeams = async (projectId) => {
  const response = await api.get(`/api/v1/projects/${projectId}/teams`);

  return (response.data.result ?? []).map(normalizeProjectTeam);
};
