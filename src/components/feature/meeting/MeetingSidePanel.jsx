import {
  useEffect,
  useRef,
  useState,
} from 'react';

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

function ParticipantsPanel({
  participants,
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="mb-2 text-xs text-[#8A9490]">
        참여 중{' '}
        {participants.length}명
      </p>

      {participants.map(
        (participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between rounded-lg px-2 py-3 hover:bg-[#F5F7F6]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5E9E7] text-xs font-semibold text-[#303633]">
                {participant.isMe
                  ? '나'
                  : participant.name.charAt(
                    0,
                  )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="truncate text-sm font-semibold text-[#101211]">
                    {
                      participant.name
                    }
                  </p>

                  {participant.isMe && (
                    <span className="text-[10px] text-[#31C989]">
                      나
                    </span>
                  )}
                </div>

                <p className="mt-0.5 text-[11px] text-[#8A9490]">
                  {
                    participant.role
                  }
                </p>
              </div>
            </div>

            <span className="h-2 w-2 shrink-0 rounded-full bg-[#31F5A0]" />
          </div>
        ),
      )}
    </div>
  );
}

function formatMessageTime(
  sentAt,
) {
  const date = new Date(
    sentAt,
  );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  return `${String(
    date.getHours(),
  ).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`;
}

function ChatPanel({
  messages,
  onSendMessage,
}) {
  const [
    message,
    setMessage,
  ] = useState('');

  const [
    isSending,
    setIsSending,
  ] = useState(false);

  const [
    sendError,
    setSendError,
  ] = useState('');

  const bottomRef =
    useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior: 'smooth',
      },
    );
  }, [messages]);

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      const trimmedMessage =
        message.trim();

      if (
        !trimmedMessage ||
        isSending
      ) {
        return;
      }

      try {
        setIsSending(true);
        setSendError('');

        await onSendMessage(
          trimmedMessage,
        );

        setMessage('');
      } catch (error) {
        setSendError(
          error?.message ??
          '메시지를 전송하지 못했습니다.',
        );
      } finally {
        setIsSending(false);
      }
    };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        {messages.length ===
          0 ? (
          <div className="flex h-full min-h-[220px] items-center justify-center px-4">
            <div className="text-center">
              <p className="text-xs font-medium text-[#8A9490]">
                아직 메시지가
                없습니다.
              </p>

              <p className="mt-1 text-[10px] leading-5 text-[#A7B0AC]">
                회의 중 필요한
                내용을 공유해보세요.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map(
              (chat) => (
                <div
                  key={chat.id}
                  className={`flex flex-col ${chat.isMine
                    ? 'items-end'
                    : 'items-start'
                    }`}
                >
                  {!chat.isMine && (
                    <p className="mb-1 text-[11px] font-medium text-[#59625F]">
                      {chat.name}
                    </p>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2.5 text-sm ${chat.isMine
                      ? 'bg-[#101211] text-white'
                      : 'bg-[#F1F4F2] text-[#303633]'
                      }`}
                  >
                    {chat.message}
                  </div>

                  <p className="mt-1 text-[9px] text-[#A7B0AC]">
                    {formatMessageTime(
                      chat.sentAt,
                    )}
                  </p>
                </div>
              ),
            )}

            <div
              ref={bottomRef}
            />
          </div>
        )}
      </div>

      <div className="shrink-0">
        {sendError && (
          <p className="mb-2 text-[10px] text-[#F64E42]">
            {sendError}
          </p>
        )}

        <p className="mb-2 text-[9px] leading-4 text-[#A7B0AC]">
          회의 중 채팅은 별도로
          저장되지 않습니다.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-[#EDF0EF] pt-3"
        >
          <input
            type="text"
            value={message}
            disabled={isSending}
            onChange={(event) =>
              setMessage(
                event.target.value,
              )
            }
            placeholder="메시지를 입력해주세요"
            className="h-10 min-w-0 flex-1 rounded-lg border border-[#D8DFDC] px-3 text-xs text-[#101211] outline-none focus:border-[#101211] disabled:bg-[#F5F7F6]"
          />

          <button
            type="submit"
            disabled={
              !message.trim() ||
              isSending
            }
            className="h-10 shrink-0 rounded-lg bg-[#101211] px-3 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSending
              ? '전송 중'
              : '전송'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AiMinutesPanel({
  isRecording,
}) {
  return (
    <div>
      <div
        className={`mb-5 rounded-xl px-4 py-3 ${isRecording
          ? 'bg-[#EFFFF8]'
          : 'bg-[#F5F7F6]'
          }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${isRecording
              ? 'animate-pulse bg-[#F64E42]'
              : 'bg-[#A7B0AC]'
              }`}
          />

          <p className="text-xs font-semibold text-[#101211]">
            {isRecording
              ? '회의 녹음 중'
              : 'AI 회의록 대기'}
          </p>
        </div>

        <p className="mt-2 text-[11px] leading-5 text-[#59625F]">
          {isRecording
            ? '현재 회의 음성을 녹음하고 있습니다. 회의 종료 후 AI가 녹음 내용을 분석합니다.'
            : 'AI 회의록을 생성하려면 회의 중 녹음을 시작해주세요.'}
        </p>
      </div>

      <section>
        <h3 className="text-sm font-semibold text-[#101211]">
          AI 회의록
        </h3>

        <div className="mt-3 rounded-xl border border-[#EDF0EF] bg-[#FAFBFA] px-4 py-4">
          <p className="text-xs font-medium text-[#59625F]">
            회의 종료 후 생성됩니다.
          </p>

          <p className="mt-2 text-[11px] leading-5 text-[#8A9490]">
            녹음된 회의 내용을
            기반으로 요약, 주요
            결정사항, 논의 이슈를
            정리합니다.
          </p>
        </div>
      </section>

      <section className="mt-5">
        <h3 className="text-sm font-semibold text-[#101211]">
          Action Items
        </h3>

        <div className="mt-3 rounded-xl border border-[#EDF0EF] bg-[#FAFBFA] px-4 py-4">
          <p className="text-xs font-medium text-[#59625F]">
            회의 종료 후 확인할 수
            있습니다.
          </p>

          <p className="mt-2 text-[11px] leading-5 text-[#8A9490]">
            AI가 회의에서 나온 할
            일을 추출하고 담당자와
            기한을 정리합니다.
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
  messages = [],
  onSendMessage,
  isRecording = false,
}) {
  const isChat =
    type === 'chat';

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

      <div
        className={`min-h-0 flex-1 p-4 ${isChat
          ? 'overflow-hidden'
          : 'overflow-y-auto'
          }`}
      >
        {type ===
          'participants' && (
            <ParticipantsPanel
              participants={
                participants
              }
            />
          )}

        {type === 'chat' && (
          <ChatPanel
            messages={
              messages
            }
            onSendMessage={
              onSendMessage
            }
          />
        )}

        {type === 'ai' && (
          <AiMinutesPanel
            isRecording={
              isRecording
            }
          />
        )}
      </div>
    </aside>
  );
}

export default MeetingSidePanel;
