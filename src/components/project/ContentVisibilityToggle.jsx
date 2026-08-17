import chevronIcon from '../../assets/icons/profile/chevron.svg';

function ContentVisibilityToggle({
  isVisible,
  onClick,
  hideLabel = '숨기기',
  showLabel = '보기',
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`body-4 flex shrink-0 items-center gap-[7px] tracking-[-0.16px] text-[var(--color-gray-600)] ${className}`}
    >
      <img
        src={chevronIcon}
        alt=""
        className={`h-[7px] w-[15px] ${isVisible ? '' : 'rotate-180'}`}
      />
      {isVisible ? hideLabel : showLabel}
    </button>
  );
}

export default ContentVisibilityToggle;
