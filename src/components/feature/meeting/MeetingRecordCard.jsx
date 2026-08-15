import chevronIcon from '../../../assets/icons/profile/chevron.svg';

function MeetingRecordCard({
  title,
  createdDate,
  createdTime,
  teams = [],
  summary,
  onClick,
  className = '',
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-[190px] w-full border border-[var(--color-border)] bg-white text-left ${className}`}
    >
      <strong className="subhead-3 absolute top-[17px] left-[14px] font-medium whitespace-nowrap text-black">
        {title}
      </strong>

      <div className="subhead-4 absolute top-[53px] left-[14px] flex items-center font-medium whitespace-nowrap">
        <span className="text-black">생성날짜</span>
        <span className="ml-[18px] text-[var(--color-text-secondary)]">{createdDate}</span>
        <span className="ml-[18px] text-[var(--color-text-secondary)]">{createdTime}</span>
      </div>

      <div className="absolute top-[84px] left-[14px] flex items-center gap-[8px]">
        {teams.map((team) => (
          <span
            key={team}
            className="subhead-4 flex h-[32px] items-center justify-center border border-[var(--color-border)] bg-white px-[10px] font-medium whitespace-nowrap text-[var(--color-text-secondary)]"
          >
            {team}
          </span>
        ))}
      </div>

      <p className="subhead-4 absolute top-[151px] left-[14px] font-medium whitespace-nowrap text-[var(--color-text-secondary)]">
        {summary}
      </p>

      <span className="absolute top-[19px] right-[14px] flex size-[24px] items-center justify-center">
        <img src={chevronIcon} alt="" className="h-[7.12px] w-[15.5px] rotate-90" />
      </span>
    </button>
  );
}

export default MeetingRecordCard;
