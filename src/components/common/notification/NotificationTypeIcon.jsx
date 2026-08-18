import calendarGridBottom from '../../../assets/icons/notification/calendar-grid-bottom.svg';
import calendarGridTop from '../../../assets/icons/notification/calendar-grid-top.svg';
import calendarLine from '../../../assets/icons/notification/calendar-line.svg';
import calendarPin from '../../../assets/icons/notification/calendar-pin.svg';
import replyBubble from '../../../assets/icons/notification/reply-bubble.svg';
import replyDot from '../../../assets/icons/notification/reply-dot.svg';
import replySpark from '../../../assets/icons/notification/reply-spark.svg';
import usersCenterBody from '../../../assets/icons/notification/users-center-body.svg';
import usersCenterHead from '../../../assets/icons/notification/users-center-head.svg';
import usersSideBody from '../../../assets/icons/notification/users-side-body.svg';
import usersSideHead from '../../../assets/icons/notification/users-side-head.svg';

function InvitationIcon() {
  return (
    <span className="relative block size-6">
      <img src={usersCenterHead} className="absolute top-[5px] left-[8.81px] size-[6.81px]" />
      <img
        src={usersCenterBody}
        className="absolute top-[13.51px] left-[6.26px] h-[6.38px] w-[11.92px]"
      />
      <img
        src={usersSideHead}
        className="absolute top-[6.55px] left-[4.01px] h-[5.35px] w-[2.68px]"
      />
      <img
        src={usersSideHead}
        className="absolute top-[6.55px] left-[17.32px] h-[5.35px] w-[2.68px]"
      />
      <img
        src={usersSideBody}
        className="absolute top-[14.14px] left-[2px] h-[3.92px] w-[2.55px]"
      />
      <img
        src={usersSideBody}
        className="absolute top-[14.14px] left-[19.45px] h-[3.92px] w-[2.55px]"
      />
    </span>
  );
}

function ReplyIcon() {
  return (
    <span className="relative block size-6">
      <img src={replyBubble} className="absolute top-[2px] left-[2px] size-5" />
      <img src={replyDot} className="absolute top-[10.8px] left-[5.8px] size-[2.5px]" />
      <img src={replyDot} className="absolute top-[10.8px] left-[10.8px] size-[2.5px]" />
      <img src={replyDot} className="absolute top-[10.8px] left-[15.8px] size-[2.5px]" />
      <img src={replySpark} className="absolute top-[1px] left-[15px] size-2" />
    </span>
  );
}

function MeetingIcon() {
  return (
    <span className="relative block size-6">
      <span className="absolute top-[3.5px] left-[3px] size-[18px] rounded-[5px] border-[1.5px] border-[#11cce4]" />
      <img src={calendarLine} className="absolute top-[8.5px] left-[3px] h-[1.5px] w-[18px]" />
      <img src={calendarPin} className="absolute top-[2px] left-[7px] h-[3px] w-px" />
      <img src={calendarPin} className="absolute top-[2px] left-[16px] h-[3px] w-px" />
      <img src={calendarGridTop} className="absolute top-[12px] left-[6.5px] h-[1px] w-[11px]" />
      <img src={calendarGridBottom} className="absolute top-[16px] left-[6.5px] h-[1px] w-[11px]" />
    </span>
  );
}

function NotificationTypeIcon({ type }) {
  if (type?.includes('QA')) return <ReplyIcon />;
  if (type?.includes('MEETING')) return <MeetingIcon />;

  return <InvitationIcon />;
}

export default NotificationTypeIcon;
