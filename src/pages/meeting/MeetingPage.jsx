import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  createMeeting,
  endMeeting,
  getMeetings,
  startMeeting,
} from '../../api/meetingApi';

import { getMyTeams } from '../../api/teams';

import MeetingCalendar from '../../components/feature/meeting/MeetingCalendar';
import MeetingReservationModal from '../../components/feature/meeting/MeetingReservationModal';
import MeetingScheduleList from '../../components/feature/meeting/MeetingScheduleList';
import MeetingStatusBanner from '../../components/feature/meeting/MeetingStatusBanner';

import useCurrentDateTime from '../../hooks/useCurrentDateTime';

import { formatDateKey } from '../../utils/date';

function VideoIcon() {
  return (
    <svg
      width="25"
      height="25"
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
        d="M16 10L20.5 7.5V16.5L16 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7.5C3 6.11929 4.11929 5 5.5 5H9L11 7H18.5C19.8807 7 21 8.11929 21 9.5V17.5C21 18.8807 19.8807 20 18.5 20H5.5C4.11929 20 3 18.8807 3 17.5V7.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M8 11H16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const QUICK_ACTIONS = [
  {
    id: 'meeting',
    icon: <VideoIcon />,
  },
  {
    id: 'reserve',
    label: '예약하기',
    icon: <PlusIcon />,
  },
  {
    id: 'records',
    label: '회의록',
    icon: <FolderIcon />,
  },
];

const WEEK_DAYS = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

function getLocalDateKey(date) {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    date.getDate(),
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getLocalTime(date) {
  const hours = String(
    date.getHours(),
  ).padStart(2, '0');

  const minutes = String(
    date.getMinutes(),
  ).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function parseMeetingDateTime(value) {
  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return null;
  }

  return date;
}

function isSameLocalDate(
  firstDate,
  secondDate,
) {
  return (
    getLocalDateKey(firstDate) ===
    getLocalDateKey(secondDate)
  );
}

function isPastScheduledEnd(
  meeting,
  compareDate = new Date(),
) {
  const scheduledEnd =
    parseMeetingDateTime(
      meeting?.scheduledEndAt,
    );

  if (!scheduledEnd) {
    return false;
  }

  return (
    compareDate.getTime() >
    scheduledEnd.getTime()
  );
}

function isMeetingStartable(
  meeting,
  compareDate,
) {
  if (
    meeting?.status !==
    'SCHEDULED'
  ) {
    return false;
  }

  const scheduledStart =
    parseMeetingDateTime(
      meeting.scheduledStartAt,
    );

  const scheduledEnd =
    parseMeetingDateTime(
      meeting.scheduledEndAt,
    );

  if (!scheduledStart) {
    return false;
  }

  if (
    compareDate.getTime() <
    scheduledStart.getTime()
  ) {
    return false;
  }

  if (scheduledEnd) {
    return (
      compareDate.getTime() <=
      scheduledEnd.getTime()
    );
  }

  return isSameLocalDate(
    compareDate,
    scheduledStart,
  );
}

function formatServerMeeting(
  meeting,
  team,
) {
  const scheduledStart =
    parseMeetingDateTime(
      meeting.scheduledStartAt,
    );

  const scheduledEnd =
    parseMeetingDateTime(
      meeting.scheduledEndAt,
    );

  return {
    ...meeting,

    id: meeting.meetingId,

    teamId: meeting.teamId,

    project:
      team?.projectName ?? '',

    team:
      team?.name ?? '팀',

    description:
      meeting.agenda ?? '',

    date: scheduledStart
      ? getLocalDateKey(
        scheduledStart,
      )
      : '',

    startTime: scheduledStart
      ? getLocalTime(
        scheduledStart,
      )
      : '',

    endTime: scheduledEnd
      ? getLocalTime(
        scheduledEnd,
      )
      : '',
  };
}

function toScheduledDateTime(
  date,
  time,
) {
  if (!date || !time) {
    return undefined;
  }

  return `${date}T${time}:00`;
}

function MeetingPage() {
  const navigate =
    useNavigate();

  const now =
    useCurrentDateTime();

  const [
    teams,
    setTeams,
  ] = useState([]);

  const [
    meetings,
    setMeetings,
  ] = useState([]);

  const [
    isLoadingMeetings,
    setIsLoadingMeetings,
  ] = useState(true);

  const [
    meetingLoadError,
    setMeetingLoadError,
  ] = useState('');

  const [
    isReservationModalOpen,
    setIsReservationModalOpen,
  ] = useState(false);

  const [
    isCreatingMeeting,
    setIsCreatingMeeting,
  ] = useState(false);

  const [
    reservationError,
    setReservationError,
  ] = useState('');

  const [
    startingMeetingId,
    setStartingMeetingId,
  ] = useState(null);

  const [
    startMeetingError,
    setStartMeetingError,
  ] = useState('');

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    () => new Date(),
  );

  const [
    viewDate,
    setViewDate,
  ] = useState(
    () =>
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      ),
  );

  const [
    selectedFilter,
    setSelectedFilter,
  ] = useState('ALL');

  const loadMeetings =
    useCallback(async () => {
      try {
        setIsLoadingMeetings(
          true,
        );

        setMeetingLoadError(
          '',
        );

        const nextTeams =
          await getMyTeams();

        setTeams(nextTeams);

        if (
          nextTeams.length === 0
        ) {
          setMeetings([]);

          return;
        }

        const meetingResponses =
          await Promise.all(
            nextTeams.map(
              (team) =>
                getMeetings(
                  team.teamId,
                ),
            ),
          );

        let nextMeetings =
          meetingResponses.flatMap(
            (
              teamMeetings,
              index,
            ) => {
              const team =
                nextTeams[index];

              return teamMeetings.map(
                (meeting) =>
                  formatServerMeeting(
                    meeting,
                    team,
                  ),
              );
            },
          );

        /*
         * 사용자가 "나가기"만 하고 회의 전체 종료를 누르지 않은 경우
         * 서버에 IN_PROGRESS가 남을 수 있다.
         *
         * 프론트에서 별도 백엔드 수정 없이 처리하기 위해
         * 예약 종료 시간이 지난 IN_PROGRESS 회의는
         * 기존 endMeeting API를 호출해 정리한다.
         */
        const cleanupTargetMeetings =
          nextMeetings.filter(
            (meeting) =>
              meeting.status ===
              'IN_PROGRESS' &&
              isPastScheduledEnd(
                meeting,
              ),
          );

        if (
          cleanupTargetMeetings.length >
          0
        ) {
          const cleanupResults =
            await Promise.allSettled(
              cleanupTargetMeetings.map(
                (meeting) =>
                  endMeeting(
                    meeting.meetingId,
                  ),
              ),
            );

          const successfullyEndedIds =
            new Set();

          cleanupResults.forEach(
            (
              result,
              index,
            ) => {
              const targetMeeting =
                cleanupTargetMeetings[
                index
                ];

              if (
                result.status ===
                'fulfilled'
              ) {
                successfullyEndedIds.add(
                  Number(
                    targetMeeting.meetingId,
                  ),
                );

                return;
              }

              console.error(
                'Failed to cleanup expired meeting:',
                targetMeeting.meetingId,
                result.reason,
              );
            },
          );

          if (
            successfullyEndedIds.size >
            0
          ) {
            const endedAt =
              new Date().toISOString();

            nextMeetings =
              nextMeetings.map(
                (meeting) => {
                  if (
                    !successfullyEndedIds.has(
                      Number(
                        meeting.meetingId,
                      ),
                    )
                  ) {
                    return meeting;
                  }

                  return {
                    ...meeting,
                    status:
                      'ENDED',
                    endedAt:
                      meeting.endedAt ??
                      endedAt,
                  };
                },
              );
          }
        }

        nextMeetings.sort(
          (
            meetingA,
            meetingB,
          ) => {
            const startA =
              parseMeetingDateTime(
                meetingA.scheduledStartAt,
              );

            const startB =
              parseMeetingDateTime(
                meetingB.scheduledStartAt,
              );

            if (
              !startA &&
              !startB
            ) {
              return 0;
            }

            if (!startA) {
              return 1;
            }

            if (!startB) {
              return -1;
            }

            return (
              startA.getTime() -
              startB.getTime()
            );
          },
        );

        setMeetings(
          nextMeetings,
        );
      } catch (error) {
        console.error(
          'Failed to load meetings:',
          error,
        );

        setMeetingLoadError(
          error?.response?.data
            ?.message ??
          '회의 정보를 불러오지 못했습니다.',
        );
      } finally {
        setIsLoadingMeetings(
          false,
        );
      }
    }, []);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  /*
   * 서버 상태가 IN_PROGRESS여도
   * 예약 종료 시간이 이미 지났다면
   * 상단 진행중 배너에서는 제외한다.
   */
  const currentMeeting =
    meetings.find(
      (meeting) =>
        meeting.status ===
        'IN_PROGRESS' &&
        !isPastScheduledEnd(
          meeting,
          now,
        ),
    );

  const hasActiveMeeting =
    Boolean(
      currentMeeting,
    );

  const startableMeeting =
    hasActiveMeeting
      ? null
      : meetings.find(
        (meeting) =>
          isMeetingStartable(
            meeting,
            now,
          ),
      );

  const latestEndedMeeting =
    [...meetings]
      .filter(
        (meeting) =>
          meeting.status ===
          'ENDED',
      )
      .sort(
        (
          meetingA,
          meetingB,
        ) => {
          const timeA =
            new Date(
              meetingA.endedAt ||
              meetingA.scheduledEndAt ||
              meetingA.scheduledStartAt ||
              0,
            ).getTime();

          const timeB =
            new Date(
              meetingB.endedAt ||
              meetingB.scheduledEndAt ||
              meetingB.scheduledStartAt ||
              0,
            ).getTime();

          return timeB - timeA;
        },
      )[0] ?? null;

  const filterOptions = [
    {
      id: 'ALL',
      label: '전체',
    },

    ...teams.map(
      (team) => ({
        id: `TEAM-${team.teamId}`,

        label:
          team.name,

        teamId:
          team.teamId,

        team:
          team.name,

        project:
          team.projectName ??
          '',
      }),
    ),
  ];

  const filteredMeetings =
    selectedFilter === 'ALL'
      ? meetings
      : meetings.filter(
        (meeting) =>
          `TEAM-${meeting.teamId}` ===
          selectedFilter,
      );

  const selectedDateKey =
    formatDateKey(
      selectedDate,
    );

  const selectedMeetings =
    filteredMeetings.filter(
      (meeting) =>
        meeting.date ===
        selectedDateKey,
    );

  const hours =
    now.getHours();

  const minutes = String(
    now.getMinutes(),
  ).padStart(2, '0');

  const period =
    hours >= 12
      ? 'pm'
      : 'am';

  const displayHour =
    hours % 12 || 12;

  const month = String(
    now.getMonth() + 1,
  ).padStart(2, '0');

  const date = String(
    now.getDate(),
  ).padStart(2, '0');

  const day =
    WEEK_DAYS[
    now.getDay()
    ];

  const handleJoinMeeting =
    (meeting) => {
      if (!meeting) {
        return;
      }

      if (
        isPastScheduledEnd(
          meeting,
          now,
        )
      ) {
        setStartMeetingError(
          '이미 종료 시간이 지난 회의입니다.',
        );

        return;
      }

      navigate(
        `/meetings/${meeting.meetingId}/room`,
        {
          state: {
            meeting,
          },
        },
      );
    };

  const handleStartMeeting =
    async (meeting) => {
      if (
        !meeting ||
        startingMeetingId
      ) {
        return;
      }

      if (
        hasActiveMeeting
      ) {
        setStartMeetingError(
          '진행 중인 회의를 먼저 종료해주세요.',
        );

        return;
      }

      const scheduledStart =
        parseMeetingDateTime(
          meeting.scheduledStartAt,
        );

      const scheduledEnd =
        parseMeetingDateTime(
          meeting.scheduledEndAt,
        );

      if (
        !scheduledStart
      ) {
        setStartMeetingError(
          '회의 시작 시간을 확인할 수 없습니다.',
        );

        return;
      }

      if (
        now.getTime() <
        scheduledStart.getTime()
      ) {
        setStartMeetingError(
          '아직 회의 시작 시간이 되지 않았습니다.',
        );

        return;
      }

      if (
        scheduledEnd &&
        now.getTime() >
        scheduledEnd.getTime()
      ) {
        setStartMeetingError(
          '회의 예약 종료 시간이 지났습니다.',
        );

        return;
      }

      if (
        !scheduledEnd &&
        !isSameLocalDate(
          now,
          scheduledStart,
        )
      ) {
        setStartMeetingError(
          '이미 종료된 예약 회의입니다.',
        );

        return;
      }

      try {
        setStartingMeetingId(
          meeting.meetingId,
        );

        setStartMeetingError(
          '',
        );

        const response =
          await startMeeting(
            meeting.meetingId,
          );

        const startedMeeting = {
          ...meeting,

          status:
            'IN_PROGRESS',

          roomName:
            response?.result
              ?.roomName ??
            meeting.roomName,

          roomUrl:
            response?.result
              ?.roomUrl ??
            meeting.roomUrl,
        };

        navigate(
          `/meetings/${meeting.meetingId}/room`,
          {
            state: {
              meeting:
                startedMeeting,
            },
          },
        );
      } catch (error) {
        console.error(
          'Failed to start meeting:',
          error,
        );

        setStartMeetingError(
          error?.response?.data
            ?.message ??
          '회의를 시작하지 못했습니다.',
        );

        await loadMeetings();
      } finally {
        setStartingMeetingId(
          null,
        );
      }
    };

  const handleOpenSummary =
    (meeting) => {
      if (!meeting) {
        return;
      }

      navigate(
        `/meetings/${meeting.meetingId}/record`,
      );
    };

  const handleMeetingQuickAction =
    () => {
      if (currentMeeting) {
        handleJoinMeeting(
          currentMeeting,
        );

        return;
      }

      if (startableMeeting) {
        handleStartMeeting(
          startableMeeting,
        );
      }
    };

  const handleQuickAction =
    (actionId) => {
      if (
        actionId ===
        'meeting'
      ) {
        handleMeetingQuickAction();

        return;
      }

      if (
        actionId ===
        'reserve'
      ) {
        setReservationError(
          '',
        );

        setIsReservationModalOpen(
          true,
        );

        return;
      }

      if (
        actionId ===
        'records' &&
        latestEndedMeeting
      ) {
        handleOpenSummary(
          latestEndedMeeting,
        );
      }
    };

  const handleReserveMeeting =
    async (
      reservation,
    ) => {
      try {
        setIsCreatingMeeting(
          true,
        );

        setReservationError(
          '',
        );

        const scheduledStartAt =
          toScheduledDateTime(
            reservation.date,
            reservation.startTime,
          );

        const scheduledEndAt =
          toScheduledDateTime(
            reservation.date,
            reservation.endTime,
          );

        await createMeeting({
          teamId:
            reservation.teamId,

          title:
            reservation.title,

          agenda:
            reservation.agenda,

          scheduledStartAt,

          scheduledEndAt,
        });

        const [
          year,
          reservationMonth,
          reservationDate,
        ] = reservation.date
          .split('-')
          .map(Number);

        setSelectedDate(
          new Date(
            year,
            reservationMonth - 1,
            reservationDate,
          ),
        );

        setViewDate(
          new Date(
            year,
            reservationMonth - 1,
            1,
          ),
        );

        setSelectedFilter(
          `TEAM-${reservation.teamId}`,
        );

        setIsReservationModalOpen(
          false,
        );

        await loadMeetings();
      } catch (error) {
        console.error(
          'Failed to create meeting:',
          error,
        );

        setReservationError(
          error?.response?.data
            ?.message ??
          '회의 예약에 실패했습니다.',
        );
      } finally {
        setIsCreatingMeeting(
          false,
        );
      }
    };

  const handleCloseReservationModal =
    () => {
      if (
        isCreatingMeeting
      ) {
        return;
      }

      setReservationError(
        '',
      );

      setIsReservationModalOpen(
        false,
      );
    };

  const meetingActionLabel =
    currentMeeting
      ? '참여하기'
      : startableMeeting
        ? '시작하기'
        : '참여하기';

  const hasAvailableMeeting =
    Boolean(
      currentMeeting ||
      startableMeeting,
    );

  const isStartingAnyMeeting =
    startingMeetingId !==
    null;

  return (
    <>
      <div className="h-full w-full overflow-y-auto pb-6">
        {currentMeeting && (
          <div className="mb-3">
            <MeetingStatusBanner
              meeting={
                currentMeeting
              }
              onJoin={() =>
                handleJoinMeeting(
                  currentMeeting,
                )
              }
            />
          </div>
        )}

        <div className="grid min-h-[610px] grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.85fr)_minmax(390px,1fr)]">
          <section className="flex min-h-[610px] items-center justify-center rounded-[12px] bg-white px-8 py-12">
            <div className="flex flex-col items-center">
              <div className="text-center">
                <div className="flex items-end justify-center">
                  <strong className="text-[38px] font-semibold leading-none tracking-[-0.04em] text-[#101211]">
                    {displayHour}:
                    {minutes}
                  </strong>

                  <span className="ml-1 text-[23px] font-semibold leading-none text-[#101211]">
                    {period}
                  </span>
                </div>

                <p className="mt-4 text-[17px] font-medium text-[#A1AAA6]">
                  {month}. {date}{' '}
                  {day}
                </p>
              </div>

              <div className="mt-9 flex items-start gap-6">
                {QUICK_ACTIONS.map(
                  (action) => {
                    const isMeetingAction =
                      action.id ===
                      'meeting';

                    const isReserveAction =
                      action.id ===
                      'reserve';

                    const isRecordAction =
                      action.id ===
                      'records';

                    const isMeetingAvailable =
                      isMeetingAction &&
                      hasAvailableMeeting;

                    const isDisabled =
                      (isMeetingAction &&
                        (isLoadingMeetings ||
                          !hasAvailableMeeting ||
                          isStartingAnyMeeting)) ||
                      (isReserveAction &&
                        (isLoadingMeetings ||
                          teams.length ===
                          0)) ||
                      (isRecordAction &&
                        !latestEndedMeeting);

                    const actionLabel =
                      isMeetingAction
                        ? isStartingAnyMeeting
                          ? '시작 중'
                          : meetingActionLabel
                        : action.label;

                    return (
                      <button
                        key={
                          action.id
                        }
                        type="button"
                        disabled={
                          isDisabled
                        }
                        onClick={() =>
                          handleQuickAction(
                            action.id,
                          )
                        }
                        className={`group flex min-w-[64px] flex-col items-center gap-3 ${isDisabled
                          ? 'cursor-not-allowed'
                          : 'cursor-pointer'
                          }`}
                      >
                        <span
                          className={`flex h-[56px] w-[56px] items-center justify-center rounded-[18px] transition ${isDisabled
                            ? 'bg-[#E7ECEA] text-[#B1BAB6]'
                            : isMeetingAvailable
                              ? 'bg-[#31F5A0] text-[#101211] hover:brightness-[0.97]'
                              : 'bg-[#101211] text-white hover:bg-[#252A28]'
                            }`}
                        >
                          {
                            action.icon
                          }
                        </span>

                        <span
                          className={`text-[12px] font-medium ${isDisabled
                            ? 'text-[#AAB3AF]'
                            : 'text-[#303633]'
                            }`}
                        >
                          {
                            actionLabel
                          }
                        </span>
                      </button>
                    );
                  },
                )}
              </div>

              {(meetingLoadError ||
                startMeetingError) && (
                  <p className="mt-6 text-[12px] text-[#F64E42]">
                    {meetingLoadError ||
                      startMeetingError}
                  </p>
                )}
            </div>
          </section>

          <section className="min-h-[610px] rounded-[12px] bg-white px-7 py-7">
            <MeetingCalendar
              selectedDate={
                selectedDate
              }
              onSelectDate={
                setSelectedDate
              }
              viewDate={
                viewDate
              }
              onChangeViewDate={
                setViewDate
              }
              meetings={
                filteredMeetings
              }
              filterOptions={
                filterOptions
              }
              selectedFilter={
                selectedFilter
              }
              onChangeFilter={
                setSelectedFilter
              }
            />

            <MeetingScheduleList
              meetings={
                selectedMeetings
              }
              selectedDate={
                selectedDate
              }
              now={now}
              onStart={
                handleStartMeeting
              }
              onJoin={
                handleJoinMeeting
              }
              onOpenSummary={
                handleOpenSummary
              }
              startingMeetingId={
                startingMeetingId
              }
              hasActiveMeeting={
                hasActiveMeeting
              }
            />
          </section>
        </div>
      </div>

      <MeetingReservationModal
        isOpen={
          isReservationModalOpen
        }
        onClose={
          handleCloseReservationModal
        }
        onReserve={
          handleReserveMeeting
        }
        filterOptions={
          filterOptions
        }
        defaultDate={formatDateKey(
          selectedDate,
        )}
        minDate={formatDateKey(
          new Date(),
        )}
        meetings={
          meetings
        }
        isSubmitting={
          isCreatingMeeting
        }
        submitError={
          reservationError
        }
      />
    </>
  );
}

export default MeetingPage;
