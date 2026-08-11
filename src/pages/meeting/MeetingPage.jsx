import { useState } from 'react';

import MeetingCalendar from '../../components/feature/meeting/MeetingCalendar';
import MeetingScheduleList from '../../components/feature/meeting/MeetingScheduleList';
import MeetingStatusBanner from '../../components/feature/meeting/MeetingStatusBanner';
import { meetingMockData } from '../../constants/meetingMockData';
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
    className: 'bg-[#DCE4E1] text-white',
  },
  {
    id: 'reserve',
    label: '예약하기',
    icon: <PlusIcon />,
    className: 'bg-[#101211] text-white',
  },
  {
    id: 'records',
    label: '회의록',
    icon: <FolderIcon />,
    className: 'bg-[#101211] text-white',
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
  const now = useCurrentDateTime();

  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [viewDate, setViewDate] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const selectedDateKey = formatDateKey(selectedDate);

  const selectedMeetings = meetingMockData.filter(
    (meeting) => meeting.date === selectedDateKey,
  );

  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const period = hours >= 12 ? 'pm' : 'am';
  const displayHour = hours % 12 || 12;

  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const day = WEEK_DAYS[now.getDay()];

  return (
    <div className="h-full w-full overflow-y-auto pb-8">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold text-[#101211]">
          회의하기
        </h1>
      </header>

      <MeetingStatusBanner />

      <section className="mt-4 rounded-2xl bg-white p-6">
        <div className="grid min-h-[520px] grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.15fr]">
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
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    className="group flex flex-col items-center gap-2"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:-translate-y-0.5 ${action.className}`}
                    >
                      {action.icon}
                    </span>

                    <span className="text-xs font-medium text-[#303633]">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <MeetingCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              viewDate={viewDate}
              onChangeViewDate={setViewDate}
              meetings={meetingMockData}
            />

            <MeetingScheduleList
              meetings={selectedMeetings}
              selectedDate={selectedDate}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default MeetingPage;
