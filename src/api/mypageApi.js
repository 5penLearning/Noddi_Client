import api from './axios';

export const getMyProfile = async () => {
  const { data } = await api.get(
    '/api/v1/users/me',
  );

  return data;
};

export const updateMyProfileImage = async (image) => {
  const formData = new FormData();
  formData.append('image', image);

  const { data } = await api.put('/api/v1/users/me/profile-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const deleteMyProfileImage = async () => {
  const { data } = await api.delete('/api/v1/users/me/profile-image');

  return data;
};

export const getUserProfileImage = async (userId) => {
  const { data } = await api.get(`/api/v1/users/${userId}/profile-image`, {
    responseType: 'blob',
  });

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

export const verifyCurrentPassword =
  async ({
    email,
    password,
  }) => {
    const { data } = await api.post(
      '/api/v1/auth/login',
      {
        email,
        password,
      },
      {
        skipAuth: true,
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

export const getTeamInvitations =
  async () => {
    const { data } = await api.get(
      '/api/v1/users/me/teams/invitations',
    );

    return data;
  };

export const respondTeamInvitation =
  async (
    inviteId,
    isAccepted,
  ) => {
    const { data } = await api.post(
      `/api/v1/teams/invitations/${inviteId}/respond`,
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

export const leaveProject = async (
  projectId,
  userId,
) => {
  const { data } = await api.delete(
    `/api/v1/projects/${projectId}/members/${userId}`,
  );

  return data;
};
