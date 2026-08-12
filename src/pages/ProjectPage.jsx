import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MyTeamCard from '../components/common/MyTeamCard';
import OutlineButton from '../components/common/OutlineButton';
import ProjectCreateButton from '../components/common/ProjectCreateButton';
import ProjectNotice from '../components/common/ProjectNotice';
import ProjectTeamCard from '../components/common/ProjectTeamCard';
import { getApiErrorMessage } from '../api/axios';
import { getProjects } from '../api/projects';
import { projectPageMockData } from '../mocks/projectPageData';

import chevronIcon from '../assets/icons/profile/chevron.svg';

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
  const { description, notices, myTeams, teamCount, teams } = projectPageMockData;
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
        const projectList = await getProjects();
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
  }, [projectId]);

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
            <ProjectNotice key={projectId} notices={notices} />

            <section className="mt-[38px]">
              <h2 className="subhead-1 text-[var(--color-black)]">내 팀</h2>
              <div className="mt-[19px] flex [scrollbar-width:none] gap-[14px] overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden">
                {visibleMyTeams.map((team) => (
                  <MyTeamCard key={team.id} team={team} className="shrink-0" />
                ))}
              </div>
            </section>

            <section className="mt-[38px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  <h2 className="subhead-1 text-[var(--color-black)]">노디 프로젝트의 팀</h2>
                  <span className="subhead-2 text-[var(--color-gray-500)]">{teamCount}개</span>
                </div>
                <OutlineButton className="h-[44px] w-[114px] !px-0 !py-0">
                  팀 추가하기
                </OutlineButton>
              </div>

              <div className="mt-[10px] flex [scrollbar-width:none] gap-[14px] overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden">
                {teams.map((team) => (
                  <ProjectTeamCard key={team.id} team={team} className="shrink-0" />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProjectPage;
