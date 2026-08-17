import chevronIcon from '../../assets/icons/profile/chevron.svg';

function MeetingRecordCard({ meetingDate, title, teams = [], summary, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col items-start gap-5 rounded-[10px] border border-[var(--color-border)] bg-white p-5 text-left ${className}`}
    >
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-col items-start gap-1">
            <time className="text-[16px] leading-[1.3] font-medium text-[var(--color-gray-700)]">
              {meetingDate}
            </time>
            <strong className="text-[20px] leading-[1.3] font-semibold text-black">{title}</strong>
          </div>

          <div className="flex items-center gap-1">
            {teams.map((team) => (
              <span
                key={team}
                className="flex h-7 items-center justify-center rounded-[4px] border border-[var(--color-border)] bg-white px-[6px] py-[5px] text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-nowrap text-[var(--color-gray-600)]"
              >
                {team}
              </span>
            ))}
          </div>
        </div>

        <span className="flex size-6 shrink-0 items-center justify-center py-1">
          <img src={chevronIcon} alt="" className="h-[6px] w-[14px] rotate-90" />
        </span>
      </div>

      <p className="w-full text-[16px] leading-[1.4] tracking-[-0.16px] text-[var(--color-gray-600)]">
        {summary}
      </p>
    </button>
  );
}

export default MeetingRecordCard;
