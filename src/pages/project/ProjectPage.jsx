import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AnnouncementDetailModal from '../../components/project/AnnouncementDetailModal';
import AnnouncementFormModal from '../../components/project/AnnouncementFormModal';
import AddUserIcon from '../../components/project/AddUserIcon';
import MyTeamCard from '../../components/project/MyTeamCard';
import ProjectCreateButton from '../../components/project/ProjectCreateButton';
import ProjectInviteModal from '../../components/project/ProjectInviteModal';
import ProjectNotice from '../../components/project/ProjectNotice';
import ProjectTeamCard from '../../components/project/ProjectTeamCard';
import TeamCreateModal from '../../components/project/TeamCreateModal';
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncement,
  getProjectAnnouncements,
  updateAnnouncement,
} from '../../api/announcements';
import { getApiErrorMessage, getUserId } from '../../api/axios';
import {
  getInvitableOrganizationMembers,
  getMemberProjects,
  getProjectMembers,
  inviteProjectMember,
  removeProjectMember,
  updateProjectMemberRole,
} from '../../api/projects';
import {
  createTeam,
  getMyTeams,
  getProjectTeams,
  getTeamMembers,
  inviteTeamMember,
} from '../../api/teams';
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
  const [myTeams, setMyTeams] = useState([]);
  const [isTeamsLoading, setIsTeamsLoading] = useState(false);
  const [teamsErrorMessage, setTeamsErrorMessage] = useState('');
  const [isTeamCreateModalOpen, setIsTeamCreateModalOpen] = useState(false);
  const [isTeamCreating, setIsTeamCreating] = useState(false);
  const [teamCreateErrorMessage, setTeamCreateErrorMessage] = useState('');
  const [isProjectInviteModalOpen, setIsProjectInviteModalOpen] = useState(false);
  const [invitableMembers, setInvitableMembers] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [inviteKeyword, setInviteKeyword] = useState('');
  const [invitePage, setInvitePage] = useState(0);
  const [inviteTotalElements, setInviteTotalElements] = useState(0);
  const [inviteTotalPages, setInviteTotalPages] = useState(0);
  const [isInvitableMembersLoading, setIsInvitableMembersLoading] = useState(false);
  const [isProjectMembersLoading, setIsProjectMembersLoading] = useState(false);
  const [isProjectInviting, setIsProjectInviting] = useState(false);
  const [memberActionUserId, setMemberActionUserId] = useState(null);
  const [projectInviteErrorMessage, setProjectInviteErrorMessage] = useState('');
  const [projectInviteResultMessage, setProjectInviteResultMessage] = useState('');
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
  const { description } = projectPageMockData;
  const currentProject = projects.find((project) => String(project.projectId) === projectId);

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
    setIsProjectInviteModalOpen(false);
    setInviteKeyword('');
    setInvitePage(0);
    setProjectMembers([]);
    setProjectInviteErrorMessage('');
    setProjectInviteResultMessage('');
  }, [projectId]);

  const loadInvitableMembers = useCallback(async () => {
    if (!projectId) return;

    try {
      setIsInvitableMembersLoading(true);
      setProjectInviteErrorMessage('');

      const memberPage = await getInvitableOrganizationMembers(projectId, {
        keyword: inviteKeyword,
        page: invitePage,
      });

      setInvitableMembers(memberPage.members);
      setInviteTotalElements(memberPage.totalElements);
      setInviteTotalPages(memberPage.totalPages);
    } catch (error) {
      setInvitableMembers([]);
      setInviteTotalElements(0);
      setInviteTotalPages(0);
      setProjectInviteErrorMessage(
        getApiErrorMessage(error, '프로젝트 초대 가능 조직원을 불러오지 못했습니다.'),
      );
    } finally {
      setIsInvitableMembersLoading(false);
    }
  }, [inviteKeyword, invitePage, projectId]);

  const loadProjectMembers = useCallback(async () => {
    if (!projectId) return;

    try {
      setIsProjectMembersLoading(true);
      setProjectInviteErrorMessage('');
      const members = await getProjectMembers(projectId);
      setProjectMembers(members);
    } catch (error) {
      setProjectMembers([]);
      setProjectInviteErrorMessage(
        getApiErrorMessage(error, '프로젝트 멤버 목록을 불러오지 못했습니다.'),
      );
    } finally {
      setIsProjectMembersLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!isProjectInviteModalOpen) return;

    const debounceTimer = window.setTimeout(() => {
      loadInvitableMembers();
    }, 300);

    return () => window.clearTimeout(debounceTimer);
  }, [isProjectInviteModalOpen, loadInvitableMembers]);

  useEffect(() => {
    if (!isProjectInviteModalOpen && !isTeamCreateModalOpen) return;

    loadProjectMembers();
  }, [isProjectInviteModalOpen, isTeamCreateModalOpen, loadProjectMembers]);

  useEffect(() => {
    if (!projectId || !currentProject) return;

    let isCurrentRequest = true;

    const fetchProjectTeams = async () => {
      try {
        setIsTeamsLoading(true);
        setTeamsErrorMessage('');

        const [teamList, myTeamList] = await Promise.all([
          getProjectTeams(projectId),
          getMyTeams(),
        ]);
        const teamMemberResults = await Promise.allSettled(
          teamList.map((team) => getTeamMembers(team.id)),
        );
        const teamsWithMembers = teamList.map((team, index) => ({
          ...team,
          members:
            teamMemberResults[index].status === 'fulfilled'
              ? teamMemberResults[index].value.map((member) => ({
                  ...member,
                  id: member.userId,
                  avatarUrl: member.profileImageUrl ?? member.avatarUrl,
                }))
              : [],
        }));
        const teamMembersById = new Map(
          teamsWithMembers.map((team) => [String(team.id), team.members]),
        );
        const currentProjectTeamIds = new Set(teamsWithMembers.map((team) => String(team.id)));
        const currentProjectMyTeams = myTeamList
          .filter((team) => currentProjectTeamIds.has(String(team.id)))
          .map((team) => ({
            ...team,
            members: teamMembersById.get(String(team.id)) ?? [],
          }));

        if (isCurrentRequest) {
          setProjectTeams(teamsWithMembers);
          setMyTeams(currentProjectMyTeams);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setProjectTeams([]);
          setMyTeams([]);
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

  const handleCreateTeam = async ({ name, description: teamDescription, selectedUserIds = [] }) => {
    try {
      setIsTeamCreating(true);
      setTeamCreateErrorMessage('');

      const createdTeamId = await createTeam(projectId, {
        name,
        description: teamDescription,
      });

      if (selectedUserIds.length > 0) {
        await Promise.allSettled(
          selectedUserIds.map((targetUserId) => inviteTeamMember(createdTeamId, targetUserId)),
        );
      }

      setIsTeamCreateModalOpen(false);
      navigate(`/projects/${projectId}/teams/${createdTeamId}/meetings`, {
        state: {
          projectName: currentProject.name,
          teamName: name,
        },
      });
    } catch (error) {
      setTeamCreateErrorMessage(getApiErrorMessage(error, '팀을 생성하지 못했습니다.'));
    } finally {
      setIsTeamCreating(false);
    }
  };

  const handleInviteProjectMembers = async (targetUserIds) => {
    try {
      setIsProjectInviting(true);
      setProjectInviteErrorMessage('');
      setProjectInviteResultMessage('');

      const inviteResults = await Promise.allSettled(
        targetUserIds.map((targetUserId) => inviteProjectMember(projectId, targetUserId)),
      );
      const successCount = inviteResults.filter((result) => result.status === 'fulfilled').length;
      const failureCount = inviteResults.length - successCount;

      if (successCount > 0) {
        await loadInvitableMembers();
      }

      setProjectInviteResultMessage(
        failureCount > 0
          ? `${successCount}명에게 초대장을 보냈고 ${failureCount}명은 전송하지 못했습니다.`
          : `${successCount}명에게 초대장을 보냈습니다.`,
      );

      return successCount > 0;
    } catch (error) {
      setProjectInviteErrorMessage(
        getApiErrorMessage(error, '프로젝트 초대장을 보내지 못했습니다.'),
      );

      return false;
    } finally {
      setIsProjectInviting(false);
    }
  };

  const handleChangeProjectMemberRole = async (targetUserId, newRole) => {
    try {
      setMemberActionUserId(targetUserId);
      setProjectInviteErrorMessage('');
      setProjectInviteResultMessage('');

      await updateProjectMemberRole(projectId, targetUserId, newRole);
      await loadProjectMembers();
      setProjectInviteResultMessage('프로젝트 멤버 권한을 변경했습니다.');
    } catch (error) {
      setProjectInviteErrorMessage(
        getApiErrorMessage(error, '프로젝트 멤버 권한을 변경하지 못했습니다.'),
      );
    } finally {
      setMemberActionUserId(null);
    }
  };

  const handleRemoveProjectMember = async (member) => {
    const shouldRemove = window.confirm(`${member.name}님을 프로젝트에서 강퇴할까요?`);

    if (!shouldRemove) return;

    try {
      setMemberActionUserId(member.userId);
      setProjectInviteErrorMessage('');
      setProjectInviteResultMessage('');

      await removeProjectMember(projectId, member.userId);
      await Promise.all([loadProjectMembers(), loadInvitableMembers()]);
      setProjectInviteResultMessage(`${member.name}님을 프로젝트에서 강퇴했습니다.`);
    } catch (error) {
      setProjectInviteErrorMessage(
        getApiErrorMessage(error, '프로젝트 멤버를 강퇴하지 못했습니다.'),
      );
    } finally {
      setMemberActionUserId(null);
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
      <div className="flex h-full flex-col items-center justify-center">
        <ProjectCreateButton onClick={() => navigate('/projects/new')} />
        <p className="subhead-2 mt-5 text-[var(--color-gray-700)]">
          아직 소속된 프로젝트가 없습니다.
        </p>
        <p className="body-4 mt-2 text-[var(--color-gray-500)]">
          새 프로젝트를 만들어 시작해보세요.
        </p>
      </div>
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

          {currentProject?.myRole === 'LEADER' && (
            <button
              type="button"
              onClick={() => {
                setInviteKeyword('');
                setInvitePage(0);
                setProjectInviteErrorMessage('');
                setProjectInviteResultMessage('');
                setIsProjectInviteModalOpen(true);
              }}
              className="mt-[15px] mr-[7px] ml-auto flex size-6 shrink-0 items-center justify-center"
            >
              <AddUserIcon />
            </button>
          )}
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

          {!isBannerVisible && (
            <button
              type="button"
              onClick={() => setIsBannerVisible(true)}
              className="body-4 absolute top-[22px] right-[21px] z-10 flex items-center gap-[7px] tracking-[-0.16px] text-[var(--color-gray-600)]"
            >
              <img src={chevronIcon} alt="" className="h-[7px] w-[15px] rotate-180" />
              설명 보기
            </button>
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
                {isTeamsLoading && (
                  <p className="body-4 py-10 text-[var(--color-gray-500)]">
                    내 팀을 불러오는 중입니다.
                  </p>
                )}
                {!isTeamsLoading && teamsErrorMessage && (
                  <p className="body-4 py-10 text-[var(--color-red)]">{teamsErrorMessage}</p>
                )}
                {!isTeamsLoading && !teamsErrorMessage && myTeams.length === 0 && (
                  <p className="body-4 py-10 text-[var(--color-gray-500)]">
                    아직 가입한 팀이 없습니다.
                  </p>
                )}
                {!isTeamsLoading &&
                  !teamsErrorMessage &&
                  myTeams.map((team) => (
                    <MyTeamCard
                      key={team.id}
                      team={team}
                      onMove={(teamId) =>
                        navigate(`/projects/${projectId}/teams/${teamId}/meetings`, {
                          state: {
                            projectName: currentProject.name,
                            teamName: team.name,
                          },
                        })
                      }
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
                <button
                  type="button"
                  onClick={() => {
                    setTeamCreateErrorMessage('');
                    setIsTeamCreateModalOpen(true);
                  }}
                  className="text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-nowrap text-[var(--color-gray-700)] underline"
                >
                  팀 추가하기
                </button>
              </div>

              <div className="mt-[10px] flex [scrollbar-width:none] gap-[14px] overflow-x-auto overflow-y-hidden pb-6 [&::-webkit-scrollbar]:hidden">
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

      <TeamCreateModal
        isOpen={isTeamCreateModalOpen}
        members={projectMembers}
        currentUserId={getUserId()}
        isLoadingMembers={isProjectMembersLoading}
        isSubmitting={isTeamCreating}
        errorMessage={teamCreateErrorMessage}
        onClose={() => {
          setIsTeamCreateModalOpen(false);
          setTeamCreateErrorMessage('');
        }}
        onSubmit={handleCreateTeam}
      />

      <ProjectInviteModal
        isOpen={isProjectInviteModalOpen}
        projectName={currentProject.name}
        members={invitableMembers}
        projectMembers={projectMembers}
        currentUserId={getUserId()}
        keyword={inviteKeyword}
        page={invitePage}
        totalElements={inviteTotalElements}
        totalPages={inviteTotalPages}
        isLoading={isInvitableMembersLoading}
        isProjectMembersLoading={isProjectMembersLoading}
        isSubmitting={isProjectInviting}
        memberActionUserId={memberActionUserId}
        errorMessage={projectInviteErrorMessage}
        resultMessage={projectInviteResultMessage}
        onKeywordChange={(keyword) => {
          setInviteKeyword(keyword);
          setInvitePage(0);
          setProjectInviteResultMessage('');
        }}
        onPageChange={setInvitePage}
        onClose={() => {
          setIsProjectInviteModalOpen(false);
          setInviteKeyword('');
          setInvitePage(0);
          setProjectInviteErrorMessage('');
          setProjectInviteResultMessage('');
        }}
        onInvite={handleInviteProjectMembers}
        onRoleChange={handleChangeProjectMemberRole}
        onRemoveMember={handleRemoveProjectMember}
      />
    </div>
  );
}

export default ProjectPage;
