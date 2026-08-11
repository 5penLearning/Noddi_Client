const participants = [
  {
    id: 1,
    name: '김민지',
    imageUrl: null,
  },
  {
    id: 2,
    name: '이서준',
    imageUrl: null,
  },
  {
    id: 3,
    name: '박지우',
    imageUrl: null,
  },
  {
    id: 4,
    name: '최유진',
    imageUrl: null,
  },
  {
    id: 5,
    name: '정현우',
    imageUrl: null,
  },
];

const MAX_VISIBLE_PARTICIPANTS = 3;

function MeetingParticipants() {
  const visibleParticipants = participants.slice(
    0,
    MAX_VISIBLE_PARTICIPANTS,
  );

  const remainingCount =
    participants.length - MAX_VISIBLE_PARTICIPANTS;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        {visibleParticipants.map((participant, index) => (
          <div
            key={participant.id}
            className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-[#31F5A0] bg-white ${
              index !== 0 ? '-ml-2' : ''
            }`}
            title={participant.name}
          >
            {participant.imageUrl ? (
              <img
                src={participant.imageUrl}
                alt={`${participant.name} 프로필`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-semibold text-[#101211]">
                {participant.name.charAt(0)}
              </span>
            )}
          </div>
        ))}

        {remainingCount > 0 && (
          <div className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#31F5A0] bg-[#101211] text-xs font-medium text-white">
            +{remainingCount}
          </div>
        )}
      </div>

      <div className="whitespace-nowrap">
        <p className="text-xs font-semibold text-[#101211]">
          참여 중 {participants.length}명
        </p>
      </div>
    </div>
  );
}

export default MeetingParticipants;
