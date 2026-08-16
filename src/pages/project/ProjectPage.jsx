import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import OutlineButton from '../../components/common/OutlineButton';
import AnnouncementDetailModal from '../../components/project/AnnouncementDetailModal';
import AnnouncementFormModal from '../../components/project/AnnouncementFormModal';
import MyTeamCard from '../../components/project/MyTeamCard';
import ProjectCreateButton from '../../components/project/ProjectCreateButton';
import ProjectNotice from '../../components/project/ProjectNotice';
import ProjectTeamCard from '../../components/project/ProjectTeamCard';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  getProjectAnnouncements,
  updateAnnouncement,
} from '../../api/announcements';
import { getApiErrorMessage, getUserId } from '../../api/axios';
import { getMemberProjects } from '../../api/projects';
import { getProjectTeams } from '../../api/teams';
import { projectPageMockData } from '../../mocks/projectPageData';

import chevronIcon from '../../assets/icons/profile/chevron.svg';

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const getDateAtMidnight = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return null;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const getProjectDayLabel = (project) => {
  const today = getDateAtMidnight(new Date());
  const deadline = getDateAtMidnight(project.endDate ?? project.deadline ?? project.dueDate);

  if (deadline) {
    const remainingDays = Math.max(0, Math.ceil((deadline - today) / MILLISECONDS_PER_DAY));

    return `D-${remainingDays}`;
  }

  const createdAt = getDateAtMidnight(project.createdAt);

  if (!createdAt) return 'D+0';

  const elapsedDays = Math.max(0, Math.floor((today - createdAt) / MILLISECONDS_PER_DAY));

  return `D+${elapsedDays}`;
};

function ProjectPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [projectTeams, setProjectTeams] = useState([]);
  const [isTeamsLoading, setIsTeamsLoading] = useState(false);
  const [teamsErrorMessage, setTeamsErrorMessage] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [isAnnouncementsLoading, setIsAnnouncementsLoading] = useState(false);
  const [announcementsErrorMessage, setAnnouncementsErrorMessage] = useState('');
  const [announcementFormMode, setAnnouncementFormMode] = useState(null);
  const [isAnnouncementDetailOpen, setIsAnnouncementDetailOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isAnnouncementDetailLoading, setIsAnnouncementDetailLoading] = useState(false);
  const [isAnnouncementSubmitting, setIsAnnouncementSubmitting] = useState(false);
  const [isAnnouncementDeleting, setIsAnnouncementDeleting] = useState(false);
  const [announcementModalError, setAnnouncementModalError] = useState('');
  const { description, myTeams } = projectPageMockData;
  const currentProject = projects.find((project) => String(project.projectId) === projectId);
  const currentProjectIndex = projects.findIndex(
    (project) => String(project.projectId) === projectId,
  );
  const visibleMyTeams = myTeams.slice(
    0,
    projectPageMockData.projects[currentProjectIndex]?.myTeamCount ?? 0,
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const projectList = await getMemberProjects(getUserId());
        setProjects(projectList);

        // 백엔드 데이터가 없어서 임시로 목데이터 사용
        // const mockProjects = projectPageMockData.projects.map((project, index) => ({
        //   projectId: project.id,
        //   name: project.name,
        //   description: projectPageMockData.description,
        //   createdByName: '목데이터',
        //   createdAt: new Date(2026, 5, index + 1).toISOString(),
        // }));

        // setProjects(mockProjects);
      } catch (error) {
        setErrorMessage(getApiErrorMessage(error, '프로젝트 목록을 불러오지 못했습니다.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (isLoading || errorMessage || projects.length === 0) return;

    const hasCurrentProject = projects.some((project) => String(project.projectId) === projectId);

    if (!hasCurrentProject) {
      navigate(`/projects/${projects[0].projectId}`, { replace: true });
    }
  }, [errorMessage, isLoading, navigate, projectId, projects]);

  useEffect(() => {
    setIsBannerVisible(true);
    setAnnouncementFormMode(null);
    setIsAnnouncementDetailOpen(false);
    setSelectedAnnouncement(null);
    setAnnouncementModalError('');
  }, [projectId]);

  useEffect(() => {
    if (!projectId || !currentProject) return;

    let isCurrentRequest = true;

    const fetchProjectTeams = async () => {
      try {
        setIsTeamsLoading(true);
        setTeamsErrorMessage('');

        const teamList = await getProjectTeams(projectId);

        if (isCurrentRequest) {
          setProjectTeams(teamList);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setProjectTeams([]);
          setTeamsErrorMessage(
            getApiErrorMessage(error, '프로젝트 팀 목록을 불러오지 못했습니다.'),
          );
        }
      } finally {
        if (isCurrentRequest) {
          setIsTeamsLoading(false);
        }
      }
    };

    fetchProjectTeams();

    return () => {
      isCurrentRequest = false;
    };
  }, [currentProject, projectId]);

  const refreshProjectAnnouncements = async () => {
    const announcementPage = await getProjectAnnouncements(projectId);
    setAnnouncements(announcementPage.announcements);
    setAnnouncementsErrorMessage('');
  };

  const handleOpenCreateAnnouncement = () => {
    setSelectedAnnouncement(null);
    setAnnouncementModalError('');
    setAnnouncementFormMode('create');
  };

  const handleOpenAnnouncementDetail = async (announcementId) => {
    try {
      setIsAnnouncementDetailOpen(true);
      setIsAnnouncementDetailLoading(true);
      setSelectedAnnouncement(null);
      setAnnouncementModalError('');

      const announcement = await getAnnouncement(projectId, announcementId);
      setSelectedAnnouncement(announcement);
    } catch (error) {
      setAnnouncementModalError(getApiErrorMessage(error, '공지 상세 내용을 불러오지 못했습니다.'));
    } finally {
      setIsAnnouncementDetailLoading(false);
    }
  };

  const handleSubmitAnnouncement = async ({ teamId, title, content }) => {
    try {
      setIsAnnouncementSubmitting(true);
      setAnnouncementModalError('');

      if (announcementFormMode === 'edit' && selectedAnnouncement) {
        await updateAnnouncement(projectId, selectedAnnouncement.id, {
          title,
          content,
        });
      } else {
        await createAnnouncement(projectId, teamId, {
          title,
          content,
        });
      }

      await refreshProjectAnnouncements();
      setAnnouncementFormMode(null);
      setSelectedAnnouncement(null);
    } catch (error) {
      setAnnouncementModalError(
        getApiErrorMessage(
          error,
          announcementFormMode === 'edit'
            ? '공지를 수정하지 못했습니다.'
            : '공지를 등록하지 못했습니다.',
        ),
      );
    } finally {
      setIsAnnouncementSubmitting(false);
    }
  };

  const handleEditAnnouncement = () => {
    setIsAnnouncementDetailOpen(false);
    setAnnouncementModalError('');
    setAnnouncementFormMode('edit');
  };

  const handleDeleteAnnouncement = async () => {
    if (!selectedAnnouncement) return;

    const shouldDelete = window.confirm('이 공지를 삭제할까요?');

    if (!shouldDelete) return;

    try {
      setIsAnnouncementDeleting(true);
      setAnnouncementModalError('');

      await deleteAnnouncement(projectId, selectedAnnouncement.id);
      await refreshProjectAnnouncements();
      setIsAnnouncementDetailOpen(false);
      setSelectedAnnouncement(null);
    } catch (error) {
      setAnnouncementModalError(getApiErrorMessage(error, '공지를 삭제하지 못했습니다.'));
    } finally {
      setIsAnnouncementDeleting(false);
    }
  };

  useEffect(() => {
    if (!projectId || !currentProject) return;

    let isCurrentRequest = true;

    const fetchProjectAnnouncements = async () => {
      try {
        setIsAnnouncementsLoading(true);
        setAnnouncementsErrorMessage('');

        const announcementPage = await getProjectAnnouncements(projectId);

        if (isCurrentRequest) {
          setAnnouncements(announcementPage.announcements);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setAnnouncements([]);
          setAnnouncementsErrorMessage(
            getApiErrorMessage(error, '프로젝트 공지를 불러오지 못했습니다.'),
          );
        }
      } finally {
        if (isCurrentRequest) {
          setIsAnnouncementsLoading(false);
        }
      }
    };

    fetchProjectAnnouncements();

    return () => {
      isCurrentRequest = false;
    };
  }, [currentProject, projectId]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">프로젝트를 불러오는 중입니다.</div>
    );
  }

  if (errorMessage) {
    return <div className="flex h-full items-center justify-center">{errorMessage}</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">소속된 프로젝트가 없습니다.</div>
    );
  }

  if (!currentProject) {
    return null;
  }

  return (
    <div className="h-full [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto w-full max-w-[1350px]">
        <div className="flex h-[82px] items-start gap-[14px] pt-[17px]">
          {projects.map((project) => {
            const isActive = String(project.projectId) === projectId;

            return (
              <button
                key={project.projectId}
                type="button"
                onClick={() => navigate(`/projects/${project.projectId}`)}
                className={`subhead-3 flex w-[162px] shrink-0 justify-center text-[var(--color-black)] ${
                  isActive
                    ? 'h-[75px] items-start rounded-t-[10px] bg-[var(--color-action-primary)] pt-[14px]'
                    : 'h-[54px] items-center rounded-[10px] bg-[var(--color-gray-50)]'
                }`}
              >
                {project.name}
              </button>
            );
          })}

          <ProjectCreateButton onClick={() => navigate('/projects/new')} />
        </div>

        <main className="relative z-10 min-h-[1032px] overflow-hidden rounded-[10px] bg-[var(--color-white)]">
          {isBannerVisible && (
            <section className="flex h-16 items-center bg-[var(--color-action-primary)] px-[21px]">
              <span className="body-3 flex h-9 w-[75px] shrink-0 items-center justify-center rounded-[300px] bg-[var(--color-white)] text-[var(--color-gray-900)]">
                {getProjectDayLabel(currentProject)}
              </span>
              <p className="subhead-3 ml-5 min-w-0 flex-1 truncate text-[var(--color-gray-700)]">
                {currentProject.description || description}
              </p>
              <button
                type="button"
                onClick={() => setIsBannerVisible(false)}
                className="body-4 ml-4 flex shrink-0 items-center gap-[7px] tracking-[-0.16px] text-[var(--color-gray-600)]"
              >
                <img src={chevronIcon} alt="" className="h-[7px] w-[15px]" />
                숨기기
              </button>
            </section>
          )}

          <div className="px-[22px] pt-10">
            <ProjectNotice
              key={projectId}
              notices={announcements}
              isLoading={isAnnouncementsLoading}
              errorMessage={announcementsErrorMessage}
              onCreateClick={handleOpenCreateAnnouncement}
              onDetailClick={handleOpenAnnouncementDetail}
            />

            <section className="mt-[38px]">
              <h2 className="subhead-1 text-[var(--color-black)]">내 팀</h2>
              <div className="mt-[19px] flex [scrollbar-width:none] gap-[14px] overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden">
                {visibleMyTeams.map((team) => (
                  <MyTeamCard
                    key={team.id}
                    team={team}
                    onMove={(teamId) => navigate(`/projects/${projectId}/teams/${teamId}/meetings`)}
                    className="shrink-0"
                  />
                ))}
              </div>
            </section>

            <section className="mt-[38px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  <h2 className="subhead-1 text-[var(--color-black)]">
                    {currentProject.name}의 팀
                  </h2>
                  <span className="subhead-2 text-[var(--color-gray-500)]">
                    {projectTeams.length}개
                  </span>
                </div>
                <OutlineButton className="h-[44px] w-[114px] !px-0 !py-0">
                  팀 추가하기
                </OutlineButton>
              </div>

              <div className="mt-[10px] flex [scrollbar-width:none] gap-[14px] overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden">
                {isTeamsLoading && (
                  <p className="body-4 py-10 text-[var(--color-gray-500)]">
                    프로젝트 팀을 불러오는 중입니다.
                  </p>
                )}
                {!isTeamsLoading && teamsErrorMessage && (
                  <p className="body-4 py-10 text-[var(--color-red)]">{teamsErrorMessage}</p>
                )}
                {!isTeamsLoading && !teamsErrorMessage && projectTeams.length === 0 && (
                  <p className="body-4 py-10 text-[var(--color-gray-500)]">
                    아직 생성된 팀이 없습니다.
                  </p>
                )}
                {!isTeamsLoading &&
                  !teamsErrorMessage &&
                  projectTeams.map((team) => (
                    <ProjectTeamCard key={team.id} team={team} className="shrink-0" />
                  ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <AnnouncementFormModal
        isOpen={Boolean(announcementFormMode)}
        mode={announcementFormMode ?? 'create'}
        teams={projectTeams}
        initialAnnouncement={selectedAnnouncement}
        isSubmitting={isAnnouncementSubmitting}
        errorMessage={announcementModalError}
        onClose={() => {
          setAnnouncementFormMode(null);
          setSelectedAnnouncement(null);
          setAnnouncementModalError('');
        }}
        onSubmit={handleSubmitAnnouncement}
      />

      <AnnouncementDetailModal
        isOpen={isAnnouncementDetailOpen}
        announcement={selectedAnnouncement}
        isLoading={isAnnouncementDetailLoading}
        isDeleting={isAnnouncementDeleting}
        errorMessage={announcementModalError}
        canManage={
          Boolean(selectedAnnouncement?.authorId) &&
          String(selectedAnnouncement.authorId) === String(getUserId())
        }
        onClose={() => {
          setIsAnnouncementDetailOpen(false);
          setSelectedAnnouncement(null);
          setAnnouncementModalError('');
        }}
        onEdit={handleEditAnnouncement}
        onDelete={handleDeleteAnnouncement}
      />
    </div>
  );
}

export default ProjectPage;
