import MeetingCalendar from '../../components/feature/meeting/MeetingCalendar';
import MeetingScheduleList from '../../components/feature/meeting/MeetingScheduleList';
import MeetingStatusBanner from '../../components/feature/meeting/MeetingStatusBanner';

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

function MeetingPage() {
  return (
    <div className="h-full w-full overflow-y-auto pb-8">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold text-[#101211]">회의하기</h1>
      </header>

      <MeetingStatusBanner />

      <section className="mt-4 rounded-2xl bg-white p-6">
        <div className="grid min-h-[520px] grid-cols-1 gap-8 xl:grid-cols-[0.9fr_1.15fr]">
          {/* 왼쪽 영역 */}
          <div className="flex items-center justify-center xl:border-r xl:border-[#EDF0EF]">
            <div className="w-full max-w-[360px]">
              <div className="mb-7">
                <p className="text-[32px] font-semibold leading-none text-[#101211]">
                  10:00
                  <span className="ml-1 text-lg font-medium">pm</span>
                </p>

                <p className="mt-3 text-base text-[#8C9692]">
                  08. 09 일요일
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

          {/* 오른쪽 영역 */}
          <div className="min-w-0">
            <MeetingCalendar />

            <MeetingScheduleList />
          </div>
        </div>
      </section>
    </div>
  );
}

export default MeetingPage;
