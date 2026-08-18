import ContentVisibilityToggle from './ContentVisibilityToggle';
import MyTeamCard from './MyTeamCard';
import ProjectNotice from './ProjectNotice';
import ProjectTeamCard from './ProjectTeamCard';
import { getProjectDayLabel } from './projectUtils';

function ProjectOverview({
  project,
  fallbackDescription,
  isBannerVisible,
  announcements,
  isAnnouncementsLoading,
  announcementsErrorMessage,
  myTeams,
  projectTeams,
  isTeamsLoading,
  teamsErrorMessage,
  onBannerVisibilityChange,
  onCreateAnnouncement,
  onOpenAnnouncement,
  onMoveTeam,
  onCreateTeam,
  onAskTeam,
}) {
  return (
    <main className="relative z-10 min-h-[1032px] overflow-hidden rounded-[10px] bg-[var(--color-white)]">
      {isBannerVisible ? (
        <section className="flex h-16 items-center bg-[var(--color-action-primary)] px-[21px]">
          <span className="body-3 flex h-9 w-[75px] shrink-0 items-center justify-center rounded-[300px] bg-[var(--color-white)] text-[var(--color-gray-900)]">
            {getProjectDayLabel(project)}
          </span>
          <p className="subhead-3 ml-5 min-w-0 flex-1 truncate text-[var(--color-gray-700)]">
            {project.description || fallbackDescription}
          </p>
          <ContentVisibilityToggle
            isVisible
            onClick={() => onBannerVisibilityChange(false)}
            className="ml-4"
          />
        </section>
      ) : (
        <ContentVisibilityToggle
          isVisible={false}
          onClick={() => onBannerVisibilityChange(true)}
          showLabel="설명 보기"
          className="absolute top-[22px] right-[21px] z-10"
        />
      )}

      <div className="px-[22px] pt-10">
        <ProjectNotice
          key={project.projectId}
          notices={announcements}
          isLoading={isAnnouncementsLoading}
          errorMessage={announcementsErrorMessage}
          onCreateClick={onCreateAnnouncement}
          onDetailClick={onOpenAnnouncement}
        />

        <section className="mt-[38px]">
          <h2 className="subhead-1 text-[var(--color-black)]">내 팀</h2>
          <div className="mt-[19px] flex [scrollbar-width:none] gap-[14px] overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden">
            <TeamListState
              isLoading={isTeamsLoading}
              errorMessage={teamsErrorMessage}
              isEmpty={myTeams.length === 0}
              loadingMessage="내 팀을 불러오는 중입니다."
              emptyMessage="아직 가입한 팀이 없습니다."
            />
            {!isTeamsLoading &&
              !teamsErrorMessage &&
              myTeams.map((team) => (
                <MyTeamCard
                  key={team.id}
                  team={team}
                  onMove={onMoveTeam}
                  className="shrink-0"
                />
              ))}
          </div>
        </section>

        <section className="mt-[38px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <h2 className="subhead-1 text-[var(--color-black)]">{project.name}의 팀</h2>
              <span className="subhead-2 text-[var(--color-gray-500)]">
                {projectTeams.length}개
              </span>
            </div>
            <button
              type="button"
              onClick={onCreateTeam}
              className="text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-nowrap text-[var(--color-gray-700)] underline"
            >
              팀 추가하기
            </button>
          </div>

          <div className="mt-[10px] flex [scrollbar-width:none] gap-[14px] overflow-x-auto overflow-y-hidden pb-6 [&::-webkit-scrollbar]:hidden">
            <TeamListState
              isLoading={isTeamsLoading}
              errorMessage={teamsErrorMessage}
              isEmpty={projectTeams.length === 0}
              loadingMessage="프로젝트 팀을 불러오는 중입니다."
              emptyMessage="아직 생성된 팀이 없습니다."
            />
            {!isTeamsLoading &&
              !teamsErrorMessage &&
              projectTeams.map((team) => (
                <ProjectTeamCard
                  key={team.id}
                  team={team}
                  onAsk={onAskTeam}
                  className="shrink-0"
                />
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function TeamListState({
  isLoading,
  errorMessage,
  isEmpty,
  loadingMessage,
  emptyMessage,
}) {
  if (isLoading) {
    return <p className="body-4 py-10 text-[var(--color-gray-500)]">{loadingMessage}</p>;
  }

  if (errorMessage) {
    return <p className="body-4 py-10 text-[var(--color-red)]">{errorMessage}</p>;
  }

  if (isEmpty) {
    return <p className="body-4 py-10 text-[var(--color-gray-500)]">{emptyMessage}</p>;
  }

  return null;
}

export default ProjectOverview;
