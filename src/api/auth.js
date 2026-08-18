import api from './axios';

export const login = async ({
  email,
  password,
}) => {
  const response = await api.post(
    '/api/v1/auth/login',
    {
      email,
      password,
    },
    {
      skipAuth: true,
    },
  );

  return response.data;
};

export const getSignupProfileOptions = async ({
  organizationId,
}) => {
  const response = await api.get(
    '/api/v1/auth/profile-options',
    {
      params: {
        organizationId,
      },
      skipAuth: true,
    },
  );

  return response.data;
};

export const sendEmailCode = async ({
  email,
  organizationId,
}) => {
  const response = await api.post(
    '/api/v1/auth/email/send',
    {
      email,
      organizationId,
    },
    {
      skipAuth: true,
    },
  );

  return response.data;
};

export const verifyEmailCode = async ({
  email,
  organizationId,
  code,
}) => {
  const response = await api.post(
    '/api/v1/auth/email/verify',
    {
      email,
      organizationId,
      code,
    },
    {
      skipAuth: true,
    },
  );

  return response.data;
};

export const signup = async ({
  organizationId,
  name,
  department,
  position,
  email,
  password,
}) => {
  const response = await api.post(
    '/api/v1/auth/signup',
    {
      organizationId,
      name,
      department,
      position,
      email,
      password,
    },
    {
      skipAuth: true,
    },
  );

  return response.data;
};
