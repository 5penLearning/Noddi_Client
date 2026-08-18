import { useEffect, useRef, useState } from 'react';

import chevronIcon from '../../assets/icons/profile/chevron.svg';
import logoSimpleIcon from '../../assets/icons/sidebar/logo-simple.svg';
import ProfileAvatar from '../common/ProfileAvatar';

export default function AiReplyStatus({
  replies,
  projects,
  isLoading,
  errorMessage,
  onDetail,
  onReference,
}) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedReplyIndex, setSelectedReplyIndex] = useState(0);
  const [isAnswerOverflowing, setIsAnswerOverflowing] = useState(false);
  const answerRef = useRef(null);
  const selectedProject = projects.find(
    (project) =>
      Number(project.projectId) === Number(selectedProjectId) && project.unreadAnswerCount > 0,
  );
  const activeProjectId =
    selectedProject?.projectId ??
    projects.find((project) => project.unreadAnswerCount > 0)?.projectId;
  const projectReplies = replies.filter(
    (reply) => Number(reply.projectId) === Number(activeProjectId),
  );
  const selectedReply = projectReplies[selectedReplyIndex];

  const moveReply = (direction) => {
    setSelectedReplyIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0) return projectReplies.length - 1;
      if (nextIndex >= projectReplies.length) return 0;

      return nextIndex;
    });
  };

  useEffect(() => {
    const answerElement = answerRef.current;

    if (!answerElement) return;

    setIsAnswerOverflowing(answerElement.scrollHeight > 240);
  }, [selectedReply]);

  useEffect(() => {
    if (selectedReplyIndex >= projectReplies.length) {
      setSelectedReplyIndex(0);
    }
  }, [projectReplies.length, selectedReplyIndex]);

  if (isLoading || errorMessage || !selectedReply) {
    return (
      <section className="flex h-full min-h-[712px] flex-col overflow-hidden rounded-[10px] bg-white px-4 pt-5">
        <div className="flex items-end gap-2">
          <h2 className="text-[20px] leading-[1.3] font-semibold text-black">AI 답변 현황</h2>
          <p className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#8E9592]">
            내가 없는 동안 쌓인 답변이에요.
          </p>
        </div>
        <p className="flex flex-1 items-center justify-center text-[14px] text-[var(--color-gray-500)]">
          {isLoading
            ? 'AI 답변을 불러오는 중입니다.'
            : errorMessage || '새로 쌓인 AI 답변이 없습니다.'}
        </p>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-[712px] flex-col overflow-hidden rounded-[10px] bg-white">
      <div className="shrink-0 px-4 pt-5">
        <div className="flex items-end gap-2">
          <h2 className="text-[20px] leading-[1.3] font-semibold text-black">AI 답변 현황</h2>
          <p className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#8E9592]">
            내가 없는 동안 쌓인 답변이에요.
          </p>
        </div>

        <div className="mt-3 flex [scrollbar-width:none] gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {projects.map((project) => {
            const count = project.unreadAnswerCount ?? 0;

            return (
              <button
                key={project.projectId}
                type="button"
                disabled={count === 0}
                onClick={() => {
                  setSelectedProjectId(project.projectId);
                  setSelectedReplyIndex(0);
                }}
                className={`flex h-[30px] shrink-0 items-center gap-2 rounded-[30px] py-1.5 pr-1.5 pl-3 text-[14px] leading-[1.3] tracking-[-0.28px] ${
                  Number(activeProjectId) === Number(project.projectId)
                    ? 'bg-[#101211] text-white'
                    : 'bg-[#F2F7F4] text-[#343836] disabled:opacity-50'
                }`}
              >
                {project.projectName}
                <span
                  className={`flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[12px] font-medium tracking-[-0.24px] ${
                    Number(activeProjectId) === Number(project.projectId)
                      ? 'bg-[#6EFFC0] text-[#101211]'
                      : 'bg-[#C5CCC9] text-white'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 flex-col gap-8 rounded-[10px] bg-gradient-to-b from-[#FAFAFA] to-white p-5">
        <div className="flex h-6 shrink-0 items-center justify-between">
          <button
            type="button"
            onClick={() => moveReply(-1)}
            className="flex size-6 items-center justify-center text-[30px] leading-none text-[#343836]"
          >
            <img src={chevronIcon} className="h-[7px] w-[15px] -rotate-90" />
          </button>
          <strong className="text-[16px] leading-[1.3] font-semibold text-[#343836]">
            {selectedReplyIndex + 1}/{projectReplies.length}
          </strong>
          <button
            type="button"
            onClick={() => moveReply(1)}
            className="flex size-6 items-center justify-center text-[30px] leading-none text-[#343836]"
          >
            <img src={chevronIcon} className="h-[7px] w-[15px] rotate-90" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className={`flex flex-col ${selectedReply.isMine ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2">
              <ProfileAvatar
                userId={selectedReply.questionerId}
                profileImageUrl={selectedReply.profileImageUrl}
                name={selectedReply.name}
                fallbackSrc={logoSimpleIcon}
                className="size-6 shrink-0 border border-[#D7DEDB] bg-[#E9EFED]"
              />
              <strong className="text-[16px] leading-[1.3] font-medium text-black">
                {selectedReply.name}
              </strong>
              {selectedReply.role && (
                <span className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#8E9592]">
                  {selectedReply.role}
                </span>
              )}
            </div>

            <div className="mt-[10px] w-[min(328px,calc(100%-32px))] rounded-[10px] bg-[#E9EFED] px-3 py-2">
              <p className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#101211]">
                {selectedReply.question}
              </p>
              <time className="mt-1 block text-[14px] leading-[1.3] tracking-[-0.28px] text-[#A9B0AD]">
                {selectedReply.time}
              </time>
            </div>
          </div>

          <div
            className={`mt-5 flex min-h-0 w-[84%] flex-1 flex-col ${
              selectedReply.isMine ? 'mr-auto items-start' : 'ml-auto items-end'
            }`}
          >
            <p
              className={`w-full text-[14px] leading-[1.3] tracking-[-0.28px] text-[#A9B0AD] ${
                selectedReply.isMine ? 'text-left' : 'text-right'
              }`}
            >
              {selectedReply.projectName}/{selectedReply.teamName}
            </p>
            <div className="relative mt-3 w-full">
              <p
                ref={answerRef}
                className={`text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-pre-line text-[#343836] ${
                  selectedReply.isMine ? 'text-left' : 'text-right'
                } ${isAnswerOverflowing ? 'line-clamp-[12] max-h-[240px] overflow-hidden' : ''}`}
              >
                {selectedReply.answer}
              </p>
              {isAnswerOverflowing && (
                <span className="pointer-events-none absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-b from-transparent to-white" />
              )}
            </div>
            <p
              className={`mt-3 w-full text-[14px] leading-[1.4] tracking-[-0.21px] whitespace-pre-line text-[#A9B0AD] ${
                selectedReply.isMine ? 'text-left' : 'text-right'
              }`}
            >
              {selectedReply.status}
            </p>

            <button
              type="button"
              onClick={() => onDetail(selectedReply)}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#E9EFED] text-[16px] leading-[1.3] font-semibold text-[#343836]"
            >
              자세히 보기
            </button>
            <button
              type="button"
              disabled={!selectedReply.referenceId}
              onClick={() => onReference(selectedReply)}
              className="mt-3 flex h-[42px] w-full items-center justify-between rounded-[10px] border border-[#8E9592] px-3 text-[14px] leading-[1.4] tracking-[-0.21px] text-[#343836] disabled:opacity-50"
            >
              <span>
                <strong className="mr-2 font-medium">참고 회의록</strong>
                {selectedReply.reference}
              </span>
              <img src={chevronIcon} className="h-[7px] w-[15px] -rotate-90 opacity-40" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
