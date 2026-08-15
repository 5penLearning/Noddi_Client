import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  endMeeting,
  getMeeting,
} from '../../api/meetingApi';

import MeetingSidePanel from '../../components/feature/meeting/MeetingSidePanel';
import useDailyCall from '../../hooks/useDailyCall';

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

      <circle
        cx="8"
        cy="11"
        r="1"
        fill="currentColor"
      />

      <circle
        cx="12"
        cy="11"
        r="1"
        fill="currentColor"
      />

      <circle
        cx="16"
        cy="11"
        r="1"
        fill="currentColor"
      />
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

function ChevronLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M15 18L9 12L15 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getParticipantName(participant) {
  if (participant?.local) {
    return '나';
  }

  return participant?.user_name || '참여자';
}

function VideoTrack({
  track,
  muted = false,
  className = '',
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !track) {
      return undefined;
    }

    const mediaStream = new MediaStream([track]);

    videoElement.srcObject = mediaStream;

    return () => {
      if (
        videoElement.srcObject === mediaStream
      ) {
        videoElement.srcObject = null;
      }
    };
  }, [track]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className={className}
    />
  );
}

function ParticipantAudio({
  participant,
}) {
  const audioRef = useRef(null);

  const audioTrack =
    participant?.tracks?.audio
      ?.persistentTrack;

  useEffect(() => {
    const audioElement = audioRef.current;

    if (
      participant?.local ||
      !audioElement ||
      !audioTrack
    ) {
      return undefined;
    }

    const mediaStream = new MediaStream([
      audioTrack,
    ]);

    audioElement.srcObject = mediaStream;

    return () => {
      if (
        audioElement.srcObject === mediaStream
      ) {
        audioElement.srcObject = null;
      }
    };
  }, [
    audioTrack,
    participant?.local,
  ]);

  if (
    participant?.local ||
    !audioTrack
  ) {
    return null;
  }

  return (
    <audio
      ref={audioRef}
      autoPlay
      className="hidden"
    />
  );
}

