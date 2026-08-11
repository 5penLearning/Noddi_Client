import plusHorizontalIcon from '../../assets/icons/project/plus-horizontal.svg';
import plusVerticalIcon from '../../assets/icons/project/plus-vertical.svg';

function ProjectCreateButton({ className = '', onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex size-[54px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[var(--color-white)] ${className}`}
    >
      <span className="relative size-6">
        <span className="absolute left-0.5 top-0.5 size-5 rounded-[5px] border-[1.5px] border-[#2B3F6C]" />
        <img
          src={plusHorizontalIcon}
          className="absolute left-1/2 top-1/2 h-[1.5px] w-[7.5px] -translate-x-1/2 -translate-y-1/2"
        />
        <img
          src={plusVerticalIcon}
          className="absolute left-1/2 top-1/2 h-[1.5px] w-[7.5px] -translate-x-1/2 -translate-y-1/2 rotate-90"
        />
      </span>
    </button>
  );
}

export default ProjectCreateButton;
