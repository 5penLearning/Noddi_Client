import meetingSymbol from '../../../assets/icons/home-meeting/meeting-symbol.svg';
import meetingSymbolSecondary from '../../../assets/icons/home-meeting/meeting-symbol-secondary.svg';

const KOREAN_WEEK_DAYS = [
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
];

function parseDateTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatSelectedDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${month}월 ${day}일(${KOREAN_WEEK_DAYS[date.getDay()]
    })`;
}

function MeetingSymbol({
  active = false,
  current = false,
}) {
  if (current) {
    return (
      <img
        src={meetingSymbol}
        alt=""
        className="h-[22px] w-[22px] object-contain"
      />
    );
  }

  if (active) {
    return (
      <span
        className="h-[22px] w-[22px] bg-[#31F5A0]"
        style={{
          WebkitMaskImage: `url(${meetingSymbolSecondary})`,
          maskImage: `url(${meetingSymbolSecondary})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={meetingSymbolSecondary}
      alt=""
      className="h-[22px] w-[22px] object-contain"
    />
  );
}

function MeetingScheduleList({
  meetings = [],
  selectedDate,
  now,
  onStart,
  onJoin,
  onOpenSummary,
  startingMeetingId,
  hasActiveMeeting,
}) {
  const getMeetingState = (meeting) => {
    if (meeting.status === 'IN_PROGRESS') {
      return {
        type: 'IN_PROGRESS',
        statusLabel: '현재 진행중이에요',
        buttonLabel: '참여하기',
        disabled: false,
        active: true,
      };
    }

    if (meeting.status === 'ENDED') {
      return {
        type: 'ENDED',
        statusLabel: '종료된 회의',
        buttonLabel: '회의록',
        disabled: false,
        active: false,
      };
    }

    const scheduledStart = parseDateTime(
      meeting.scheduledStartAt,
    );

    const isStartable =
      scheduledStart &&
      now.getTime() >= scheduledStart.getTime() &&
      !hasActiveMeeting;

    return {
      type: 'SCHEDULED',

      statusLabel: '',

      buttonLabel: isStartable
        ? '시작하기'
        : '참여하기',

      disabled: !isStartable,

      active: Boolean(isStartable),
    };
  };

  const handleAction = (meeting, state) => {
    if (state.disabled) {
      return;
    }

    if (state.type === 'IN_PROGRESS') {
      onJoin(meeting);

      return;
    }

    if (state.type === 'ENDED') {
      onOpenSummary(meeting);

      return;
    }

    onStart(meeting);
  };

  return (
    <div className="mt-4 border-t border-[#E8ECEA] pt-4">
      <div className="flex items-center gap-2.5">
        <strong className="text-[13px] font-semibold text-[#59625F]">
          {formatSelectedDate(selectedDate)}
        </strong>

        <span className="text-[12px] text-[#A7B0AC]">
          {meetings.length}개
        </span>
      </div>

      {meetings.length === 0 ? (
        <div className="flex min-h-[130px] items-center justify-center">
          <p className="text-[12px] text-[#A7B0AC]">
            예정된 회의가 없습니다.
          </p>
        </div>
      ) : (
        <div className="mt-4 max-h-[190px] space-y-4 overflow-y-auto pr-1">
          {meetings.map((meeting) => {
            const state = getMeetingState(meeting);

            const isCurrent =
              state.type === 'IN_PROGRESS';

            const isStarting =
              startingMeetingId === meeting.meetingId;

            return (
              <div
                key={meeting.meetingId}
                className="grid grid-cols-[25px_minmax(0,1fr)_88px] items-center gap-3"
              >
                <div className="flex justify-center self-start pt-2">
                  <MeetingSymbol
                    current={isCurrent}
                    active={state.active}
                  />
                </div>

                <div className="min-w-0">
                  {state.statusLabel && (
                    <p
                      className={`mb-1 text-[10px] font-medium ${isCurrent
                        ? 'text-[#31D99A]'
                        : 'text-[#9AA4A0]'
                        }`}
                    >
                      {state.statusLabel}
                    </p>
                  )}

                  <div className="flex min-w-0 items-center gap-1.5">
                    <strong className="shrink-0 text-[13px] font-semibold text-[#101211]">
                      {meeting.startTime}
                    </strong>

                    <p className="truncate text-[13px] font-semibold text-[#101211]">
                      {meeting.title}
                    </p>
                  </div>

                  <p className="mt-1 truncate text-[11px] text-[#8E9894]">
                    {meeting.team}
                  </p>

                  {meeting.description && (
                    <p className="mt-1.5 max-w-[220px] truncate text-[10px] text-[#B0B8B5]">
                      {meeting.description}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={
                    state.disabled ||
                    isStarting
                  }
                  onClick={() =>
                    handleAction(
                      meeting,
                      state,
                    )
                  }
                  className={`h-[38px] rounded-[8px] text-[11px] font-semibold transition ${state.disabled
                    ? 'cursor-not-allowed bg-[#E8ECEA] text-[#C3CAC7]'
                    : state.active
                      ? 'bg-[#31F5A0] text-[#101211] hover:brightness-[0.97]'
                      : 'bg-[#EFF3F1] text-[#59625F] hover:bg-[#E5EBE8]'
                    }`}
                >
                  {isStarting
                    ? '시작 중'
                    : state.buttonLabel}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MeetingScheduleList;