function ParticipantTile({
  participant,
}) {
  const name =
    getParticipantName(participant);

  const videoTrack =
    participant?.tracks?.video
      ?.persistentTrack;

  const isCameraOn =
    participant?.tracks?.video?.state ===
    'playable' &&
    Boolean(videoTrack);

  const isMicOn =
    participant?.tracks?.audio?.state ===
    'playable';

  return (
    <div className="relative flex min-h-0 items-center justify-center overflow-hidden border border-[#444] bg-[#202422]">
      <ParticipantAudio
        participant={participant}
      />

      {isCameraOn ? (
        <VideoTrack
          track={videoTrack}
          muted={participant.local}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#353B38] text-2xl font-semibold text-white">
          {name.charAt(0)}
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 text-white">
        {!isMicOn && (
          <MicrophoneIcon off />
        )}

        <span className="text-xs font-semibold">
          {name}
        </span>
      </div>
    </div>
  );
}

function ParticipantStrip({
  participants,
}) {
  return (
    <div className="flex h-[76px] shrink-0 bg-[#171A19]">
      <button
        type="button"
        className="flex w-9 shrink-0 items-center justify-center bg-black/30 text-white"
      >
        <ChevronLeftIcon />
      </button>

      <div className="flex min-w-0 flex-1 overflow-hidden">
        {participants
          .slice(0, 6)
          .map((participant) => {
            const name =
              getParticipantName(
                participant,
              );

            const videoTrack =
              participant?.tracks?.video
                ?.persistentTrack;

            const isCameraOn =
              participant?.tracks?.video
                ?.state === 'playable' &&
              Boolean(videoTrack);

            return (
              <div
                key={
                  participant.session_id
                }
                className="relative min-w-[128px] flex-1 overflow-hidden border-r border-[#444] bg-[#202422]"
              >
                <ParticipantAudio
                  participant={
                    participant
                  }
                />

                {isCameraOn ? (
                  <VideoTrack
                    track={videoTrack}
                    muted={
                      participant.local
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#353B38] text-xs font-semibold text-white">
                      {name.charAt(0)}
                    </div>
                  </div>
                )}

                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-white">
                  {name}
                </span>
              </div>
            );
          })}
      </div>

      <button
        type="button"
        className="flex w-9 shrink-0 items-center justify-center bg-black/30 text-white"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}

function ScreenShareView({
  participant,
}) {
  const screenTrack =
    participant?.tracks?.screenVideo
      ?.persistentTrack;

  if (!screenTrack) {
    return null;
  }

  return (
    <div className="flex h-full items-center justify-center overflow-hidden bg-[#303533]">
      <VideoTrack
        track={screenTrack}
        muted
        className="h-full w-full object-contain"
      />
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

  const locationMeeting =
    location.state?.meeting;

  const [meeting, setMeeting] =
    useState(locationMeeting ?? null);

  const [roomUrl, setRoomUrl] =
    useState(null);

  const [activePanel, setActivePanel] =
    useState(null);

  const [
    isLoadingMeeting,
    setIsLoadingMeeting,
  ] = useState(true);

  const [isEnding, setIsEnding] =
    useState(false);

  const [roomError, setRoomError] =
    useState(null);

  const {
    participants,
    isJoining,
    isJoined,
    isMicOn,
    isCameraOn,
    isSharing,
    error: dailyError,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    leaveCall,
  } = useDailyCall(roomUrl);

  /*
   * 회의방 진입
   *
   * 여기서는 회의를 "시작"하지 않는다.
   *
   * 이미 IN_PROGRESS 상태인 회의의
   * roomUrl을 조회해서 Daily에 참여한다.
   */
  useEffect(() => {
    let cancelled = false;

    const loadMeetingRoom = async () => {
      try {
        setIsLoadingMeeting(true);
        setRoomError(null);

        const response =
          await getMeeting(meetingId);

        if (cancelled) {
          return;
        }

        const meetingData =
          response?.result;

        if (!meetingData) {
          throw new Error(
            '회의 정보를 불러오지 못했습니다.',
          );
        }

        setMeeting((previousMeeting) => ({
          ...previousMeeting,
          ...meetingData,
        }));

        /*
         * 예약 상태라면 아직 Daily Room이 없는 상태
         */
        if (
          meetingData.status ===
          'SCHEDULED'
        ) {
          throw new Error(
            '아직 시작되지 않은 회의입니다.',
          );
        }

        /*
         * 종료된 회의는 재입장 불가
         */
        if (
          meetingData.status === 'ENDED'
        ) {
          throw new Error(
            '이미 종료된 회의입니다.',
          );
        }

        /*
         * 실제 참여 가능한 상태
         */
        if (
          meetingData.status !==
          'IN_PROGRESS'
        ) {
          throw new Error(
            '현재 참여할 수 없는 회의입니다.',
          );
        }

        if (!meetingData.roomUrl) {
          throw new Error(
            '회의방 URL을 불러오지 못했습니다.',
          );
        }

        setRoomUrl(
          meetingData.roomUrl,
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          'Failed to load meeting room:',
          error,
        );

        setRoomError(
          error?.response?.data
            ?.message ??
          error?.message ??
          '회의방에 참여하지 못했습니다.',
        );
      } finally {
        if (!cancelled) {
          setIsLoadingMeeting(false);
        }
      }
    };

    loadMeetingRoom();

    return () => {
      cancelled = true;
    };
  }, [meetingId]);

  /*
   * 화면 공유 중인 참가자
   */
  const screenSharingParticipant =
    participants.find(
      (participant) =>
        participant?.tracks?.screenVideo
          ?.state === 'playable' &&
        participant?.tracks?.screenVideo
          ?.persistentTrack,
    );

  /*
   * 메인 화면에 표시할 참가자
   */
  const visibleParticipants =
    participants.slice(0, 4);

  const gridClassName = useMemo(() => {
    if (
      visibleParticipants.length <= 1
    ) {
      return 'grid-cols-1 grid-rows-1';
    }

    if (
      visibleParticipants.length === 2
    ) {
      return 'grid-cols-2 grid-rows-1';
    }

    return 'grid-cols-2 grid-rows-2';
  }, [visibleParticipants.length]);

  /*
   * 우측 참여자 패널용 데이터
   */
  const sidePanelParticipants =
    participants.map(
      (participant) => ({
        id: participant.session_id,

        name:
          getParticipantName(
            participant,
          ),

        role: participant.local
          ? meeting?.team ??
          meeting?.teamName ??
          '참여자'
          : '참여자',

        isMe: participant.local,
      }),
    );

  const togglePanel = (panel) => {
    setActivePanel(
      (previousPanel) =>
        previousPanel === panel
          ? null
          : panel,
    );
  };

  /*
   * 나가기
   *
   * Daily 연결만 종료한다.
   * 전체 회의는 종료하지 않는다.
   */
  const handleLeave = async () => {
    try {
      await leaveCall();
    } catch (error) {
      console.error(
        'Failed to leave meeting:',
        error,
      );
    } finally {
      navigate('/meetings');
    }
  };

  /*
   * 회의 종료
   *
   * 전체 회의를 종료하고
   * 백엔드에서 Daily Room을 삭제한다.
   */
  const handleEndMeeting = async () => {
    if (isEnding) {
      return;
    }

    try {
      setIsEnding(true);
      setRoomError(null);

      await endMeeting(meetingId);

      await leaveCall();

      navigate('/meetings');
    } catch (error) {
      console.error(
        'Failed to end meeting:',
        error,
      );

      setRoomError(
        error?.response?.data
          ?.message ??
        error?.message ??
        '회의를 종료하지 못했습니다.',
      );
    } finally {
      setIsEnding(false);
    }
  };

  const connectionError =
    roomError || dailyError;

  const isLoading =
    isLoadingMeeting ||
    Boolean(roomUrl && isJoining);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#101211]">
      {connectionError && (
        <div className="flex shrink-0 items-center justify-between bg-[#FFF1F0] px-5 py-3">
          <p className="text-sm text-[#F64E42]">
            {connectionError}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                navigate('/meetings')
              }
              className="rounded-lg border border-[#D9DFDC] bg-white px-4 py-2 text-xs text-[#303633]"
            >
              회의 목록
            </button>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="rounded-lg bg-[#101211] px-4 py-2 text-xs text-white"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      <main className="flex min-h-0 flex-1">
        {/* 영상 영역 */}
        <section className="flex min-w-0 flex-1 flex-col">
          {isLoading ? (
            <div className="flex h-full items-center justify-center bg-[#202422]">
              <p className="text-sm text-[#A7B0AC]">
                회의방에 참여하고
                있습니다.
              </p>
            </div>
          ) : !isJoined ? (
            <div className="flex h-full items-center justify-center bg-[#202422]">
              <p className="text-sm text-[#A7B0AC]">
                {connectionError
                  ? '회의방에 참여할 수 없습니다.'
                  : '회의방 연결을 기다리고 있습니다.'}
              </p>
            </div>
          ) : screenSharingParticipant ? (
            <>
              <ParticipantStrip
                participants={
                  participants
                }
              />

              <div className="min-h-0 flex-1">
                <ScreenShareView
                  participant={
                    screenSharingParticipant
                  }
                />
              </div>
            </>
          ) : (
            <div
              className={`grid h-full ${gridClassName}`}
            >
              {visibleParticipants.map(
                (participant) => (
                  <ParticipantTile
                    key={
                      participant.session_id
                    }
                    participant={
                      participant
                    }
                  />
                ),
              )}
            </div>
          )}
        </section>

        {/* 우측 패널 */}
        {activePanel && (
          <MeetingSidePanel
            type={activePanel}
            participants={
              sidePanelParticipants
            }
            onClose={() =>
              setActivePanel(null)
            }
          />
        )}
      </main>

      {/* 하단 툴바 */}
      <footer className="relative flex h-[64px] shrink-0 items-center bg-[#101211] px-4">
        <div className="flex items-center gap-2">
          <ToolbarButton
            label={
              isMicOn
                ? '마이크'
                : '음소거'
            }
            icon={
              <MicrophoneIcon
                off={!isMicOn}
              />
            }
            active={isMicOn}
            disabled={!isJoined}
            onClick={toggleMic}
          />

          <ToolbarButton
            label={
              isCameraOn
                ? '카메라'
                : '카메라 끔'
            }
            icon={
              <CameraIcon
                off={!isCameraOn}
              />
            }
            active={isCameraOn}
            disabled={!isJoined}
            onClick={toggleCamera}
          />
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-4">
          <ToolbarButton
            label={`참여자 ${participants.length}`}
            icon={<UsersIcon />}
            active={
              activePanel ===
              'participants'
            }
            disabled={!isJoined}
            onClick={() =>
              togglePanel(
                'participants',
              )
            }
          />

          <ToolbarButton
            label="내 화면"
            icon={<CameraIcon />}
            disabled={!isJoined}
          />

          <ToolbarButton
            label={
              isSharing
                ? '공유 중지'
                : '화면 공유'
            }
            icon={<ShareIcon />}
            active={isSharing}
            disabled={!isJoined}
            onClick={
              toggleScreenShare
            }
          />

          <ToolbarButton
            label="채팅"
            icon={<ChatIcon />}
            active={
              activePanel === 'chat'
            }
            disabled={!isJoined}
            onClick={() =>
              togglePanel('chat')
            }
          />

          <ToolbarButton
            label="AI 회의록"
            icon={<FileIcon />}
            active={
              activePanel === 'ai'
            }
            onClick={() =>
              togglePanel('ai')
            }
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            disabled={
              isEnding || !isJoined
            }
            onClick={
              handleEndMeeting
            }
            className="rounded-lg border border-[#F64E42] px-5 py-2 text-xs font-semibold text-[#F64E42] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isEnding
              ? '종료 중...'
              : '종료하기'}
          </button>

          <button
            type="button"
            disabled={!isJoined}
            onClick={handleLeave}
            className="rounded-lg bg-[#F64E42] px-6 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            나가기
          </button>
        </div>
      </footer>

      <span className="sr-only">
        회의{' '}
        {meeting?.meetingId ??
          meeting?.id ??
          meetingId}
      </span>
    </div>
  );
}

export default MeetingRoomPage;
