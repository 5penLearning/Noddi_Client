import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import MyTeamCard from '../components/common/MyTeamCard';
import OutlineButton from '../components/common/OutlineButton';
import ProjectNotice from '../components/common/ProjectNotice';
import ProjectTeamCard from '../components/common/ProjectTeamCard';
import chevronIcon from '../assets/icons/profile/chevron.svg';
import { projectPageMockData } from '../mocks/projectPageData';

function ProjectPage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const { projects, dayCount, description, notices, myTeams, teamCount, teams } =
    projectPageMockData;
  const currentProject = projects.find((project) => project.id === projectId);
  const visibleMyTeams = myTeams.slice(0, currentProject?.myTeamCount ?? 0);

  useEffect(() => {
    setIsBannerVisible(true);
  }, [projectId]);

  if (!currentProject) {
    return <Navigate to={`/projects/${projects[0].id}`} replace />;
  }

  return (
    <div className="h-full [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <div className="mx-auto w-full max-w-[1350px]">
        <div className="flex h-[82px] items-start gap-[14px] pt-[17px]">
          {projects.map((project) => {
            const isActive = project.id === projectId;

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => navigate(`/projects/${project.id}`)}
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

          <button
            type="button"
            className="flex size-[54px] shrink-0 items-center justify-center rounded-[10px] bg-[var(--color-white)] text-[28px] leading-none text-[#2b3f6c]"
          >
            ＋
          </button>
        </div>

        <main className="relative z-10 min-h-[1032px] overflow-hidden rounded-[10px] bg-[var(--color-white)]">
          {isBannerVisible && (
            <section className="flex h-16 items-center bg-[var(--color-action-primary)] px-[21px]">
              <span className="body-3 flex h-9 w-[75px] shrink-0 items-center justify-center rounded-[300px] bg-[var(--color-white)] text-[var(--color-gray-900)]">
                D+{dayCount}
              </span>
              <p className="subhead-3 ml-5 min-w-0 flex-1 truncate text-[var(--color-gray-700)]">
                {description}
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
              <div className="mt-[19px] flex gap-[14px] overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
