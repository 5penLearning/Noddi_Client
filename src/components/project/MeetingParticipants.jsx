import logoSimpleIcon from '../../assets/icons/sidebar/logo-simple.svg';

function ProfileChip({ participant, muted = false }) {
  return (
    <span
      className={`flex h-8 shrink-0 items-center gap-2 rounded-[5px] border px-1 pr-[10px] ${
        muted
          ? 'border-[var(--color-gray-400)] bg-[var(--color-gray-50)] opacity-50'
          : 'border-[var(--color-primary)] bg-[#effff8]'
      }`}
    >
      <span className="flex size-6 items-center justify-center rounded-full border-[0.5px] border-[var(--color-gray-200)] bg-[var(--color-gray-100)]">
        <img src={logoSimpleIcon} className="h-[14px] w-[11px] opacity-30" />
      </span>
      <strong className="text-[16px] leading-[1.3] font-medium whitespace-nowrap text-black">
        {participant.name ?? '참석자'}
      </strong>
      {(participant.role || participant.position) && (
        <span className="text-[16px] leading-[1.4] tracking-[-0.16px] whitespace-nowrap text-[var(--color-gray-500)]">
          {participant.role ?? participant.position}
        </span>
      )}
    </span>
  );
}

function MeetingParticipants({ participants, teamName }) {
  const teamNames = [teamName, ...participants.map((participant) => participant.teamName)]
    .filter(Boolean)
    .filter((name, index, names) => names.indexOf(name) === index);

  return (
    <section className="mt-6 px-[29px]">
      <h2 className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[var(--color-gray-900)]">
        참석자
      </h2>
      <div className="mt-3 flex [scrollbar-width:none] items-center gap-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {teamNames.map((name) => (
          <span
            key={name}
            className="flex h-7 shrink-0 items-center rounded-[4px] border border-[var(--color-gray-200)] px-[6px] py-[5px] text-[14px] leading-[1.4] tracking-[-0.21px] text-[var(--color-gray-600)]"
          >
            {name}
          </span>
        ))}
      </div>
      <div className="mt-2 flex [scrollbar-width:none] items-center gap-1 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {participants.length > 0 ? (
          participants.map((participant) => (
            <ProfileChip
              key={participant.userId ?? participant.name}
              participant={{ name: participant.name }}
            />
          ))
        ) : (
          <p className="text-[14px] text-[var(--color-gray-500)]">참석자 기록이 없습니다.</p>
        )}
      </div>
    </section>
  );
}

export { ProfileChip };
export default MeetingParticipants;
