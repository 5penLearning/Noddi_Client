import api from './axios';

const normalizeAnnouncement = (announcement) => ({
  id: announcement.announcementId,
  teamId: announcement.teamId,
  teamName: announcement.teamName,
  authorId: announcement.authorId,
  authorName: announcement.authorName,
  title: announcement.title,
  content: announcement.content,
  createdAt: announcement.createdAt,
  updatedAt: announcement.updatedAt,
});

export const getProjectAnnouncements = async (projectId, { page = 0, size = 10 } = {}) => {
  const response = await api.get(`/api/v1/projects/${projectId}/announcements`, {
    params: {
      page,
      size,
    },
  });
  const result = response.data.result;

  return {
    announcements: (result?.content ?? []).map(normalizeAnnouncement),
    page: result?.number ?? page,
    totalPages: result?.totalPages ?? 0,
    totalElements: result?.totalElements ?? 0,
    isFirstPage: result?.first ?? true,
    isLastPage: result?.last ?? true,
  };
};

export const getAnnouncement = async (projectId, announcementId) => {
  const response = await api.get(`/api/v1/projects/${projectId}/announcements/${announcementId}`);

  return normalizeAnnouncement(response.data.result);
};

export const createAnnouncement = async (projectId, teamId, { title, content }) => {
  const response = await api.post(`/api/v1/projects/${projectId}/teams/${teamId}/announcements`, {
    title,
    content,
  });

  return response.data.result;
};

export const updateAnnouncement = async (projectId, announcementId, { title, content }) => {
  const response = await api.put(`/api/v1/projects/${projectId}/announcements/${announcementId}`, {
    title,
    content,
  });

  return response.data.result;
};

export const deleteAnnouncement = async (projectId, announcementId) => {
  const response = await api.delete(
    `/api/v1/projects/${projectId}/announcements/${announcementId}`,
  );

  return response.data.result;
};
