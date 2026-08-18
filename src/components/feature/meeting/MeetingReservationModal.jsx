import { useEffect, useMemo, useState } from 'react';

const INITIAL_FORM = {
  title: '',
  agenda: '',
  date: '',
  startHour: '',
  startMinute: '',
  endHour: '',
  endMinute: '',
  teamId: '',
};

const WEEK_DAYS = [
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
];

const KOREAN_WEEK_DAYS = [
  '일',
  '월',
  '화',
  '수',
  '목',
  '금',
  '토',
];

const HOUR_OPTIONS = Array.from(
  { length: 24 },
  (_, index) => String(index).padStart(2, '0'),
);

const MINUTE_OPTIONS = Array.from(
  { length: 60 },
  (_, index) => String(index).padStart(2, '0'),
);

function formatDateKey(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(
    2,
    '0',
  );

  const day = String(date.getDate()).padStart(
    2,
    '0',
  );

  return `${year}-${month}-${day}`;
}

function parseDateKey(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value
    .split('-')
    .map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(
    year,
    month - 1,
    day,
  );
}

function formatKoreanDate(value) {
  const date = parseDateKey(value);

  if (!date) {
    return '날짜를 선택해주세요';
  }

  return `${date.getFullYear()}년 ${date.getMonth() + 1
    }월 ${date.getDate()}일 (${KOREAN_WEEK_DAYS[date.getDay()]
    })`;
}

function getCalendarDays(viewDate) {
  const year = viewDate.getFullYear();

  const month = viewDate.getMonth();

  const firstDay = new Date(
    year,
    month,
    1,
  ).getDay();

  const lastDate = new Date(
    year,
    month + 1,
    0,
  ).getDate();

  const days = [];

  for (
    let index = 0;
    index < firstDay;
    index += 1
  ) {
    days.push(null);
  }

  for (
    let day = 1;
    day <= lastDate;
    day += 1
  ) {
    days.push(
      new Date(
        year,
        month,
        day,
      ),
    );
  }

  return days;
}

