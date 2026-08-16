import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { createMeeting, getMeetings, startMeeting } from '../../api/meetingApi';

import { getMyTeams } from '../../api/teams';

import MeetingCalendar from '../../components/feature/meeting/MeetingCalendar';
import MeetingHistoryModal from '../../components/feature/meeting/MeetingHistoryModal';
import MeetingReservationModal from '../../components/feature/meeting/MeetingReservationModal';
import MeetingScheduleList from '../../components/feature/meeting/MeetingScheduleList';
import MeetingStatusBanner from '../../components/feature/meeting/MeetingStatusBanner';

import useCurrentDateTime from '../../hooks/useCurrentDateTime';

import { formatDateKey } from '../../utils/date';

function VideoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="13" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />

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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

const WEEK_DAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function getLocalDateKey(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getLocalTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');

  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function parseMeetingDateTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function formatServerMeeting(meeting, team) {
  const scheduledStart = parseMeetingDateTime(meeting.scheduledStartAt);

  const scheduledEnd = parseMeetingDateTime(meeting.scheduledEndAt);

  return {
    ...meeting,

    id: meeting.meetingId,

    teamId: meeting.teamId,

    project: '',

    team: team?.name ?? '팀',

    description: meeting.agenda ?? '',

    date: scheduledStart ? getLocalDateKey(scheduledStart) : '',

    startTime: scheduledStart ? getLocalTime(scheduledStart) : '',

    endTime: scheduledEnd ? getLocalTime(scheduledEnd) : '',
  };
}

function toScheduledDateTime(date, time) {
  return `${date}T${time}:00`;
}

function MeetingPage() {
  const navigate = useNavigate();

  const now = useCurrentDateTime();

  const [teams, setTeams] = useState([]);

  const [meetings, setMeetings] = useState([]);

  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true);

  const [meetingLoadError, setMeetingLoadError] = useState('');

  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);

  const [reservationError, setReservationError] = useState('');

  const [startingMeetingId, setStartingMeetingId] = useState(null);

  const [startMeetingError, setStartMeetingError] = useState('');

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [viewDate, setViewDate] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const [selectedFilter, setSelectedFilter] = useState('ALL');

  /*
   * 팀 + 회의 목록 조회
   */
  const loadMeetings = useCallback(async () => {
    try {
      setIsLoadingMeetings(true);

      setMeetingLoadError('');

      const nextTeams = await getMyTeams();

      setTeams(nextTeams);

      if (nextTeams.length === 0) {
        setMeetings([]);
        return;
      }

      const meetingResponses = await Promise.all(nextTeams.map((team) => getMeetings(team.teamId)));

      const nextMeetings = meetingResponses.flatMap((teamMeetings, index) => {
        const team = nextTeams[index];

        return teamMeetings.map((meeting) => formatServerMeeting(meeting, team));
      });

      nextMeetings.sort((meetingA, meetingB) => {
        const startA = parseMeetingDateTime(meetingA.scheduledStartAt);

        const startB = parseMeetingDateTime(meetingB.scheduledStartAt);

        if (!startA && !startB) {
          return 0;
        }

        if (!startA) {
          return 1;
        }

        if (!startB) {
          return -1;
        }

        return startA.getTime() - startB.getTime();
      });

      setMeetings(nextMeetings);
    } catch (error) {
      console.error('Failed to load meetings:', error);

      setMeetingLoadError(error?.response?.data?.message ?? '회의 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoadingMeetings(false);
    }
  }, []);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  /*
   * 현재 진행 중인 회의
   *
   * 하나라도 IN_PROGRESS가 있으면
   * 다른 SCHEDULED 회의는 시작하지 않는다.
   */
  const currentMeeting = meetings.find((meeting) => meeting.status === 'IN_PROGRESS');

  const hasActiveMeeting = Boolean(currentMeeting);

  /*
   * 시작 가능한 회의
   *
   * 예정 시작 시간이 지났고
   * 현재 진행 중인 회의가 없으면 가능.
   *
   * scheduledEndAt은 사용하지 않는다.
   */
  const startableMeeting = hasActiveMeeting
    ? null
    : meetings.find((meeting) => {
        if (meeting.status !== 'SCHEDULED') {
          return false;
        }

        const scheduledStart = parseMeetingDateTime(meeting.scheduledStartAt);

        if (!scheduledStart) {
          return false;
        }

        return now.getTime() >= scheduledStart.getTime();
      });

  /*
   * 종료된 회의
   */
  const endedMeetings = meetings.filter((meeting) => meeting.status === 'ENDED');

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

  const filteredMeetings =
    selectedFilter === 'ALL'
      ? meetings
      : meetings.filter((meeting) => `TEAM-${meeting.teamId}` === selectedFilter);

  const selectedDateKey = formatDateKey(selectedDate);

  const selectedMeetings = filteredMeetings.filter((meeting) => meeting.date === selectedDateKey);

  /*
   * 현재 시각 표시
   */
  const hours = now.getHours();

  const minutes = String(now.getMinutes()).padStart(2, '0');

  const period = hours >= 12 ? 'pm' : 'am';

  const displayHour = hours % 12 || 12;

  const month = String(now.getMonth() + 1).padStart(2, '0');

  const date = String(now.getDate()).padStart(2, '0');

  const day = WEEK_DAYS[now.getDay()];

  /*
   * 진행 중 회의 참여
   */
  const handleJoinMeeting = (meeting) => {
    if (!meeting) {
      return;
    }

    navigate(`/meetings/${meeting.meetingId}/room`, {
      state: {
        meeting,
      },
    });
  };

  /*
   * 예약 회의 시작
   */
  const handleStartMeeting = async (meeting) => {
    if (!meeting || startingMeetingId) {
      return;
    }

    /*
     * 다른 회의가 진행 중이면
     * 프론트에서도 시작 요청 차단
     */
    if (hasActiveMeeting) {
      setStartMeetingError('진행 중인 회의를 먼저 종료해주세요.');

      return;
    }

    const scheduledStart = parseMeetingDateTime(meeting.scheduledStartAt);

    if (!scheduledStart || now.getTime() < scheduledStart.getTime()) {
      setStartMeetingError('아직 회의 시작 시간이 되지 않았습니다.');

      return;
    }

    try {
      setStartingMeetingId(meeting.meetingId);

      setStartMeetingError('');

      const response = await startMeeting(meeting.meetingId);

      const startedMeeting = {
        ...meeting,

        status: 'IN_PROGRESS',

        roomName: response?.result?.roomName ?? meeting.roomName,

        roomUrl: response?.result?.roomUrl ?? meeting.roomUrl,
      };

      navigate(`/meetings/${meeting.meetingId}/room`, {
        state: {
          meeting: startedMeeting,
        },
      });
    } catch (error) {
      console.error('Failed to start meeting:', error);

      setStartMeetingError(error?.response?.data?.message ?? '회의를 시작하지 못했습니다.');

      /*
       * 다른 사용자가 먼저 시작했을 수도
       * 있으므로 서버 목록 재조회
       */
      await loadMeetings();
    } finally {
      setStartingMeetingId(null);
    }
  };

  /*
   * 회의록 상세
   */
  const handleOpenSummary = (meeting) => {
    if (!meeting) {
      return;
    }

    setIsHistoryModalOpen(false);

    navigate(`/meetings/${meeting.meetingId}/summary`);
  };

  /*
   * 빠른 회의 액션
   *
   * 진행 중 회의가 있으면 참여,
   * 없고 시작 가능한 회의가 있으면 시작.
   */
  const handleMeetingQuickAction = () => {
    if (currentMeeting) {
      handleJoinMeeting(currentMeeting);

      return;
    }

    if (startableMeeting) {
      handleStartMeeting(startableMeeting);
    }
  };

  const handleQuickAction = (actionId) => {
    if (actionId === 'meeting') {
      handleMeetingQuickAction();
      return;
    }

    if (actionId === 'reserve') {
      setReservationError('');

      setIsReservationModalOpen(true);

      return;
    }

    if (actionId === 'records') {
      setIsHistoryModalOpen(true);
    }
  };

  /*
   * 회의 예약
   */
  const handleReserveMeeting = async (reservation) => {
    try {
      setIsCreatingMeeting(true);

      setReservationError('');

      const scheduledStartAt = toScheduledDateTime(reservation.date, reservation.startTime);

      const scheduledEndAt = toScheduledDateTime(reservation.date, reservation.endTime);

      await createMeeting({
        teamId: reservation.teamId,

        title: reservation.title,

        agenda: reservation.agenda,

        scheduledStartAt,

        scheduledEndAt,
      });

      const [year, reservationMonth, reservationDate] = reservation.date.split('-').map(Number);

      setSelectedDate(new Date(year, reservationMonth - 1, reservationDate));

      setViewDate(new Date(year, reservationMonth - 1, 1));

      setSelectedFilter(`TEAM-${reservation.teamId}`);

      setIsReservationModalOpen(false);

      await loadMeetings();
    } catch (error) {
      console.error('Failed to create meeting:', error);

      setReservationError(error?.response?.data?.message ?? '회의 예약에 실패했습니다.');
    } finally {
      setIsCreatingMeeting(false);
    }
  };

  const handleCloseReservationModal = () => {
    if (isCreatingMeeting) {
      return;
    }

    setReservationError('');

    setIsReservationModalOpen(false);
  };

  /*
   * 빠른 액션 상태
   */
  const meetingActionLabel = currentMeeting
    ? '참여하기'
    : startableMeeting
      ? '시작하기'
      : '참여하기';

  const canUseMeetingAction = Boolean(currentMeeting || startableMeeting);

  const isStartingAnyMeeting = startingMeetingId !== null;

  return (
    <>
      <div className="h-full w-full overflow-y-auto pb-8">
        <header className="mb-5">
          <h1 className="text-2xl font-semibold text-[#101211]">회의하기</h1>
        </header>

        {currentMeeting && (
          <MeetingStatusBanner
            meeting={currentMeeting}
            onJoin={() => handleJoinMeeting(currentMeeting)}
          />
        )}

        <section className={`rounded-2xl bg-white p-6 ${currentMeeting ? 'mt-4' : ''}`}>
          <div className="grid min-h-[520px] grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.15fr]">
            {/* 왼쪽 */}
            <div className="flex items-center justify-center xl:border-r xl:border-[#EDF0EF]">
              <div className="w-full max-w-[360px]">
                <div className="mb-7">
                  <div className="flex items-end gap-1">
                    <p className="text-[32px] leading-none font-semibold text-[#101211]">
                      {displayHour}:{minutes}
                    </p>

                    <span className="text-lg leading-none font-medium text-[#101211]">
                      {period}
                    </span>
                  </div>

                  <p className="mt-3 text-base text-[#8C9692]">
                    {month}. {date} {day}
                  </p>
                </div>

                <div className="flex gap-4">
                  {quickActions.map((action) => {
                    const isMeetingAction = action.id === 'meeting';

                    const isReserveAction = action.id === 'reserve';

                    const isRecordAction = action.id === 'records';

                    const isDisabled =
                      (isMeetingAction &&
                        (isLoadingMeetings || !canUseMeetingAction || isStartingAnyMeeting)) ||
                      (isReserveAction && (isLoadingMeetings || teams.length === 0)) ||
                      (isRecordAction && endedMeetings.length === 0);

                    const actionLabel = isMeetingAction
                      ? isStartingAnyMeeting
                        ? '시작 중'
                        : meetingActionLabel
                      : action.label;

                    return (
                      <button
                        key={action.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleQuickAction(action.id)}
                        className={`group flex flex-col items-center gap-2 ${
                          isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
                            isDisabled
                              ? 'bg-[#E4E9E7] text-[#A7B0AC]'
                              : 'bg-[#101211] text-white group-hover:-translate-y-0.5'
                          }`}
                        >
                          {action.icon}
                        </span>

                        <span
                          className={`text-xs font-medium ${
                            isDisabled ? 'text-[#A7B0AC]' : 'text-[#303633]'
                          }`}
                        >
                          {actionLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {isLoadingMeetings ? (
                  <p className="mt-4 text-xs text-[#8A9490]">회의 정보를 확인하고 있습니다.</p>
                ) : meetingLoadError ? (
                  <p className="mt-4 text-xs text-[#F64E42]">{meetingLoadError}</p>
                ) : startMeetingError ? (
                  <p className="mt-4 text-xs text-[#F64E42]">{startMeetingError}</p>
                ) : teams.length === 0 ? (
                  <p className="mt-4 text-xs text-[#8A9490]">참여 중인 팀이 없습니다.</p>
                ) : currentMeeting ? (
                  <p className="mt-4 text-xs text-[#8A9490]">
                    현재 진행 중인 회의에 참여할 수 있습니다.
                  </p>
                ) : startableMeeting ? (
                  <p className="mt-4 text-xs text-[#8A9490]">예약된 회의를 시작할 수 있습니다.</p>
                ) : (
                  <p className="mt-4 text-xs text-[#8A9490]">
                    현재 참여하거나 시작할 수 있는 회의가 없습니다.
                  </p>
                )}
              </div>
            </div>

            {/* 오른쪽 */}
            <div className="min-w-0">
              <MeetingCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                viewDate={viewDate}
                onChangeViewDate={setViewDate}
                meetings={filteredMeetings}
                filterOptions={filterOptions}
                selectedFilter={selectedFilter}
                onChangeFilter={setSelectedFilter}
              />

              <MeetingScheduleList
                meetings={selectedMeetings}
                selectedDate={selectedDate}
                now={now}
                onStart={handleStartMeeting}
                onJoin={handleJoinMeeting}
                onOpenSummary={handleOpenSummary}
                startingMeetingId={startingMeetingId}
                hasActiveMeeting={hasActiveMeeting}
              />
            </div>
          </div>
        </section>
      </div>

      <MeetingReservationModal
        isOpen={isReservationModalOpen}
        onClose={handleCloseReservationModal}
        onReserve={handleReserveMeeting}
        filterOptions={filterOptions}
        defaultDate={formatDateKey(selectedDate)}
        minDate={formatDateKey(new Date())}
        meetings={meetings}
        isSubmitting={isCreatingMeeting}
        submitError={reservationError}
      />

      <MeetingHistoryModal
        isOpen={isHistoryModalOpen}
        meetings={meetings}
        onClose={() => setIsHistoryModalOpen(false)}
        onOpenSummary={handleOpenSummary}
      />
    </>
  );
}

export default MeetingPage;
