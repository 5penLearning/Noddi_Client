import { formatMeetingTime } from '../../../utils/meeting';
import MeetingParticipants from './MeetingParticipants';

function MeetingStatusBanner({ meeting, onJoin }) {
  if (!meeting) {
    return null;
  }

  return (
    <section className="flex min-h-[84px] items-center justify-between gap-6 rounded-xl bg-[#31F5A0] px-6 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#F64E42]" />

        <div className="min-w-0">
          <p className="text-xs font-medium text-[#F64E42]">
            현재 진행 중이에요
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-[#101211]">
            {formatMeetingTime(meeting.startTime)} {meeting.title}
          </p>

          <p className="mt-1 text-xs text-[#59625F]">
            {meeting.project} / {meeting.team}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-5">
        <MeetingParticipants participants={meeting.participants} />

        <button
          type="button"
          onClick={onJoin}
          className="shrink-0 rounded-lg bg-[#101211] px-5 py-3 text-sm font-medium text-white transition hover:opacity-80"
        >
          참여하러 가기
        </button>
      </div>
    </section>
  );
}

export default MeetingStatusBanner;
