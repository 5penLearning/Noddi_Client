import api from './axios';

export const getMyQuestions = async ({
  page = 0,
  size = 30,
} = {}) => {
  const { data } = await api.get(
    '/api/v1/qa/questions/me',
    {
      params: {
        page,
        size,
        sort: 'createdAt,desc',
      },
    },
  );

  return data;
};

export const getTeamQuestions = async (
  teamId,
  {
    page = 0,
    size = 30,
  } = {},
) => {
  const { data } = await api.get(
    `/api/v1/teams/${teamId}/qa/questions`,
    {
      params: {
        page,
        size,
        sort: 'createdAt,desc',
      },
    },
  );

  return data;
};

export const getQuestionDetail = async (
  questionId,
) => {
  const { data } = await api.get(
    `/api/v1/qa/questions/${questionId}`,
  );

  return data;
};

export const createQuestion = async ({
  targetTeamId,
  content,
}) => {
  const { data } = await api.post(
    '/api/v1/qa/questions',
    {
      targetTeamId,
      content,
    },
  );

  return data;
};

export const reviseAnswer = async (
  answerId,
  content,
) => {
  const { data } = await api.patch(
    `/api/v1/qa/answers/${answerId}`,
    {
      content,
    },
  );

  return data;
};
