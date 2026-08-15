function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatMeetingDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

function formatMeetingTime(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function getAiStatusLabel(status) {
  if (status === 'COMPLETED') {
    return '분석 완료';
  }

  if (status === 'PROCESSING') {
    return '분석 중';
  }

  if (status === 'FAILED') {
    return '분석 실패';
  }

  return '분석 대기';
}

function getAiStatusClassName(status) {
  if (status === 'COMPLETED') {
    return 'bg-[#E8FFF4] text-[#16885B]';
  }

  if (status === 'PROCESSING') {
    return 'bg-[#EEF5FF] text-[#3974C6]';
  }

  if (status === 'FAILED') {
    return 'bg-[#FFF1F0] text-[#D83D34]';
  }

  return 'bg-[#F1F3F2] text-[#7B8581]';
}

function MeetingHistoryModal({
  isOpen,
  meetings = [],
  onClose,
  onOpenSummary,
}) {
  if (!isOpen) {
    return null;
  }

  const endedMeetings = meetings
    .filter(
      (meeting) =>
        meeting.status === 'ENDED',
    )
    .sort((a, b) => {
      const aDate = new Date(
        a.endedAt ??
        a.scheduledEndAt ??
        0,
      ).getTime();

      const bDate = new Date(
        b.endedAt ??
        b.scheduledEndAt ??
        0,
      ).getTime();

      return bDate - aDate;
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meeting-history-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="flex max-h-[80vh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(16,18,17,0.18)]"
      >
        <header className="flex shrink-0 items-start justify-between border-b border-[#EDF0EF] px-6 py-5">
          <div>
            <h2
              id="meeting-history-title"
              className="text-xl font-semibold text-[#101211]"
            >
              지난 회의록
            </h2>

            <p className="mt-1 text-sm text-[#8A9490]">
              종료된 회의의 AI 회의록을
              확인할 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#707A76] transition hover:bg-[#F2F5F4] hover:text-[#101211]"
            aria-label="닫기"
          >
            <CloseIcon />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {endedMeetings.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl bg-[#F7F9F8] px-6 text-center">
              <p className="text-sm font-semibold text-[#59625F]">
                아직 종료된 회의가 없습니다.
              </p>

              <p className="mt-1 text-xs leading-5 text-[#9AA39F]">
                회의를 종료하면 이곳에서
                회의록을 확인할 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {endedMeetings.map(
                (meeting) => {
                  const date =
                    formatMeetingDate(
                      meeting.endedAt ??
                      meeting.scheduledEndAt,
                    );

                  const startTime =
                    formatMeetingTime(
                      meeting.startedAt ??
                      meeting.scheduledStartAt,
                    );

                  const endTime =
                    formatMeetingTime(
                      meeting.endedAt ??
                      meeting.scheduledEndAt,
                    );

                  return (
                    <button
                      key={
                        meeting.meetingId
                      }
                      type="button"
                      onClick={() =>
                        onOpenSummary(
                          meeting,
                        )
                      }
                      className="group flex w-full items-center justify-between gap-4 rounded-xl border border-[#E5EAE8] bg-white p-4 text-left transition hover:border-[#BFCAC5] hover:bg-[#FBFCFC]"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-[#101211]">
                            {meeting.title}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getAiStatusClassName(
                              meeting.aiStatus,
                            )}`}
                          >
                            {getAiStatusLabel(
                              meeting.aiStatus,
                            )}
                          </span>
                        </div>

                        {meeting.agenda && (
                          <p className="mt-1 line-clamp-1 text-xs text-[#7B8581]">
                            {meeting.agenda}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#9AA39F]">
                          {date && (
                            <span>
                              {date}
                            </span>
                          )}

                          {startTime &&
                            endTime && (
                              <span>
                                {startTime} -{' '}
                                {endTime}
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2F5F4] text-[#59625F] transition group-hover:bg-[#101211] group-hover:text-white">
                        <ArrowRightIcon />
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MeetingHistoryModal;
