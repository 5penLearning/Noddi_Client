import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://www.noddi-dev.site';

const ACCESS_TOKEN_KEY = 'noddi_access_token';
const USER_ID_KEY = 'noddi_user_id';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getUserId = () => {
  return localStorage.getItem(USER_ID_KEY);
};

export const saveAuthSession = ({
  accessToken,
  userId,
}) => {
  if (accessToken) {
    localStorage.setItem(
      ACCESS_TOKEN_KEY,
      accessToken,
    );
  }

  if (userId !== undefined && userId !== null) {
    localStorage.setItem(
      USER_ID_KEY,
      String(userId),
    );
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
};

export const getApiErrorMessage = (
  error,
  fallbackMessage = '요청 처리 중 오류가 발생했습니다.',
) => {
  const data = error?.response?.data;

  if (
    typeof data?.message === 'string' &&
    data.message.trim()
  ) {
    return data.message;
  }

  if (
    typeof data?.error?.message === 'string' &&
    data.error.message.trim()
  ) {
    return data.error.message;
  }

  if (
    typeof data?.error === 'string' &&
    data.error.trim()
  ) {
    return data.error;
  }

  if (error?.code === 'ECONNABORTED') {
    return '서버 응답 시간이 초과되었습니다.';
  }

  if (!error?.response) {
    return '서버에 연결할 수 없습니다.';
  }

  return fallbackMessage;
};

api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken && !config.skipAuth) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default api;
