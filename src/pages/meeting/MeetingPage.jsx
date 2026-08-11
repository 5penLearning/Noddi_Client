import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MeetingCalendar from '../../components/feature/meeting/MeetingCalendar';
import MeetingReservationModal from '../../components/feature/meeting/MeetingReservationModal';
import MeetingScheduleList from '../../components/feature/meeting/MeetingScheduleList';
import MeetingStatusBanner from '../../components/feature/meeting/MeetingStatusBanner';
import { meetingMockData } from '../../constants/meetingMockData';
import useCurrentDateTime from '../../hooks/useCurrentDateTime';
import { formatDateKey } from '../../utils/date';
import { getMeetingStatus } from '../../utils/meeting';

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

function MeetingPage() {
  const navigate = useNavigate();
  const now = useCurrentDateTime();

  const [meetings, setMeetings] = useState(meetingMockData);

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [viewDate, setViewDate] = useState(
    () =>
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      ),
  );

  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const [isReservationModalOpen, setIsReservationModalOpen] =
    useState(false);

  /*
   * 현재 실제 진행 중인 회의
   */
  const currentMeeting = meetings.find(
    (meeting) =>
      getMeetingStatus(meeting, now) === 'IN_PROGRESS',
  );

  /*
   * 프로젝트 / 팀 필터
   */
  const filterOptions = [
    {
      id: 'ALL',
      label: '전체',
    },

    ...Array.from(
      new Map(
        meetings.map((meeting) => {
          const id = `${meeting.project}::${meeting.team}`;

          return [
            id,
            {
              id,
              label: `${meeting.project} / ${meeting.team}`,
              project: meeting.project,
              team: meeting.team,
            },
          ];
        }),
      ).values(),
    ),
  ];

  /*
   * 선택한 프로젝트 / 팀으로 필터링
   */
  const filteredMeetings =
    selectedFilter === 'ALL'
      ? meetings
      : meetings.filter((meeting) => {
        const filterId = `${meeting.project}::${meeting.team}`;

        return filterId === selectedFilter;
      });

  /*
   * 선택한 날짜의 회의
   */
  const selectedDateKey = formatDateKey(selectedDate);

  const selectedMeetings = filteredMeetings.filter(
    (meeting) => meeting.date === selectedDateKey,
  );

  /*
   * 현재 시간
   */
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const period = hours >= 12 ? 'pm' : 'am';
  const displayHour = hours % 12 || 12;

  /*
   * 현재 날짜
   */
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const day = WEEK_DAYS[now.getDay()];

  /*
   * 회의 참여
   */
  const handleJoinMeeting = () => {
    if (!currentMeeting) {
      return;
    }

    navigate(`/meetings/${currentMeeting.id}/room`, {
      state: {
        meeting: currentMeeting,
      },
    });
  };

  /*
   * 빠른 메뉴
   */
  const handleQuickAction = (actionId) => {
    if (actionId === 'join') {
      handleJoinMeeting();
      return;
    }

    if (actionId === 'reserve') {
      setIsReservationModalOpen(true);
    }
  };

  /*
   * 회의 예약
   */
  const handleReserveMeeting = (reservation) => {
    const newMeeting = {
      id: Date.now(),
      ...reservation,
      participants: [],
    };

    setMeetings((prev) =>
      [...prev, newMeeting].sort((meetingA, meetingB) => {
        const dateTimeA = `${meetingA.date} ${meetingA.startTime}`;
        const dateTimeB = `${meetingB.date} ${meetingB.startTime}`;

        return dateTimeA.localeCompare(dateTimeB);
      }),
    );

    const [year, reservationMonth, reservationDate] =
      reservation.date.split('-').map(Number);

    const reservedDate = new Date(
      year,
      reservationMonth - 1,
      reservationDate,
    );

    setSelectedDate(reservedDate);

    setViewDate(
      new Date(
        year,
        reservationMonth - 1,
        1,
      ),
    );

    setSelectedFilter('ALL');
    setIsReservationModalOpen(false);
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
            meeting={currentMeeting}
            onJoin={handleJoinMeeting}
          />
        )}

        <section
          className={`rounded-2xl bg-white p-6 ${currentMeeting ? 'mt-4' : ''
            }`}
        >
          <div className="grid min-h-[520px] grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.15fr]">
            {/* 왼쪽 영역 */}
            <div className="flex items-center justify-center xl:border-r xl:border-[#EDF0EF]">
              <div className="w-full max-w-[360px]">
                <div className="mb-7">
                  <div className="flex items-end gap-1">
                    <p className="text-[32px] font-semibold leading-none text-[#101211]">
                      {displayHour}:{minutes}
                    </p>

                    <span className="text-lg font-medium leading-none text-[#101211]">
                      {period}
                    </span>
                  </div>

                  <p className="mt-3 text-base text-[#8C9692]">
                    {month}. {date} {day}
                  </p>
                </div>

                <div className="flex gap-4">
                  {quickActions.map((action) => {
                    const isJoinAction = action.id === 'join';

                    const isDisabled =
                      isJoinAction && !currentMeeting;

                    return (
                      <button
                        key={action.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() =>
                          handleQuickAction(action.id)
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
                          {action.icon}
                        </span>

                        <span
                          className={`text-xs font-medium ${isDisabled
                            ? 'text-[#A7B0AC]'
                            : 'text-[#303633]'
                            }`}
                        >
                          {action.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {!currentMeeting && (
                  <p className="mt-4 text-xs text-[#8A9490]">
                    현재 참여할 수 있는 회의가 없습니다.
                  </p>
                )}
              </div>
            </div>

            {/* 오른쪽 영역 */}
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
              />
            </div>
          </div>
        </section>
      </div>

      <MeetingReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
        onReserve={handleReserveMeeting}
        filterOptions={filterOptions}
        defaultDate={formatDateKey(selectedDate)}
        minDate={formatDateKey(new Date())}
        meetings={meetings}
      />
    </>
  );
}

export default MeetingPage;
