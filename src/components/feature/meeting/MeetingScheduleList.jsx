const WEEK_DAYS = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

function VideoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="6"
        width="13"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M16 10L21 7V17L16 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 3H14L19 8V21H6V3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M14 3V8H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M9 13H16M9 17H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 7V12L15.5 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getMeetingDateTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getMeetingStatusLabel(status) {
  if (status === 'IN_PROGRESS') {
    return '진행 중';
  }

  if (status === 'ENDED') {
    return '종료';
  }

  return '예약';
}

function getMeetingStatusClassName(status) {
  if (status === 'IN_PROGRESS') {
    return 'bg-[#E7FFF4] text-[#168958]';
  }

  if (status === 'ENDED') {
    return 'bg-[#F1F3F2] text-[#7B8581]';
  }

  return 'bg-[#F0F2FF] text-[#5865C7]';
}

function MeetingScheduleList({
  meetings,
  selectedDate,
  now,
  onStart,
  onJoin,
  onOpenSummary,
  startingMeetingId = null,
  hasActiveMeeting = false,
}) {
  const selectedMonth =
    selectedDate.getMonth() + 1;

  const selectedDay =
    selectedDate.getDate();

  const selectedWeekDay =
    WEEK_DAYS[selectedDate.getDay()];

  const currentTime = now.getTime();

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#101211]">
            {selectedMonth}월 {selectedDay}일
          </h3>

          <p className="mt-1 text-xs text-[#8A9490]">
            {selectedWeekDay}
          </p>
        </div>

        <span className="text-xs text-[#8A9490]">
          {meetings.length}개의 회의
        </span>
      </div>

      {meetings.length === 0 ? (
        <div className="flex min-h-[124px] items-center justify-center rounded-xl border border-dashed border-[#D8DFDC] bg-[#FAFBFA]">
          <p className="text-sm text-[#8A9490]">
            예정된 회의가 없습니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => {
            const scheduledStart =
              getMeetingDateTime(
                meeting.scheduledStartAt,
              );

            const hasReachedStartTime =
              Boolean(scheduledStart) &&
              currentTime >=
              scheduledStart.getTime();

            /*
             * 시작 가능 조건
             *
             * 1. SCHEDULED 상태
             * 2. 예정 시작 시간이 지남
             * 3. 현재 다른 회의가 진행 중이지 않음
             *
             * scheduledEndAt은 시작 가능 여부에
             * 사용하지 않는다.
             */
            const canStart =
              meeting.status ===
              'SCHEDULED' &&
              hasReachedStartTime &&
              !hasActiveMeeting;

            const isStarting =
              startingMeetingId ===
              meeting.meetingId;

            return (
              <div
                key={meeting.meetingId}
                className="flex items-center gap-4 rounded-xl border border-[#E8ECEA] bg-white px-4 py-4"
              >
                {/* 시간 */}
                <div className="w-[92px] shrink-0">
                  <p className="text-sm font-semibold text-[#101211]">
                    {meeting.startTime ||
                      '--:--'}
                  </p>

                  <p className="mt-1 text-xs text-[#8A9490]">
                    ~{' '}
                    {meeting.endTime ||
                      '--:--'}
                  </p>
                </div>

                <div className="h-12 w-px shrink-0 bg-[#EDF0EF]" />

                {/* 회의 정보 */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate text-sm font-semibold text-[#101211]">
                      {meeting.title}
                    </h4>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${getMeetingStatusClassName(
                        meeting.status,
                      )}`}
                    >
                      {getMeetingStatusLabel(
                        meeting.status,
                      )}
                    </span>
                  </div>

                  <div className="mt-1.5 flex items-center gap-2 text-xs text-[#7B8581]">
                    <span>
                      {meeting.team}
                    </span>

                    {meeting.agenda && (
                      <>
                        <span className="text-[#CDD3D0]">
                          ·
                        </span>

                        <span className="truncate">
                          {meeting.agenda}
                        </span>
                      </>
                    )}
                  </div>

                  {meeting.status ===
                    'SCHEDULED' &&
                    scheduledStart &&
                    !hasReachedStartTime && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-[#8A9490]">
                        <ClockIcon />

                        <span>
                          예약 시간이 되면
                          시작할 수 있습니다.
                        </span>
                      </div>
                    )}

                  {meeting.status ===
                    'SCHEDULED' &&
                    hasReachedStartTime &&
                    hasActiveMeeting && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-[#8A9490]">
                        <ClockIcon />

                        <span>
                          진행 중인 회의가
                          종료되면 시작할 수
                          있습니다.
                        </span>
                      </div>
                    )}
                </div>

                {/* 액션 */}
                <div className="shrink-0">
                  {meeting.status ===
                    'IN_PROGRESS' ? (
                    <button
                      type="button"
                      onClick={() =>
                        onJoin(meeting)
                      }
                      className="flex items-center gap-1.5 rounded-lg bg-[#101211] px-4 py-2.5 text-xs font-semibold text-white transition hover:opacity-80"
                    >
                      <VideoIcon />
                      참여하기
                    </button>
                  ) : meeting.status ===
                    'SCHEDULED' ? (
                    <button
                      type="button"
                      disabled={
                        !canStart ||
                        isStarting
                      }
                      onClick={() =>
                        onStart(meeting)
                      }
                      className={`flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${canStart &&
                        !isStarting
                        ? 'bg-[#101211] text-white hover:opacity-80'
                        : 'cursor-not-allowed bg-[#E4E9E7] text-[#A7B0AC]'
                        }`}
                    >
                      <VideoIcon />

                      {isStarting
                        ? '시작 중'
                        : '시작하기'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenSummary(
                          meeting,
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-[#D8DFDC] bg-white px-4 py-2.5 text-xs font-semibold text-[#303633] transition hover:bg-[#F5F7F6]"
                    >
                      <FileIcon />
                      회의록 보기
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MeetingScheduleList;
