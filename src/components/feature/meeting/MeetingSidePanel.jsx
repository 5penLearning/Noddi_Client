import { useState } from 'react';

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const PANEL_TITLES = {
  participants: '참여자',
  chat: '채팅',
  ai: 'AI 회의록',
};

function ParticipantsPanel({ participants }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="mb-2 text-xs text-[#8A9490]">
        참여 중 {participants.length}명
      </p>

      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center justify-between rounded-lg px-2 py-3 hover:bg-[#F5F7F6]"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5E9E7] text-xs font-semibold text-[#303633]">
              {participant.isMe
                ? '나'
                : participant.name.charAt(0)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="truncate text-sm font-semibold text-[#101211]">
                  {participant.name}
                </p>

                {participant.isMe && (
                  <span className="text-[10px] text-[#31C989]">
                    나
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-[11px] text-[#8A9490]">
                {participant.role}
              </p>
            </div>
          </div>

          <span className="h-2 w-2 shrink-0 rounded-full bg-[#31F5A0]" />
        </div>
      ))}
    </div>
  );
}

function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: '김민지',
      message: '회의 시작하겠습니다.',
      time: '10:02',
    },
    {
      id: 2,
      name: '이서준',
      message: '네, 확인했습니다.',
      time: '10:03',
    },
  ]);

  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    const now = new Date();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: '나',
        message: trimmedMessage,
        time: `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes(),
        ).padStart(2, '0')}`,
      },
    ]);

    setMessage('');
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pb-4">
        {messages.map((chat) => {
          const isMine = chat.name === '나';

          return (
            <div
              key={chat.id}
              className={`flex flex-col ${isMine ? 'items-end' : 'items-start'
                }`}
            >
              {!isMine && (
                <p className="mb-1 text-[11px] font-medium text-[#59625F]">
                  {chat.name}
                </p>
              )}

              <div
                className={`max-w-[85%] rounded-xl px-3 py-2.5 text-sm ${isMine
                  ? 'bg-[#101211] text-white'
                  : 'bg-[#F1F4F2] text-[#303633]'
                  }`}
              >
                {chat.message}
              </div>

              <p className="mt-1 text-[9px] text-[#A7B0AC]">
                {chat.time}
              </p>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-2 border-t border-[#EDF0EF] pt-3"
      >
        <input
          type="text"
          value={message}
          onChange={(event) =>
            setMessage(event.target.value)
          }
          placeholder="메시지를 입력해주세요"
          className="h-10 min-w-0 flex-1 rounded-lg border border-[#D8DFDC] px-3 text-xs text-[#101211] outline-none focus:border-[#101211]"
        />

        <button
          type="submit"
          className="h-10 shrink-0 rounded-lg bg-[#101211] px-3 text-xs font-medium text-white"
        >
          전송
        </button>
      </form>
    </div>
  );
}

function AiMinutesPanel() {
  return (
    <div>
      <div className="mb-5 rounded-xl bg-[#EFFFF8] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#31F5A0]" />

          <p className="text-xs font-semibold text-[#101211]">
            AI 회의록 기록 중
          </p>
        </div>

        <p className="mt-2 text-[11px] leading-5 text-[#59625F]">
          회의 내용이 기록되면 주요 내용을 실시간으로 정리합니다.
        </p>
      </div>

      <section>
        <h3 className="text-sm font-semibold text-[#101211]">
          회의 내용
        </h3>

        <div className="mt-3 flex min-h-[130px] items-center justify-center rounded-xl border border-[#EDF0EF] bg-[#FAFBFA] px-4">
          <p className="text-center text-xs leading-5 text-[#A7B0AC]">
            아직 정리된 회의 내용이 없습니다.
          </p>
        </div>
      </section>

      <section className="mt-5">
        <h3 className="text-sm font-semibold text-[#101211]">
          주요 내용
        </h3>

        <div className="mt-3 flex min-h-[100px] items-center justify-center rounded-xl border border-[#EDF0EF] bg-[#FAFBFA] px-4">
          <p className="text-center text-xs leading-5 text-[#A7B0AC]">
            회의가 진행되면 주요 내용이 표시됩니다.
          </p>
        </div>
      </section>
    </div>
  );
}

function MeetingSidePanel({
  type,
  onClose,
  participants,
}) {
  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-l border-[#DCE2DF] bg-white">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#EDF0EF] px-5">
        <h2 className="text-sm font-semibold text-[#101211]">
          {PANEL_TITLES[type]}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#59625F] transition hover:bg-[#F5F7F6]"
          aria-label="패널 닫기"
        >
          <CloseIcon />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {type === 'participants' && (
          <ParticipantsPanel
            participants={participants}
          />
        )}

        {type === 'chat' && <ChatPanel />}

        {type === 'ai' && <AiMinutesPanel />}
      </div>
    </aside>
  );
}

export default MeetingSidePanel;
