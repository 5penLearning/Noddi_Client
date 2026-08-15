import api from './axios';

export const getMyProfile = async () => {
  const { data } = await api.get(
    '/api/v1/users/me',
  );

  return data;
};

export const updateMyProfile = async (
  name,
) => {
  const { data } = await api.patch(
    '/api/v1/users/me',
    {
      name,
    },
  );

  return data;
};

export const updateMyPassword = async ({
  currentPassword,
  newPassword,
}) => {
  const { data } = await api.patch(
    '/api/v1/users/me/password',
    {
      currentPassword,
      newPassword,
    },
  );

  return data;
};

export const getProjectInvitations =
  async () => {
    const { data } = await api.get(
      '/api/v1/projects/invitations',
    );

    return data;
  };

export const respondProjectInvitation =
  async (
    inviteId,
    isAccepted,
  ) => {
    const { data } = await api.post(
      `/api/v1/projects/invitations/${inviteId}/respond`,
      {
        isAccepted,
      },
    );

    return data;
  };

export const getOrganizationProjects =
  async () => {
    const { data } = await api.get(
      '/api/v1/projects',
    );

    return data;
  };

export const getProjectMembers =
  async (projectId) => {
    const { data } = await api.get(
      `/api/v1/projects/${projectId}/members`,
    );

    return data;
  };