function CloseIcon({
  size = 16,
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 10L12 15L17 10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M16 16L20 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MeetingReservationModal({
  isOpen,
  onClose,
  onReserve,
  filterOptions = [],
  defaultDate,
  minDate,
  meetings = [],
  isSubmitting = false,
  submitError = '',
}) {
  const [form, setForm] =
    useState(INITIAL_FORM);

  const [viewDate, setViewDate] =
    useState(() => new Date());

  const [teamQuery, setTeamQuery] =
    useState('');

  const [
    isTeamDropdownOpen,
    setIsTeamDropdownOpen,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const teamOptions = useMemo(
    () =>
      filterOptions.filter(
        (option) =>
          option.id !== 'ALL' &&
          option.teamId,
      ),
    [filterOptions],
  );

  const selectedTeam = useMemo(
    () =>
      teamOptions.find(
        (team) =>
          String(team.teamId) ===
          String(form.teamId),
      ) ?? null,
    [
      teamOptions,
      form.teamId,
    ],
  );

  const filteredTeams = useMemo(() => {
    const keyword = teamQuery
      .trim()
      .toLowerCase();

    if (!keyword) {
      return teamOptions;
    }

    return teamOptions.filter(
      (team) =>
        team.label
          .toLowerCase()
          .includes(keyword),
    );
  }, [
    teamOptions,
    teamQuery,
  ]);

  const calendarDays = useMemo(
    () => getCalendarDays(viewDate),
    [viewDate],
  );

  const meetingDateSet = useMemo(
    () =>
      new Set(
        meetings
          .map(
            (meeting) =>
              meeting.date,
          )
          .filter(Boolean),
      ),
    [meetings],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const safeDefaultDate =
      defaultDate &&
        (!minDate ||
          defaultDate >= minDate)
        ? defaultDate
        : minDate;

    const initialDate =
      parseDateKey(
        safeDefaultDate,
      ) ?? new Date();

    setForm({
      ...INITIAL_FORM,

      date: formatDateKey(
        initialDate,
      ),
    });

    setViewDate(
      new Date(
        initialDate.getFullYear(),
        initialDate.getMonth(),
        1,
      ),
    );

    setTeamQuery('');

    setIsTeamDropdownOpen(
      false,
    );

    setErrorMessage('');
  }, [
    isOpen,
    defaultDate,
    minDate,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (
      event,
    ) => {
      if (
        event.key ===
        'Escape' &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    window.addEventListener(
      'keydown',
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    isSubmitting,
    onClose,
  ]);

  if (!isOpen) {
    return null;
  }

  const updateForm = (
    name,
    value,
  ) => {
    setForm(
      (previousForm) => ({
        ...previousForm,
        [name]: value,
      }),
    );

    setErrorMessage('');
  };

  const handleSelectDate = (
    date,
  ) => {
    const dateKey =
      formatDateKey(date);

    if (
      minDate &&
      dateKey < minDate
    ) {
      return;
    }

    updateForm(
      'date',
      dateKey,
    );
  };

  const handlePreviousMonth =
    () => {
      setViewDate(
        (previousDate) =>
          new Date(
            previousDate.getFullYear(),
            previousDate.getMonth() -
            1,
            1,
          ),
      );
    };

  const handleNextMonth =
    () => {
      setViewDate(
        (previousDate) =>
          new Date(
            previousDate.getFullYear(),
            previousDate.getMonth() +
            1,
            1,
          ),
      );
    };

  const handleSelectTeam = (
    team,
  ) => {
    updateForm(
      'teamId',
      team.teamId,
    );

    setTeamQuery('');

    setIsTeamDropdownOpen(
      false,
    );
  };

  const handleRemoveTeam =
    () => {
      updateForm(
        'teamId',
        '',
      );

      setTeamQuery('');
    };

  const validateForm = () => {
    if (!form.title.trim()) {
      return '회의명을 입력해주세요.';
    }

    if (!form.agenda.trim()) {
      return '회의 주제를 입력해주세요.';
    }

    if (!form.date) {
      return '회의 날짜를 선택해주세요.';
    }

    if (
      !form.startHour ||
      !form.startMinute
    ) {
      return '회의 시작 시간을 선택해주세요.';
    }

    if (
      !form.endHour ||
      !form.endMinute
    ) {
      return '회의 종료 시간을 선택해주세요.';
    }

    if (!form.teamId) {
      return '회의를 진행할 팀을 선택해주세요.';
    }

    const startDateTime =
      new Date(
        `${form.date}T${form.startHour}:${form.startMinute}:00`,
      );

    const endDateTime =
      new Date(
        `${form.date}T${form.endHour}:${form.endMinute}:00`,
      );

    if (
      Number.isNaN(
        startDateTime.getTime(),
      ) ||
      Number.isNaN(
        endDateTime.getTime(),
      )
    ) {
      return '회의 시간을 확인해주세요.';
    }

    if (
      startDateTime.getTime() <=
      Date.now()
    ) {
      return '현재 시간보다 이후의 회의만 예약할 수 있습니다.';
    }

    if (
      endDateTime.getTime() <=
      startDateTime.getTime()
    ) {
      return '종료 시간은 시작 시간보다 늦어야 합니다.';
    }

    return '';
  };

  const handleSubmit = (
    event,
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const validationError =
      validateForm();

    if (validationError) {
      setErrorMessage(
        validationError,
      );

      return;
    }

    onReserve({
      title:
        form.title.trim(),

      agenda:
        form.agenda.trim(),

      teamId:
        Number(form.teamId),

      date:
        form.date,

      startTime:
        `${form.startHour}:${form.startMinute}`,

      endTime:
        `${form.endHour}:${form.endMinute}`,
    });
  };

  const isFormFilled = Boolean(
    form.title.trim() &&
    form.agenda.trim() &&
    form.date &&
    form.startHour &&
    form.startMinute &&
    form.endHour &&
    form.endMinute &&
    form.teamId,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4 py-5 backdrop-blur-[1px]"
      onMouseDown={(
        event,
      ) => {
        if (
          event.target ===
          event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <form
        onSubmit={
          handleSubmit
        }
        className="flex max-h-[94vh] w-full max-w-[540px] flex-col overflow-hidden rounded-[20px] bg-[#F9FFFD] shadow-[0_18px_60px_rgba(16,18,17,0.18)]"
      >
        <div className="flex-1 overflow-y-auto px-7 pb-6 pt-7">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[20px] font-semibold leading-[1.2] text-[#101211]">
              회의 예약하기
            </h2>

            <button
              type="button"
              disabled={
                isSubmitting
              }
              onClick={
                onClose
              }
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#59625F] transition hover:bg-[#EAF2EF] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="닫기"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="space-y-5">
            {/* 회의명 */}
            <div>
              <label
                htmlFor="meeting-title"
                className="mb-2 block text-[14px] font-medium text-[#101211]"
              >
                회의명
                <span className="ml-0.5 text-[#F64E42]">
                  *
                </span>
              </label>

              <div className="relative">
                <input
                  id="meeting-title"
                  type="text"
                  value={
                    form.title
                  }
                  disabled={
                    isSubmitting
                  }
                  onChange={(
                    event,
                  ) =>
                    updateForm(
                      'title',
                      event.target.value,
                    )
                  }
                  placeholder="회의명을 입력해주세요"
                  className="h-11 w-full rounded-[8px] border border-transparent bg-[#EFF6F3] px-3.5 pr-9 text-[13px] text-[#101211] outline-none transition placeholder:text-[#A5AFAB] focus:border-[#31F5A0] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                />

                {form.title && (
                  <button
                    type="button"
                    disabled={
                      isSubmitting
                    }
                    onClick={() =>
                      updateForm(
                        'title',
                        '',
                      )
                    }
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#B7BFBC]"
                    aria-label="회의명 지우기"
                  >
                    <CloseIcon
                      size={13}
                    />
                  </button>
                )}
              </div>
            </div>

            {/* 회의 주제 */}
            <div>
              <label
                htmlFor="meeting-agenda"
                className="mb-2 block text-[14px] font-medium text-[#101211]"
              >
                회의 주제
                <span className="ml-0.5 text-[#F64E42]">
                  *
                </span>
              </label>

              <div className="relative">
                <textarea
                  id="meeting-agenda"
                  value={
                    form.agenda
                  }
                  disabled={
                    isSubmitting
                  }
                  maxLength={200}
                  onChange={(
                    event,
                  ) =>
                    updateForm(
                      'agenda',
                      event.target.value,
                    )
                  }
                  placeholder="회의 주제에 대해 간략히 적어주세요"
                  rows={3}
                  className="min-h-[90px] w-full resize-none rounded-[8px] border border-transparent bg-[#EFF6F3] px-3.5 py-3 pr-9 text-[13px] leading-[1.5] text-[#101211] outline-none transition placeholder:text-[#A5AFAB] focus:border-[#31F5A0] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                />

                <span className="absolute bottom-2.5 right-3 text-[10px] text-[#A5AFAB]">
                  {form.agenda.length}
                  /200
                </span>
              </div>
            </div>

            {/* 날짜 */}
            <div>
              <label className="mb-3 block text-[14px] font-medium text-[#101211]">
                날짜
                <span className="ml-0.5 text-[#F64E42]">
                  *
                </span>
              </label>

              <div className="mb-4 flex items-center justify-center gap-5">
                <button
                  type="button"
                  onClick={
                    handlePreviousMonth
                  }
                  disabled={
                    isSubmitting
                  }
                  className="text-[25px] font-light leading-none text-[#AAB4B0] transition-colors hover:text-[#31F5A0] active:text-[#31F5A0]"
                  aria-label="이전 달"
                >
                  ‹
                </button>

                <strong className="min-w-[110px] text-center text-[15px] font-semibold text-[#101211]">
                  {viewDate.getMonth() +
                    1}
                  월{' '}
                  {viewDate.getFullYear()}
                </strong>

                <button
                  type="button"
                  onClick={
                    handleNextMonth
                  }
                  disabled={
                    isSubmitting
                  }
                  className="text-[25px] font-light leading-none text-[#AAB4B0] transition-colors hover:text-[#31F5A0] active:text-[#31F5A0]"
                  aria-label="다음 달"
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-7">
                {WEEK_DAYS.map(
                  (weekDay) => (
                    <div
                      key={weekDay}
                      className="flex h-8 items-center justify-center text-[10px] font-medium text-[#B4BDB9]"
                    >
                      {weekDay}
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7">
                {calendarDays.map(
                  (
                    calendarDate,
                    index,
                  ) => {
                    if (
                      !calendarDate
                    ) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="h-11"
                        />
                      );
                    }

                    const dateKey =
                      formatDateKey(
                        calendarDate,
                      );

                    const isSelected =
                      form.date ===
                      dateKey;

                    const isPast =
                      Boolean(
                        minDate &&
                        dateKey <
                        minDate,
                      );

                    const hasMeeting =
                      meetingDateSet.has(
                        dateKey,
                      );

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        disabled={
                          isPast ||
                          isSubmitting
                        }
                        onClick={() =>
                          handleSelectDate(
                            calendarDate,
                          )
                        }
                        className="relative flex h-11 items-center justify-center"
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] transition ${isSelected
                              ? 'bg-[#31F5A0] font-semibold text-[#101211]'
                              : isPast
                                ? 'cursor-not-allowed text-[#D2D8D5]'
                                : 'text-[#303633] hover:bg-[#EAFBF4]'
                            }`}
                        >
                          {calendarDate.getDate()}
                        </span>

                        {hasMeeting &&
                          !isSelected && (
                            <span className="absolute bottom-0 h-1 w-1 rounded-full bg-[#31F5A0]" />
                          )}
                      </button>
                    );
                  },
                )}
              </div>

              <div className="mt-3 flex h-11 items-center rounded-[8px] border border-[#D7DFDC] bg-white px-3.5 text-[12px] text-[#59625F]">
                {formatKoreanDate(
                  form.date,
                )}
              </div>
            </div>

            {/* 시작 시간 */}
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#101211]">
                시작 시간
                <span className="ml-0.5 text-[#F64E42]">
                  *
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    value={
                      form.startHour
                    }
                    disabled={
                      isSubmitting
                    }
                    onChange={(
                      event,
                    ) =>
                      updateForm(
                        'startHour',
                        event.target.value,
                      )
                    }
                    className="h-11 w-full appearance-none rounded-[8px] border border-[#D7DFDC] bg-white pl-3.5 pr-8 text-[12px] text-[#59625F] outline-none transition focus:border-[#31F5A0]"
                  >
                    <option value="">
                      시
                    </option>

                    {HOUR_OPTIONS.map(
                      (hour) => (
                        <option
                          key={hour}
                          value={hour}
                        >
                          {hour}시
                        </option>
                      ),
                    )}
                  </select>

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A5AFAB]">
                    <ChevronDownIcon />
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={
                      form.startMinute
                    }
                    disabled={
                      isSubmitting
                    }
                    onChange={(
                      event,
                    ) =>
                      updateForm(
                        'startMinute',
                        event.target.value,
                      )
                    }
                    className="h-11 w-full appearance-none rounded-[8px] border border-[#D7DFDC] bg-white pl-3.5 pr-8 text-[12px] text-[#59625F] outline-none transition focus:border-[#31F5A0]"
                  >
                    <option value="">
                      분
                    </option>

                    {MINUTE_OPTIONS.map(
                      (minute) => (
                        <option
                          key={minute}
                          value={minute}
                        >
                          {minute}분
                        </option>
                      ),
                    )}
                  </select>

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A5AFAB]">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            </div>

            {/* 종료 시간 */}
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#101211]">
                종료 시간
                <span className="ml-0.5 text-[#F64E42]">
                  *
                </span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    value={
                      form.endHour
                    }
                    disabled={
                      isSubmitting
                    }
                    onChange={(
                      event,
                    ) =>
                      updateForm(
                        'endHour',
                        event.target.value,
                      )
                    }
                    className="h-11 w-full appearance-none rounded-[8px] border border-[#D7DFDC] bg-white pl-3.5 pr-8 text-[12px] text-[#59625F] outline-none transition focus:border-[#31F5A0]"
                  >
                    <option value="">
                      시
                    </option>

                    {HOUR_OPTIONS.map(
                      (hour) => (
                        <option
                          key={hour}
                          value={hour}
                        >
                          {hour}시
                        </option>
                      ),
                    )}
                  </select>

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A5AFAB]">
                    <ChevronDownIcon />
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={
                      form.endMinute
                    }
                    disabled={
                      isSubmitting
                    }
                    onChange={(
                      event,
                    ) =>
                      updateForm(
                        'endMinute',
                        event.target.value,
                      )
                    }
                    className="h-11 w-full appearance-none rounded-[8px] border border-[#D7DFDC] bg-white pl-3.5 pr-8 text-[12px] text-[#59625F] outline-none transition focus:border-[#31F5A0]"
                  >
                    <option value="">
                      분
                    </option>

                    {MINUTE_OPTIONS.map(
                      (minute) => (
                        <option
                          key={minute}
                          value={minute}
                        >
                          {minute}분
                        </option>
                      ),
                    )}
                  </select>

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A5AFAB]">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>
            </div>

            {/* 팀 선택 */}
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#101211]">
                팀 선택
                <span className="ml-0.5 text-[#F64E42]">
                  *
                </span>
              </label>

              <div className="relative">
                <div
                  className={`flex h-11 items-center rounded-[8px] border bg-white px-3.5 transition ${isTeamDropdownOpen
                      ? 'border-[#31F5A0]'
                      : 'border-[#AEB8B4]'
                    }`}
                >
                  <input
                    type="text"
                    value={
                      teamQuery
                    }
                    disabled={
                      isSubmitting
                    }
                    onFocus={() =>
                      setIsTeamDropdownOpen(
                        true,
                      )
                    }
                    onChange={(
                      event,
                    ) => {
                      setTeamQuery(
                        event.target.value,
                      );

                      setIsTeamDropdownOpen(
                        true,
                      );
                    }}
                    placeholder={
                      selectedTeam
                        ? selectedTeam.label
                        : '팀을 선택해주세요'
                    }
                    className="min-w-0 flex-1 bg-transparent text-[12px] text-[#101211] outline-none placeholder:text-[#9EA8A4]"
                  />

                  <span className="ml-2 text-[#9EA8A4]">
                    <SearchIcon />
                  </span>
                </div>

                {isTeamDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[48px] z-20 max-h-[160px] overflow-y-auto rounded-[8px] border border-[#E2E7E5] bg-white py-1 shadow-[0_8px_24px_rgba(16,18,17,0.1)]">
                    {filteredTeams.length >
                      0 ? (
                      filteredTeams.map(
                        (team) => (
                          <button
                            key={
                              team.id
                            }
                            type="button"
                            onMouseDown={(
                              event,
                            ) =>
                              event.preventDefault()
                            }
                            onClick={() =>
                              handleSelectTeam(
                                team,
                              )
                            }
                            className="flex w-full items-center px-3.5 py-2.5 text-left text-[12px] text-[#303633] transition hover:bg-[#F0FBF6]"
                          >
                            {team.label}
                          </button>
                        ),
                      )
                    ) : (
                      <p className="px-3.5 py-3 text-[11px] text-[#9EA8A4]">
                        검색 결과가 없습니다.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {selectedTeam && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-[5px] bg-[#EDF1EF] px-2.5 py-1.5 text-[11px] font-medium text-[#59625F]">
                    {selectedTeam.label}

                    <button
                      type="button"
                      disabled={
                        isSubmitting
                      }
                      onClick={
                        handleRemoveTeam
                      }
                      className="text-[#8D9793]"
                      aria-label="선택한 팀 제거"
                    >
                      <CloseIcon
                        size={10}
                      />
                    </button>
                  </span>
                </div>
              )}
            </div>

            {(errorMessage ||
              submitError) && (
                <div className="rounded-[8px] bg-[#FFF0EE] px-3.5 py-3">
                  <p className="text-[12px] leading-[1.5] text-[#F64E42]">
                    {errorMessage ||
                      submitError}
                  </p>
                </div>
              )}
          </div>
        </div>

        <div className="border-t border-[#EEF2F0] bg-white px-7 py-4">
          <button
            type="submit"
            disabled={
              !isFormFilled ||
              isSubmitting
            }
            className={`h-12 w-full rounded-[8px] text-[13px] font-semibold transition ${isFormFilled &&
                !isSubmitting
                ? 'bg-[#31F5A0] text-[#101211] hover:brightness-[0.97] active:scale-[0.995]'
                : 'cursor-not-allowed bg-[#DDE7E2] text-[#9AA5A0]'
              }`}
          >
            {isSubmitting
              ? '예약 중...'
              : '예약하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MeetingReservationModal;
