import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  createMeeting,
  getMeetings,
} from '../../api/meetingApi';

import { getMyTeams } from '../../api/teamApi';

import MeetingCalendar from '../../components/feature/meeting/MeetingCalendar';
import MeetingReservationModal from '../../components/feature/meeting/MeetingReservationModal';
import MeetingScheduleList from '../../components/feature/meeting/MeetingScheduleList';
import MeetingStatusBanner from '../../components/feature/meeting/MeetingStatusBanner';

import useCurrentDateTime from '../../hooks/useCurrentDateTime';

import { formatDateKey } from '../../utils/date';

function VideoIcon() {
  return (
    <svg
      width="22"
      height="22"
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
      width="24"
      height="24"
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
      width="22"
      height="22"
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
    </svg>
  );
}

const quickActions = [
  {
    id: 'join',
    label: '참여하기',
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

function formatServerMeeting(
  meeting,
  team,
) {
  const scheduledStartAt =
    meeting.scheduledStartAt ?? '';

  const scheduledEndAt =
    meeting.scheduledEndAt ?? '';

  return {
    ...meeting,

    id: meeting.meetingId,
    teamId: meeting.teamId,

    project: '',
    team: team?.name ?? '팀',

    description: meeting.agenda ?? '',

    date: scheduledStartAt
      ? scheduledStartAt.slice(0, 10)
      : '',

    startTime: scheduledStartAt
      ? scheduledStartAt.slice(11, 16)
      : '',

    endTime: scheduledEndAt
      ? scheduledEndAt.slice(11, 16)
      : '',
  };
}

function toScheduledDateTime(
  date,
  time,
) {
  return `${date}T${time}:00`;
}

function MeetingPage() {
  const navigate = useNavigate();

  const now = useCurrentDateTime();

  const [teams, setTeams] = useState([]);

  const [meetings, setMeetings] = useState([]);

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

  const [selectedDate, setSelectedDate] =
    useState(() => new Date());

  const [viewDate, setViewDate] = useState(
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

  const loadMeetings = useCallback(async () => {
    try {
      setIsLoadingMeetings(true);
      setMeetingLoadError('');

      const teamResponse =
        await getMyTeams();

      const nextTeams =
        teamResponse?.result ?? [];

      setTeams(nextTeams);

      if (nextTeams.length === 0) {
        setMeetings([]);
        return;
      }

      const meetingResponses =
        await Promise.all(
          nextTeams.map((team) =>
            getMeetings(team.teamId),
          ),
        );

      const nextMeetings =
        meetingResponses.flatMap(
          (response, index) => {
            const team =
              nextTeams[index];

            return (
              response?.result ?? []
            ).map((meeting) =>
              formatServerMeeting(
                meeting,
                team,
              ),
            );
          },
        );

      nextMeetings.sort(
        (meetingA, meetingB) => {
          const dateTimeA =
            `${meetingA.date} ${meetingA.startTime}`;

          const dateTimeB =
            `${meetingB.date} ${meetingB.startTime}`;

          return dateTimeA.localeCompare(
            dateTimeB,
          );
        },
      );

      setMeetings(nextMeetings);
    } catch (error) {
      console.error(
        'Failed to load meetings:',
        error,
      );

      setMeetingLoadError(
        error?.response?.data?.message ??
        '회의 정보를 불러오지 못했습니다.',
      );
    } finally {
      setIsLoadingMeetings(false);
    }
  }, []);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  /*
   * 현재 실제 진행 중인 회의
   */
  const currentMeeting =
    meetings.find(
      (meeting) =>
        meeting.status ===
        'IN_PROGRESS',
    );

  /*
   * 팀 필터
   */
  const filterOptions = [
    {
      id: 'ALL',
      label: '전체',
    },

    ...teams.map((team) => ({
      id: `TEAM-${team.teamId}`,
      label: team.name,
      teamId: team.teamId,
      team: team.name,
      project: '',
    })),
  ];

  /*
   * 선택된 팀 필터
   */
  const filteredMeetings =
    selectedFilter === 'ALL'
      ? meetings
      : meetings.filter(
        (meeting) =>
          `TEAM-${meeting.teamId}` ===
          selectedFilter,
      );

  /*
   * 선택 날짜 회의
   */
  const selectedDateKey =
    formatDateKey(selectedDate);

  const selectedMeetings =
    filteredMeetings.filter(
      (meeting) =>
        meeting.date ===
        selectedDateKey,
    );

  /*
   * 현재 시간
   */
  const hours = now.getHours();

  const minutes = String(
    now.getMinutes(),
  ).padStart(2, '0');

  const period =
    hours >= 12 ? 'pm' : 'am';

  const displayHour =
    hours % 12 || 12;

  /*
   * 현재 날짜
   */
  const month = String(
    now.getMonth() + 1,
  ).padStart(2, '0');

  const date = String(
    now.getDate(),
  ).padStart(2, '0');

  const day =
    WEEK_DAYS[now.getDay()];

  /*
   * 진행 중 회의 참여
   */
  const handleJoinMeeting = () => {
    if (!currentMeeting) {
      return;
    }

    navigate(
      `/meetings/${currentMeeting.meetingId}/room`,
      {
        state: {
          meeting:
            currentMeeting,
        },
      },
    );
  };

  const handleQuickAction = (
    actionId,
  ) => {
    if (actionId === 'join') {
      handleJoinMeeting();
      return;
    }

    if (actionId === 'reserve') {
      setReservationError('');

      setIsReservationModalOpen(
        true,
      );

      return;
    }

    if (actionId === 'records') {
      return;
    }
  };

  /*
   * 실제 회의 예약
   */
  const handleReserveMeeting =
    async (reservation) => {
      try {
        setIsCreatingMeeting(true);
        setReservationError('');

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
          teamId: reservation.teamId,
          title: reservation.title,
          agenda: reservation.agenda,
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
          error?.response?.data?.message ??
          '회의 예약에 실패했습니다.',
        );
      } finally {
        setIsCreatingMeeting(false);
      }
    };

  const handleCloseReservationModal =
    () => {
      if (isCreatingMeeting) {
        return;
      }

      setReservationError('');

      setIsReservationModalOpen(
        false,
      );
    };

  return (
    <>
      <div className="h-full w-full overflow-y-auto pb-8">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold text-[#101211]">
            회의하기
          </h1>
        </header>

        {currentMeeting && (
          <MeetingStatusBanner
            meeting={
              currentMeeting
            }
            onJoin={
              handleJoinMeeting
            }
          />
        )}

        <section
          className={`rounded-2xl bg-white p-6 ${currentMeeting
            ? 'mt-4'
            : ''
            }`}
        >
          <div className="grid min-h-[520px] grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.15fr]">
            <div className="flex items-center justify-center xl:border-r xl:border-[#EDF0EF]">
              <div className="w-full max-w-[360px]">
                <div className="mb-7">
                  <div className="flex items-end gap-1">
                    <p className="text-[32px] font-semibold leading-none text-[#101211]">
                      {displayHour}:
                      {minutes}
                    </p>

                    <span className="text-lg font-medium leading-none text-[#101211]">
                      {period}
                    </span>
                  </div>

                  <p className="mt-3 text-base text-[#8C9692]">
                    {month}. {date}{' '}
                    {day}
                  </p>
                </div>

                <div className="flex gap-4">
                  {quickActions.map(
                    (action) => {
                      const isJoinAction =
                        action.id ===
                        'join';

                      const isReserveAction =
                        action.id ===
                        'reserve';

                      const isDisabled =
                        (isJoinAction &&
                          (isLoadingMeetings ||
                            !currentMeeting)) ||
                        (isReserveAction &&
                          (isLoadingMeetings ||
                            teams.length ===
                            0));

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
                          className={`group flex flex-col items-center gap-2 ${isDisabled
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer'
                            }`}
                        >
                          <span
                            className={`flex h-12 w-12 items-center justify-center rounded-full transition ${isDisabled
                              ? 'bg-[#E4E9E7] text-[#A7B0AC]'
                              : 'bg-[#101211] text-white group-hover:-translate-y-0.5'
                              }`}
                          >
                            {
                              action.icon
                            }
                          </span>

                          <span
                            className={`text-xs font-medium ${isDisabled
                              ? 'text-[#A7B0AC]'
                              : 'text-[#303633]'
                              }`}
                          >
                            {
                              action.label
                            }
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>

                {isLoadingMeetings ? (
                  <p className="mt-4 text-xs text-[#8A9490]">
                    회의 정보를
                    확인하고 있습니다.
                  </p>
                ) : meetingLoadError ? (
                  <p className="mt-4 text-xs text-[#F64E42]">
                    {
                      meetingLoadError
                    }
                  </p>
                ) : teams.length ===
                  0 ? (
                  <p className="mt-4 text-xs text-[#8A9490]">
                    참여 중인 팀이
                    없습니다.
                  </p>
                ) : !currentMeeting ? (
                  <p className="mt-4 text-xs text-[#8A9490]">
                    현재 참여할 수
                    있는 회의가
                    없습니다.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="min-w-0">
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
              />
            </div>
          </div>
        </section>
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
        meetings={meetings}
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
