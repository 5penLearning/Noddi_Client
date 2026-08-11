import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import useLocalMedia from '../../hooks/useLocalMedia';

function MicrophoneIcon({ off = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="9"
        y="3"
        width="6"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M6 11C6 14.3137 8.68629 17 12 17C15.3137 17 18 14.3137 18 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M12 17V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {off && (
        <path
          d="M4 4L20 20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function CameraIcon({ off = false }) {
  return (
    <svg
      width="19"
      height="19"
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
        d="M16 10L21 7V17L16 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {off && (
        <path
          d="M4 4L20 20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M3.5 18C3.5 15.5 5.8 13.5 9 13.5C12.2 13.5 14.5 15.5 14.5 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M15 6.5C17 6.5 18.5 8 18.5 10C18.5 12 17 13.5 15 13.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M17 14.5C19.2 15 20.5 16.3 20.5 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M8 21H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M12 17V21"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M12 13V7M12 7L9.5 9.5M12 7L14.5 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 5H19C20.1046 5 21 5.89543 21 7V15C21 16.1046 20.1046 17 19 17H10L5 21V17C3.89543 17 3 16.1046 3 15V7C3 5.89543 3.89543 5 5 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <circle cx="8" cy="11" r="1" fill="currentColor" />
      <circle cx="12" cy="11" r="1" fill="currentColor" />
      <circle cx="16" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 3H14L19 8V21H6V3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M14 3V8H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M9 13H16M9 17H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const remoteParticipants = [
  {
    id: 2,
    name: '김민지',
    role: '마케팅팀',
  },
  {
    id: 3,
    name: '이서준',
    role: '마케팅팀',
  },
  {
    id: 4,
    name: '박지우',
    role: '마케팅팀',
  },
];

function LocalParticipantTile({
  stream,
  isCameraOn,
  isMicOn,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="relative min-h-0 overflow-hidden border border-[#444] bg-[#202422]">
      {stream && isCameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#353B38] text-2xl font-semibold text-white">
            나
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 text-white backdrop-blur-sm">
        {!isMicOn && (
          <MicrophoneIcon off />
        )}

        <span className="text-xs font-semibold">
          나
        </span>
      </div>
    </div>
  );
}

function RemoteParticipantTile({ participant }) {
  return (
    <div className="relative flex min-h-0 items-center justify-center overflow-hidden border border-[#444] bg-[#F7F8F7]">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#B8BFBC] bg-[#E5E9E7] text-xl font-semibold text-[#59625F]">
        {participant.name.charAt(0)}
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2 backdrop-blur-sm">
        <span className="text-xs font-semibold text-[#303633]">
          {participant.name}
        </span>

        <span className="text-[10px] text-[#8A9490]">
          {participant.role}
        </span>
      </div>
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  active = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex min-w-[58px] flex-col items-center gap-1 text-[10px] transition ${disabled
        ? 'cursor-not-allowed text-[#59625F]'
        : active
          ? 'text-[#31F5A0]'
          : 'text-[#D7DEDB] hover:text-white'
        }`}
    >
      <span className="flex h-6 items-center justify-center">
        {icon}
      </span>

      <span>{label}</span>
    </button>
  );
}

function MeetingRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { meetingId } = useParams();

  const meeting = location.state?.meeting;

  const {
    stream,
    isMicOn,
    isCameraOn,
    isLoading,
    error,
    toggleMic,
    toggleCamera,
    startMedia,
    stopMedia,
  } = useLocalMedia();

  const [isSharing, setIsSharing] = useState(false);

  const handleLeave = () => {
    stopMedia();
    navigate('/meetings');
  };

  const handleEndMeeting = () => {
    stopMedia();
    navigate('/meetings');
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#101211]">
      {/* 회의 정보 */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 bg-[#101211] px-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {meeting?.title ?? '화상회의'}
          </p>

          {meeting && (
            <p className="text-[10px] text-[#8A9490]">
              {meeting.project} / {meeting.team}
            </p>
          )}
        </div>

        <span className="text-xs text-[#8A9490]">
          회의 #{meeting?.id ?? meetingId}
        </span>
      </header>

      {/* 권한 오류 */}
      {error && (
        <div className="flex shrink-0 items-center justify-between bg-[#FFF1F0] px-5 py-3">
          <p className="text-sm text-[#F64E42]">
            {error}
          </p>

          <button
            type="button"
            onClick={startMedia}
            className="rounded-lg bg-[#101211] px-4 py-2 text-xs font-medium text-white"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 참가자 영역 */}
      <main className="min-h-0 flex-1">
        {isLoading ? (
          <div className="flex h-full items-center justify-center bg-[#202422]">
            <p className="text-sm text-[#A7B0AC]">
              카메라와 마이크를 준비하고 있습니다.
            </p>
          </div>
        ) : (
          <div className="grid h-full grid-cols-2 grid-rows-2">
            <LocalParticipantTile
              stream={stream}
              isCameraOn={isCameraOn}
              isMicOn={isMicOn}
            />

            {remoteParticipants.map((participant) => (
              <RemoteParticipantTile
                key={participant.id}
                participant={participant}
              />
            ))}
          </div>
        )}
      </main>

      {/* 하단 컨트롤바 */}
      <footer className="relative flex h-[76px] shrink-0 items-center bg-[#101211] px-5">
        {/* 왼쪽 */}
        <div className="flex items-center gap-5">
          <ToolbarButton
            label={isMicOn ? '마이크' : '음소거'}
            icon={
              <MicrophoneIcon off={!isMicOn} />
            }
            active={isMicOn}
            disabled={!stream}
            onClick={toggleMic}
          />

          <ToolbarButton
            label={
              isCameraOn ? '카메라' : '카메라 끔'
            }
            icon={
              <CameraIcon off={!isCameraOn} />
            }
            active={isCameraOn}
            disabled={!stream}
            onClick={toggleCamera}
          />
        </div>

        {/* 가운데 */}
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-7">
          <ToolbarButton
            label="참여자"
            icon={<UsersIcon />}
          />

          <ToolbarButton
            label="내 화면"
            icon={<CameraIcon />}
          />

          <ToolbarButton
            label="화면 공유"
            icon={<ShareIcon />}
            active={isSharing}
            onClick={() =>
              setIsSharing((prev) => !prev)
            }
          />

          <ToolbarButton
            label="채팅"
            icon={<ChatIcon />}
          />

          <ToolbarButton
            label="AI 회의록"
            icon={<FileIcon />}
          />
        </div>

        {/* 오른쪽 */}
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleEndMeeting}
            className="rounded-lg border border-[#F64E42] px-5 py-2.5 text-xs font-semibold text-[#F64E42] transition hover:bg-[#F64E42]/10"
          >
            종료하기
          </button>

          <button
            type="button"
            onClick={handleLeave}
            className="rounded-lg bg-[#F64E42] px-6 py-2.5 text-xs font-semibold text-white transition hover:opacity-90"
          >
            나가기
          </button>
        </div>
      </footer>
    </div>
  );
}

export default MeetingRoomPage;
