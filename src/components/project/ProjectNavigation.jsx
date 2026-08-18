import AddUserIcon from './AddUserIcon';
import ProjectCreateButton from './ProjectCreateButton';

function ProjectNavigation({
  projects,
  currentProjectId,
  canInvite,
  onSelectProject,
  onCreateProject,
  onInviteMember,
}) {
  return (
    <div className="flex h-[82px] items-start gap-[14px] pt-[17px]">
      {projects.map((project) => {
        const isActive = String(project.projectId) === String(currentProjectId);

        return (
          <button
            key={project.projectId}
            type="button"
            onClick={() => onSelectProject(project.projectId)}
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

      <ProjectCreateButton onClick={onCreateProject} />

      {canInvite && (
        <button
          type="button"
          onClick={onInviteMember}
          className="mt-[15px] mr-[7px] ml-auto flex size-6 shrink-0 items-center justify-center"
          aria-label="프로젝트 멤버 초대"
        >
          <AddUserIcon />
        </button>
      )}
    </div>
  );
}

export default ProjectNavigation;
