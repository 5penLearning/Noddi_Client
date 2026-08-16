import api from './axios';

export const getProjects = async () => {
  const response = await api.get('/api/v1/projects');

  return response.data.result ?? [];
};

export const getProjectMembers = async (projectId) => {
  const response = await api.get(`/api/v1/projects/${projectId}/members`);

  return response.data.result ?? [];
};

export const getMemberProjects = async (userId) => {
  if (!userId) return [];

  const projects = await getProjects();
  const memberResults = await Promise.allSettled(
    projects.map((project) => getProjectMembers(project.projectId)),
  );

  return projects.filter((project, index) => {
    const memberResult = memberResults[index];

    if (memberResult.status !== 'fulfilled') return false;

    return memberResult.value.some((member) => Number(member.userId) === Number(userId));
  });
};

export const createProject = async ({ name, description }) => {
  const response = await api.post('/api/v1/projects', {
    name,
    description,
  });

  return response.data.result;
};
