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

  return projects.flatMap((project, index) => {
    const memberResult = memberResults[index];

    if (memberResult.status !== 'fulfilled') return [];

    const currentMember = memberResult.value.find(
      (member) => Number(member.userId) === Number(userId),
    );

    return currentMember
      ? [
          {
            ...project,
            myRole: currentMember.role,
          },
        ]
      : [];
  });
};

export const getInvitableOrganizationMembers = async (
  projectId,
  { keyword = '', page = 0, size = 20 } = {},
) => {
  const response = await api.get(`/api/v1/projects/${projectId}/invitable-organization-members`, {
    params: {
      keyword: keyword || undefined,
      page,
      size,
    },
  });
  const result = response.data.result ?? {};

  return {
    members: result.content ?? [],
    totalElements: result.totalElements ?? 0,
    totalPages: result.totalPages ?? 0,
    page: result.number ?? page,
    isFirst: result.first ?? page === 0,
    isLast: result.last ?? true,
  };
};

export const inviteProjectMember = async (projectId, targetUserId) => {
  const response = await api.post(`/api/v1/projects/${projectId}/members/invite`, {
    targetUserId,
  });

  return response.data.result;
};

export const updateProjectMemberRole = async (projectId, targetUserId, newRole) => {
  const response = await api.patch(`/api/v1/projects/${projectId}/members/${targetUserId}/role`, {
    newRole,
  });

  return response.data.result;
};

export const removeProjectMember = async (projectId, targetUserId) => {
  const response = await api.delete(`/api/v1/projects/${projectId}/members/${targetUserId}`);

  return response.data.result;
};

export const createProject = async ({ name, description }) => {
  const response = await api.post('/api/v1/projects', {
    name,
    description,
  });

  return response.data.result;
};
