import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useLocation } from 'react-router-dom';

import {
  createQuestion,
  getMyQuestions,
  getQuestionDetail,
  getTeamQaFeed,
  reviseAnswer,
} from '../../api/qaApi';

import { getMyProfile } from '../../api/mypageApi';
import { getMemberProjects } from '../../api/projects';
import { getMyTeams, getProjectTeams } from '../../api/teams';

import ProfileAvatar from '../../components/common/ProfileAvatar';

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 7H19M5 12H19M5 17H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 11C19.5 7.1 16.1 4 12 4C8.7 4 5.8 6 4.6 8.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M4 5V9H8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4 13C4.5 16.9 7.9 20 12 20C15.3 20 18.2 18 19.4 15.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M20 19V15H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4L21 12L4 20L7 12L4 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M7 12H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3C12.7 7.3 15 9.3 19 10C15 10.7 12.7 12.7 12 17C11.3 12.7 9 10.7 5 10C9 9.3 11.3 7.3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M18.5 15C18.8 17 19.8 18 22 18.5C19.8 19 18.8 20 18.5 22C18.2 20 17.2 19 15 18.5C17.2 18 18.2 17 18.5 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13.5 6.5L17.5 10.5M4 20L8.2 19.2L19 8.4C20.1 7.3 20.1 5.5 19 4.4C17.9 3.3 16.1 3.3 15 4.4L4.2 15.2L4 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SourceIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 3H14L19 8V21H6V3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M14 3V8H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LoadingSpinner({ size = 24 }) {
  return (
    <div
      className="animate-spin rounded-full border-[3px] border-[#DDF4E8] border-t-[#31F5A0]"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}

const STATUS_MAP = {
  PENDING: {
    label: '답변 대기 중',
    shortLabel: '답변 대기 중',
    textClassName: 'text-[#667B72]',
  },

  PROCESSING: {
    label: 'AI가 답변을 생성하고 있어요',
    shortLabel: 'AI 답변 중...',
    textClassName: 'text-[#137A50]',
  },

  ANSWERED: {
    label: '답변 완료',
    shortLabel: '답변 완료',
    textClassName: 'text-[#137A50]',
  },

  FAILED: {
    label: '답변 생성에 실패했어요',
    shortLabel: '답변 실패',
    textClassName: 'text-[#F64E42]',
  },

  MANUAL_REQUIRED: {
    label: '팀원의 직접 답변이 필요해요',
    shortLabel: '팀 답변 필요',
    textClassName: 'text-[#A96627]',
  },

  TEAM_ANSWER_PENDING: {
    label: '팀원의 답변을 기다리고 있어요',
    shortLabel: '팀 답변 대기',
    textClassName: 'text-[#39738F]',
  },
};

function getStatus(status) {
  return STATUS_MAP[status] ?? STATUS_MAP.PENDING;
}

function getPageContent(response) {
  const result = response?.result;

  if (Array.isArray(result?.content)) {
    return result.content;
  }

  return [];
}

function normalizeFeedItem(item, feed) {
  const question = item?.question ?? {};

  return {
    questionId: question.questionId,
    targetTeamId: feed?.teamId,
    targetTeamName: feed?.teamName,
    questionerId: question.questionerId,
    questionerName: question.questionerName,
    questionerDepartment: question.questionerDepartment,
    questionerPosition: question.questionerPosition,
    questionerProfileImageUrl: question.questionerProfileImageUrl,
    content: question.content,
    createdAt: question.createdAt,
    status: item?.status,
    answer: item?.answer ?? null,
    canAnswer: Boolean(item?.canAnswer),
  };
}

function formatTime(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDate(value) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
  });
}

function getAnswerLabel(answerType) {
  if (answerType === 'TEAM') {
    return '팀 답변';
  }

  if (answerType === 'SYSTEM') {
    return '시스템 답변';
  }

  return 'Noddi AI';
}

function getQuestionStatusText(question) {
  if (question?.answer?.revised) {
    return {
      label: '답변이 수정되었어요',
      className: 'text-[#F64E42]',
    };
  }

  const status = getStatus(question?.status);

  return {
    label: status.shortLabel,
    className: status.textClassName,
  };
}

function QuestionListItem({
  question,
  selected,
  onClick,
}) {
  const status = getQuestionStatusText(question);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[12px] px-3.5 py-3.5 text-left transition ${selected
        ? 'bg-[#DFFFF0]'
        : 'hover:bg-[#F2FFF8]'
        }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${selected
            ? 'bg-[#31F5A0] text-[#101211]'
            : 'bg-[#EFFFF7] text-[#177551]'
            }`}
        >
          Q
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate text-[14px] font-semibold text-[#101211]">
              {question.targetTeamName ?? '팀 Q&A'}
            </p>

            <span className="shrink-0 pt-0.5 text-[11px] text-[#758B81]">
              {formatTime(question.createdAt)}
            </span>
          </div>

          <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-[#5D746A]">
            {question.content}
          </p>

          <p
            className={`mt-2 truncate text-[12px] font-medium ${status.className}`}
          >
            {status.label}
          </p>
        </div>
      </div>
    </button>
  );
}

function EmptyState({ children }) {
  return (
    <div className="px-4 py-7 text-center">
      <p className="text-[13px] leading-5 text-[#71877D]">
        {children}
      </p>
    </div>
  );
}

function SourceCard({ source }) {
  return (
    <div className="rounded-[12px] border border-[#D7EDE2] bg-white px-4 py-3.5">
      <div className="flex items-center gap-2.5">
        <span className="shrink-0 text-[#49695B]">
          <SourceIcon />
        </span>

        <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#29483B]">
          {source.sourceTitle ?? '참고 자료'}
        </p>

        <span className="shrink-0 rounded-full bg-[#EFFFF7] px-2.5 py-1 text-[11px] font-medium text-[#39735A]">
          {source.sourceType === 'TRANSCRIPT'
            ? '회의 기록'
            : '팀 페이지'}
        </span>
      </div>

      {source.excerpt && (
        <p className="mt-2.5 line-clamp-4 whitespace-pre-wrap text-[12px] leading-5 text-[#687F75]">
          {source.excerpt}
        </p>
      )}
    </div>
  );
}

function ConversationSidebar({
  teams,
  selectedTeamId,
  myQuestions,
  recentQuestions,
  selectedQuestionId,
  hasNext,
  isLoadingFeed,
  isLoadingMore,
  onSelectTeam,
  onNewChat,
  onSelectQuestion,
  onRefresh,
  onLoadMore,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      {/* 프로젝트 선택 색상이 이어지는 영역 */}
      <div className="shrink-0 bg-[#31F5A0] px-4 pb-5 pt-4">
        <p className="text-[14px] font-semibold text-[#101211]">
          팀 선택
        </p>

        <div className="mt-3 space-y-2">
          {teams.length === 0 ? (
            <p className="rounded-[10px] bg-white/55 px-3 py-3 text-[13px] text-[#355447]">
              프로젝트에 팀이 없습니다.
            </p>
          ) : (
            teams.map((team) => {
              const selected =
                Number(selectedTeamId) === Number(team.id);

              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => onSelectTeam(team.id)}
                  className={`flex h-11 w-full items-center rounded-[11px] px-4 text-left text-[14px] font-semibold transition ${selected
                    ? 'bg-white text-[#101211] shadow-[0_3px_10px_rgba(16,18,17,0.08)]'
                    : 'bg-white/35 text-[#254537] hover:bg-white/60'
                    }`}
                >
                  <span className="truncate">
                    {team.name}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="shrink-0 border-b border-[#E1F0E8] p-3.5">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!selectedTeamId}
            onClick={onNewChat}
            className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-[11px] bg-[#E8FFF3] text-[13px] font-semibold text-[#147950] transition hover:bg-[#DFFFF0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PlusIcon />
            새 질문
          </button>

          <button
            type="button"
            onClick={onRefresh}
            className="flex size-11 shrink-0 items-center justify-center rounded-[11px] border border-[#D6EADF] text-[#47675A] transition hover:bg-[#F2FFF8]"
            aria-label="새로고침"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
        <div className="px-2 pb-2 pt-2">
          <p className="text-[13px] font-semibold text-[#536B60]">
            내 질문
          </p>
        </div>

        {myQuestions.length === 0 ? (
          <EmptyState>
            아직 작성한 질문이 없습니다.
          </EmptyState>
        ) : (
          <div className="space-y-1">
            {myQuestions.map((question) => (
              <QuestionListItem
                key={`MY-${question.questionId}`}
                question={question}
                selected={
                  Number(selectedQuestionId) ===
                  Number(question.questionId)
                }
                onClick={() => onSelectQuestion(question)}
              />
            ))}
          </div>
        )}

        <div className="mx-2 my-5 border-t border-[#E3F1EA]" />

        <div className="px-2 pb-2">
          <p className="text-[13px] font-semibold text-[#536B60]">
            최근
          </p>
        </div>

        {isLoadingFeed ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size={22} />
          </div>
        ) : recentQuestions.length === 0 ? (
          <EmptyState>
            선택한 팀에 등록된 질문이 없습니다.
          </EmptyState>
        ) : (
          <>
            <div className="space-y-1">
              {recentQuestions.map((question) => (
                <QuestionListItem
                  key={`FEED-${question.questionId}`}
                  question={question}
                  selected={
                    Number(selectedQuestionId) ===
                    Number(question.questionId)
                  }
                  onClick={() => onSelectQuestion(question)}
                />
              ))}
            </div>

            {hasNext && (
              <button
                type="button"
                disabled={isLoadingMore}
                onClick={onLoadMore}
                className="mt-3 h-10 w-full rounded-[10px] text-[12px] font-semibold text-[#45685A] transition hover:bg-[#EFFFF7] disabled:opacity-40"
              >
                {isLoadingMore
                  ? '불러오는 중...'
                  : '이전 질문 더 보기'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AnswerEditorPanel({
  answerDraft,
  questionDetail,
  isRevising,
  onChange,
  onSave,
  onClose,
}) {
  const answer = questionDetail?.answer;

  const sources = Array.isArray(questionDetail?.sources)
    ? questionDetail.sources
    : [];

  const hasChanged =
    answerDraft.trim() !== (answer?.content ?? '').trim();

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#FAFFFC]">
      <div className="flex shrink-0 items-start justify-between border-b border-[#DCEDE5] px-5 py-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#147950]">
              <EditIcon />
            </span>

            <h2 className="text-[17px] font-semibold text-[#101211]">
              답변 수정
            </h2>
          </div>

          <p className="mt-2 text-[13px] leading-5 text-[#687F75]">
            팀 상황에 맞게 답변 내용을 보완할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          disabled={isRevising}
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full text-[#587268] transition hover:bg-[#EFFFF7] hover:text-[#101211]"
          aria-label="답변 수정 닫기"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="qa-answer-editor"
            className="text-[14px] font-semibold text-[#29483B]"
          >
            답변 내용
          </label>

          <span className="text-[12px] text-[#71877D]">
            {answerDraft.length}/1000
          </span>
        </div>

        <textarea
          id="qa-answer-editor"
          value={answerDraft}
          maxLength={1000}
          disabled={isRevising}
          onChange={onChange}
          className="mt-3 h-[320px] w-full resize-none rounded-[13px] border border-[#CCE7D9] bg-white p-4 text-[14px] leading-6 text-[#20342C] outline-none transition focus:border-[#31F5A0]"
        />

        {sources.length > 0 && (
          <div className="mt-6">
            <p className="text-[14px] font-semibold text-[#29483B]">
              답변에 참고한 정보
            </p>

            <div className="mt-3 space-y-2">
              {sources.map((source, index) => (
                <SourceCard
                  key={`${source.citationIndex}-${source.referenceId}-${index}`}
                  source={source}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-[#DCEDE5] bg-white p-5">
        <button
          type="button"
          disabled={
            isRevising ||
            !answerDraft.trim() ||
            !hasChanged
          }
          onClick={onSave}
          className="h-12 w-full rounded-[11px] bg-[#101211] text-[14px] font-semibold text-white transition hover:bg-[#272B29] disabled:cursor-not-allowed disabled:bg-[#DCE9E3] disabled:text-[#879B92]"
        >
          {isRevising
            ? '수정 중...'
            : '답변 수정하기'}
        </button>
      </div>
    </div>
  );
}

function QAPage() {
  const location = useLocation();

  const targetQuestionId =
    location.state?.questionId ?? null;

  const targetTeamId =
    location.state?.teamId ?? null;

  const targetProjectId =
    location.state?.projectId ?? null;

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] = useState(null);

  const [
    selectedTeamId,
    setSelectedTeamId,
  ] = useState(null);

  const pendingTargetTeamIdRef = useRef(targetTeamId);

  const [
    myQuestions,
    setMyQuestions,
  ] = useState([]);

  const [
    feedQuestions,
    setFeedQuestions,
  ] = useState([]);

  const [
    feedCursor,
    setFeedCursor,
  ] = useState(null);

  const [
    feedHasNext,
    setFeedHasNext,
  ] = useState(false);

  const [
    selectedQuestion,
    setSelectedQuestion,
  ] = useState(
    targetQuestionId
      ? {
        questionId: targetQuestionId,
        targetTeamId,
      }
      : null,
  );

  const [
    questionDetail,
    setQuestionDetail,
  ] = useState(null);

  const [
    questionInput,
    setQuestionInput,
  ] = useState('');

  const [
    answerDraft,
    setAnswerDraft,
  ] = useState('');

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isLoadingTeams,
    setIsLoadingTeams,
  ] = useState(false);

  const [
    isLoadingFeed,
    setIsLoadingFeed,
  ] = useState(false);

  const [
    isLoadingMoreFeed,
    setIsLoadingMoreFeed,
  ] = useState(false);

  const [
    isLoadingDetail,
    setIsLoadingDetail,
  ] = useState(false);

  const [
    isCreating,
    setIsCreating,
  ] = useState(false);

  const [
    isRevising,
    setIsRevising,
  ] = useState(false);

  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState(false);

  const [
    isEditorOpen,
    setIsEditorOpen,
  ] = useState(false);

  const [error, setError] = useState('');

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('');

  const selectedProject = useMemo(() => {
    return (
      projects.find(
        (project) =>
          Number(project.projectId) ===
          Number(selectedProjectId),
      ) ?? null
    );
  }, [
    projects,
    selectedProjectId,
  ]);

  const selectedTeam = useMemo(() => {
    return (
      teams.find(
        (team) =>
          Number(team.id) ===
          Number(selectedTeamId),
      ) ?? null
    );
  }, [
    teams,
    selectedTeamId,
  ]);

  const projectTeamIds = useMemo(() => {
    return new Set(
      teams.map((team) => Number(team.id)),
    );
  }, [teams]);

  const projectMyQuestions = useMemo(() => {
    return myQuestions.filter((question) =>
      projectTeamIds.has(
        Number(question.targetTeamId),
      ),
    );
  }, [
    myQuestions,
    projectTeamIds,
  ]);

  const activeQuestion = useMemo(() => {
    if (
      !selectedQuestion &&
      !questionDetail
    ) {
      return null;
    }

    return {
      ...(selectedQuestion ?? {}),
      ...(questionDetail ?? {}),
    };
  }, [
    selectedQuestion,
    questionDetail,
  ]);

  const activeQuestionId =
    activeQuestion?.questionId;

  const activeAnswer =
    activeQuestion?.answer;

  const canEditAnswer = Boolean(
    questionDetail?.canAnswer &&
    activeAnswer?.answerId,
  );

  const activeSources =
    Array.isArray(questionDetail?.sources)
      ? questionDetail.sources
      : Array.isArray(activeAnswer?.sources)
        ? activeAnswer.sources
        : [];

  const isMyQuestion = Boolean(
    profile?.userId &&
    activeQuestion?.questionerId &&
    Number(profile.userId) ===
    Number(activeQuestion.questionerId),
  );

  const questionerImageUrl =
    activeQuestion?.questionerProfileImageUrl ??
    (isMyQuestion
      ? profile?.profileImageUrl
      : null);

  const questionerDepartment =
    activeQuestion?.questionerDepartment ??
    (isMyQuestion
      ? profile?.department
      : null);

  const questionerPosition =
    activeQuestion?.questionerPosition ??
    (isMyQuestion
      ? profile?.position
      : null);

  const questionerMeta = [
    questionerDepartment,
    questionerPosition,
  ]
    .filter(Boolean)
    .join(' · ');

  const loadMyQuestionList = useCallback(async () => {
    const response = await getMyQuestions();

    const questions =
      getPageContent(response);

    setMyQuestions(questions);

    return questions;
  }, []);

  const loadQuestionDetail = useCallback(
    async (questionId) => {
      if (!questionId) {
        setQuestionDetail(null);
        setAnswerDraft('');

        return null;
      }

      try {
        setIsLoadingDetail(true);

        const response =
          await getQuestionDetail(
            questionId,
          );

        const detail =
          response?.result ?? null;

        setQuestionDetail(detail);

        setAnswerDraft(
          detail?.answer?.content ??
          '',
        );

        setFeedQuestions(
          (previous) =>
            previous.map(
              (question) =>
                Number(
                  question.questionId,
                ) ===
                  Number(questionId)
                  ? {
                    ...question,
                    status:
                      detail?.status ??
                      question.status,
                    answer:
                      detail?.answer ??
                      question.answer,
                    canAnswer:
                      detail?.canAnswer ??
                      question.canAnswer,
                  }
                  : question,
            ),
        );

        return detail;
      } catch (requestError) {
        console.error(
          'Failed to load question detail:',
          requestError,
        );

        setError(
          requestError?.response?.data
            ?.message ??
          '질문 정보를 불러오지 못했습니다.',
        );

        return null;
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [],
  );

  const loadTeamFeed = useCallback(
    async (
      teamId,
      {
        cursor,
        append = false,
      } = {},
    ) => {
      if (!teamId) {
        setFeedQuestions([]);
        setFeedCursor(null);
        setFeedHasNext(false);

        return [];
      }

      try {
        if (append) {
          setIsLoadingMoreFeed(true);
        } else {
          setIsLoadingFeed(true);
        }

        const feed =
          await getTeamQaFeed(
            teamId,
            {
              cursor,
              size: 20,
            },
          );

        const nextQuestions =
          Array.isArray(feed?.items)
            ? feed.items.map(
              (item) =>
                normalizeFeedItem(
                  item,
                  feed,
                ),
            )
            : [];

        if (append) {
          setFeedQuestions(
            (previous) => {
              const ids = new Set(
                previous.map(
                  (question) =>
                    Number(
                      question.questionId,
                    ),
                ),
              );

              return [
                ...previous,
                ...nextQuestions.filter(
                  (question) =>
                    !ids.has(
                      Number(
                        question.questionId,
                      ),
                    ),
                ),
              ];
            },
          );
        } else {
          setFeedQuestions(nextQuestions);
        }

        setFeedCursor(
          feed?.nextCursor ?? null,
        );

        setFeedHasNext(
          Boolean(feed?.hasNext),
        );

        return nextQuestions;
      } catch (requestError) {
        console.error(
          'Failed to load team feed:',
          requestError,
        );

        if (!append) {
          setFeedQuestions([]);
          setFeedCursor(null);
          setFeedHasNext(false);
        }

        setError(
          requestError?.response?.data
            ?.message ??
          '팀 Q&A를 불러오지 못했습니다.',
        );

        return [];
      } finally {
        setIsLoadingFeed(false);
        setIsLoadingMoreFeed(false);
      }
    },
    [],
  );

  const loadProjectTeams = useCallback(
    async (projectId) => {
      if (!projectId) {
        setTeams([]);
        setSelectedTeamId(null);

        return [];
      }

      try {
        setIsLoadingTeams(true);

        const nextTeams =
          await getProjectTeams(
            projectId,
          );

        setTeams(nextTeams);

        const pendingTargetTeamId = pendingTargetTeamIdRef.current;
        const preferredTeam =
          pendingTargetTeamId &&
            nextTeams.some(
              (team) =>
                Number(team.id) ===
                Number(
                  pendingTargetTeamId,
                ),
            )
            ? pendingTargetTeamId
            : nextTeams[0]?.id ??
            null;

        setSelectedTeamId(
          preferredTeam,
        );

        pendingTargetTeamIdRef.current = null;

        return nextTeams;
      } catch (requestError) {
        console.error(
          'Failed to load project teams:',
          requestError,
        );

        setTeams([]);
        setSelectedTeamId(null);

        setError(
          requestError?.response?.data
            ?.message ??
          '프로젝트 팀을 불러오지 못했습니다.',
        );

        return [];
      } finally {
        setIsLoadingTeams(false);
      }
    },
    [],
  );

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const [
        profileResponse,
        questionResponse,
        myTeamResponse,
      ] = await Promise.all([
        getMyProfile(),
        getMyQuestions(),
        getMyTeams(),
      ]);

      const profileData =
        profileResponse?.result ?? null;

      const questions =
        getPageContent(
          questionResponse,
        );

      setProfile(profileData);
      setMyQuestions(questions);

      let memberProjects = [];

      if (profileData?.userId) {
        try {
          memberProjects =
            await getMemberProjects(
              profileData.userId,
            );
        } catch (projectError) {
          console.error(
            'Failed to load member projects:',
            projectError,
          );
        }
      }

      if (
        memberProjects.length === 0
      ) {
        const projectMap =
          new Map();

        myTeamResponse.forEach(
          (team) => {
            if (!team.projectId) {
              return;
            }

            if (
              projectMap.has(
                Number(
                  team.projectId,
                ),
              )
            ) {
              return;
            }

            projectMap.set(
              Number(team.projectId),
              {
                projectId:
                  team.projectId,
                name:
                  team.projectName ??
                  '프로젝트',
              },
            );
          },
        );

        memberProjects =
          Array.from(
            projectMap.values(),
          );
      }

      setProjects(memberProjects);

      const targetMyTeam =
        myTeamResponse.find(
          (team) =>
            Number(team.teamId) ===
            Number(targetTeamId),
        );

      const preferredProjectId =
        targetProjectId &&
          memberProjects.some(
            (project) =>
              Number(project.projectId) ===
              Number(targetProjectId),
          )
          ? targetProjectId
          : targetMyTeam?.projectId &&
          memberProjects.some(
            (project) =>
              Number(
                project.projectId,
              ) ===
              Number(
                targetMyTeam.projectId,
              ),
          )
          ? targetMyTeam.projectId
          : memberProjects[0]
            ?.projectId ??
          null;

      setSelectedProjectId(
        preferredProjectId,
      );
    } catch (requestError) {
      console.error(
        'Failed to load Q&A:',
        requestError,
      );

      setError(
        requestError?.response?.data
          ?.message ??
        'Q&A 정보를 불러오지 못했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [targetProjectId, targetTeamId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (!selectedProjectId) {
      return;
    }

    loadProjectTeams(
      selectedProjectId,
    );
  }, [
    selectedProjectId,
    loadProjectTeams,
  ]);

  useEffect(() => {
    if (!selectedTeamId) {
      setFeedQuestions([]);
      setFeedCursor(null);
      setFeedHasNext(false);

      return;
    }

    loadTeamFeed(selectedTeamId);
  }, [
    selectedTeamId,
    loadTeamFeed,
  ]);

  useEffect(() => {
    if (
      !selectedQuestion?.questionId
    ) {
      setQuestionDetail(null);
      setAnswerDraft('');

      return;
    }

    loadQuestionDetail(
      selectedQuestion.questionId,
    );
  }, [
    selectedQuestion?.questionId,
    loadQuestionDetail,
  ]);

  useEffect(() => {
    const status =
      questionDetail?.status;

    const shouldPoll = [
      'PENDING',
      'PROCESSING',
      'MANUAL_REQUIRED',
      'TEAM_ANSWER_PENDING',
    ].includes(status);

    if (
      !shouldPoll ||
      !questionDetail?.questionId
    ) {
      return undefined;
    }

    const intervalId =
      window.setInterval(
        () => {
          loadQuestionDetail(
            questionDetail.questionId,
          );
        },
        3000,
      );

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    questionDetail?.questionId,
    questionDetail?.status,
    loadQuestionDetail,
  ]);

  useEffect(() => {
    setIsEditorOpen(false);
  }, [activeQuestionId]);

  const handleSelectProject = (
    projectId,
  ) => {
    if (
      Number(projectId) ===
      Number(selectedProjectId)
    ) {
      return;
    }

    pendingTargetTeamIdRef.current = null;
    setSelectedProjectId(projectId);
    setSelectedTeamId(null);
    setSelectedQuestion(null);
    setQuestionDetail(null);
    setQuestionInput('');
    setIsEditorOpen(false);
    setError('');
    setSuccessMessage('');
  };

  const handleSelectTeam = (
    teamId,
  ) => {
    setSelectedTeamId(teamId);
    setSelectedQuestion(null);
    setQuestionDetail(null);
    setQuestionInput('');
    setIsEditorOpen(false);
    setIsSidebarOpen(false);
    setError('');
    setSuccessMessage('');
  };

  const handleSelectQuestion = (
    question,
  ) => {
    if (
      question?.targetTeamId &&
      Number(
        question.targetTeamId,
      ) !== Number(selectedTeamId)
    ) {
      setSelectedTeamId(
        question.targetTeamId,
      );
    }

    setSelectedQuestion(question);
    setIsSidebarOpen(false);
    setIsEditorOpen(false);
    setError('');
    setSuccessMessage('');
  };

  const handleNewChat = () => {
    setSelectedQuestion(null);
    setQuestionDetail(null);
    setQuestionInput('');
    setIsEditorOpen(false);
    setIsSidebarOpen(false);
    setSuccessMessage('');

    window.setTimeout(() => {
      document
        .getElementById(
          'qa-question-input',
        )
        ?.focus();
    }, 0);
  };

  const handleRefresh = async () => {
    try {
      setError('');
      setSuccessMessage('');

      await Promise.all([
        loadMyQuestionList(),

        selectedTeamId
          ? loadTeamFeed(
            selectedTeamId,
          )
          : Promise.resolve(),

        activeQuestionId
          ? loadQuestionDetail(
            activeQuestionId,
          )
          : Promise.resolve(),
      ]);
    } catch (requestError) {
      setError(
        requestError?.response?.data
          ?.message ??
        'Q&A를 새로고침하지 못했습니다.',
      );
    }
  };

  const handleLoadMore = async () => {
    if (
      !selectedTeamId ||
      !feedCursor ||
      !feedHasNext ||
      isLoadingMoreFeed
    ) {
      return;
    }

    await loadTeamFeed(
      selectedTeamId,
      {
        cursor: feedCursor,
        append: true,
      },
    );
  };

  const handleSubmitQuestion = async (
    event,
  ) => {
    event.preventDefault();

    const content =
      questionInput.trim();

    if (
      !content ||
      !selectedTeamId ||
      isCreating
    ) {
      return;
    }

    try {
      setIsCreating(true);
      setError('');
      setSuccessMessage('');

      const response =
        await createQuestion({
          targetTeamId:
            selectedTeamId,
          content,
        });

      const created =
        response?.result;

      const createdQuestion = {
        questionId:
          created?.questionId,
        targetTeamId:
          selectedTeamId,
        targetTeamName:
          selectedTeam?.name ??
          '팀',
        questionerId:
          profile?.userId,
        questionerName:
          profile?.name ?? '나',
        questionerDepartment:
          profile?.department,
        questionerPosition:
          profile?.position,
        questionerProfileImageUrl:
          profile?.profileImageUrl,
        content,
        status:
          created?.status ??
          'PENDING',
        createdAt:
          new Date().toISOString(),
      };

      setQuestionInput('');

      if (created?.questionId) {
        setSelectedQuestion(
          createdQuestion,
        );
      }

      await Promise.all([
        loadMyQuestionList(),
        loadTeamFeed(
          selectedTeamId,
        ),
      ]);

      setSuccessMessage(
        '질문을 등록했습니다.',
      );
    } catch (requestError) {
      console.error(
        'Failed to create question:',
        requestError,
      );

      setError(
        requestError?.response?.data
          ?.message ??
        '질문을 등록하지 못했습니다.',
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuestionKeyDown = (
    event,
  ) => {
    if (
      event.key !== 'Enter' ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();

    if (
      !questionInput.trim() ||
      !selectedTeamId ||
      isCreating
    ) {
      return;
    }

    event.currentTarget.form?.requestSubmit();
  };

  const handleReviseAnswer = async () => {
    const answerId =
      questionDetail?.answer
        ?.answerId;

    const content =
      answerDraft.trim();

    if (
      !answerId ||
      !content ||
      !questionDetail?.canAnswer ||
      isRevising
    ) {
      return;
    }

    try {
      setIsRevising(true);
      setError('');
      setSuccessMessage('');

      await reviseAnswer(
        answerId,
        content,
      );

      await Promise.all([
        loadQuestionDetail(
          questionDetail.questionId,
        ),

        selectedTeamId
          ? loadTeamFeed(
            selectedTeamId,
          )
          : Promise.resolve(),

        loadMyQuestionList(),
      ]);

      setIsEditorOpen(false);

      setSuccessMessage(
        '답변을 수정했습니다.',
      );
    } catch (requestError) {
      console.error(
        'Failed to revise answer:',
        requestError,
      );

      setError(
        requestError?.response?.data
          ?.message ??
        '답변을 수정하지 못했습니다.',
      );
    } finally {
      setIsRevising(false);
    }
  };

  const activeStatus =
    getStatus(
      activeQuestion?.status,
    );

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <header className="shrink-0">
        <div className="flex items-center justify-end gap-4 pb-5">
          <button
            type="button"
            onClick={() =>
              setIsSidebarOpen(true)
            }
            className="flex h-11 items-center gap-2 rounded-[11px] border border-[#D4E9DF] bg-white px-4 text-[13px] font-semibold text-[#355C4B] lg:hidden"
          >
            <MenuIcon />

            {selectedTeam?.name ??
              '대화 목록'}
          </button>
        </div>

        {/* 프로젝트 탭 */}
        <div className="relative z-20 flex min-h-[56px] items-end gap-2 overflow-x-auto overflow-y-hidden">
          {projects.map(
            (project) => {
              const selected =
                Number(
                  project.projectId,
                ) ===
                Number(
                  selectedProjectId,
                );

              return (
                <button
                  key={
                    project.projectId
                  }
                  type="button"
                  onClick={() =>
                    handleSelectProject(
                      project.projectId,
                    )
                  }
                  className={`relative shrink-0 text-[14px] font-semibold transition ${selected
                    ? 'z-20 h-[56px] min-w-[190px] rounded-t-[14px] border border-b-0 border-[#31F5A0] bg-[#31F5A0] px-7 text-[#101211]'
                    : 'mb-[8px] h-11 min-w-[165px] rounded-[11px] border border-[#D6E9DF] bg-white px-5 text-[#50675D] hover:bg-[#F2FFF8]'
                    }`}
                >
                  {project.name}

                  {selected && (
                    <span className="absolute -bottom-[12px] left-0 right-0 h-[14px] bg-[#31F5A0]" />
                  )}
                </button>
              );
            },
          )}

          {projects.length === 0 &&
            !isLoading && (
              <div className="mb-[8px] flex h-11 items-center rounded-[11px] border border-dashed border-[#D6E9DF] px-5 text-[13px] text-[#6F857B]">
                참여 중인 프로젝트가 없습니다.
              </div>
            )}
        </div>
      </header>

      {error && (
        <div className="mb-3 mt-3 shrink-0 rounded-[12px] border border-[#FFD6D1] bg-[#FFF6F5] px-4 py-3 text-[13px] text-[#D84A40]">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-3 mt-3 shrink-0 rounded-[12px] border border-[#BFEFD6] bg-[#ECFFF5] px-4 py-3 text-[13px] text-[#14794F]">
          {successMessage}
        </div>
      )}

      <section className="relative z-10 -mt-px flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-[18px] rounded-tr-[18px] border border-[#C9EADD] bg-white">
        {/* 프로젝트 선택색을 메인 영역까지 확장 */}
        <div className="h-[10px] w-full shrink-0 bg-[#31F5A0]" />

        <div className="flex min-h-0 flex-1">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <div className="flex justify-center">
                  <LoadingSpinner />
                </div>

                <p className="mt-4 text-[14px] text-[#60766C]">
                  Q&A를 불러오고 있습니다.
                </p>
              </div>
            </div>
          ) : (
            <>
              <aside className="hidden w-[290px] shrink-0 border-r border-[#DEECE5] lg:block">
                <ConversationSidebar
                  teams={teams}
                  selectedTeamId={
                    selectedTeamId
                  }
                  myQuestions={
                    projectMyQuestions
                  }
                  recentQuestions={
                    feedQuestions
                  }
                  selectedQuestionId={
                    activeQuestionId
                  }
                  hasNext={
                    feedHasNext
                  }
                  isLoadingFeed={
                    isLoadingFeed ||
                    isLoadingTeams
                  }
                  isLoadingMore={
                    isLoadingMoreFeed
                  }
                  onSelectTeam={
                    handleSelectTeam
                  }
                  onNewChat={
                    handleNewChat
                  }
                  onSelectQuestion={
                    handleSelectQuestion
                  }
                  onRefresh={
                    handleRefresh
                  }
                  onLoadMore={
                    handleLoadMore
                  }
                />
              </aside>

              <main className="flex min-w-0 flex-1 flex-col bg-white">
                <div className="flex min-h-[70px] shrink-0 items-center justify-between gap-4 border-b border-[#DFEEE7] px-5 sm:px-7">
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-semibold text-[#101211]">
                      {selectedTeam?.name ??
                        '팀을 선택해주세요'}
                    </p>

                    <p className="mt-1 truncate text-[12px] text-[#6E8379]">
                      {selectedProject?.name ??
                        ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {activeQuestion && (
                      <span
                        className={`hidden text-[12px] font-medium sm:block ${activeStatus.textClassName}`}
                      >
                        {activeStatus.label}
                      </span>
                    )}

                    {canEditAnswer && (
                      <button
                        type="button"
                        onClick={() =>
                          setIsEditorOpen(
                            true,
                          )
                        }
                        className="flex h-10 items-center gap-2 rounded-[10px] bg-[#101211] px-4 text-[13px] font-semibold text-white transition hover:bg-[#292D2B]"
                      >
                        <EditIcon />
                        답변 수정
                      </button>
                    )}
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto bg-[#FCFFFD] px-5 py-7 sm:px-7 lg:px-10">
                  {!selectedTeamId ? (
                    <div className="flex h-full min-h-[360px] items-center justify-center">
                      <div className="max-w-[360px] text-center">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-[18px] bg-[#EFFFF7] text-[#16885B]">
                          <SparkleIcon />
                        </div>

                        <h2 className="mt-5 text-[18px] font-semibold text-[#101211]">
                          질문할 팀을 선택해주세요
                        </h2>

                        <p className="mt-2 text-[14px] leading-6 text-[#60766C]">
                          프로젝트의 팀을 선택하면 해당 팀의 정보와 회의록을 기반으로 질문할 수 있습니다.
                        </p>
                      </div>
                    </div>
                  ) : !activeQuestion ? (
                    <div className="flex h-full min-h-[360px] items-center justify-center">
                      <div className="max-w-[390px] text-center">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#31F5A0] text-[#101211]">
                          <SparkleIcon />
                        </div>

                        <h2 className="mt-5 text-[18px] font-semibold text-[#101211]">
                          {selectedTeam?.name}에 질문해보세요
                        </h2>

                        <p className="mt-2 text-[14px] leading-6 text-[#60766C]">
                          팀에서 공유한 정보와 회의 기록을 바탕으로 Noddi AI가 답변을 생성합니다.
                        </p>
                      </div>
                    </div>
                  ) : isLoadingDetail ? (
                    <div className="flex h-full min-h-[360px] items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="mx-auto w-full max-w-[860px]">
                      {isMyQuestion ? (
                        <div className="flex justify-end">
                          <div className="max-w-[85%] sm:max-w-[72%]">
                            <div className="rounded-[18px_18px_5px_18px] border border-[#9EEAC4] bg-[#CFFFF0] px-5 py-4">
                              <p className="whitespace-pre-wrap text-[14px] leading-6 text-[#173329] sm:text-[15px]">
                                {activeQuestion.content}
                              </p>
                            </div>

                            <p className="mt-2 text-right text-[12px] text-[#748A80]">
                              {formatTime(
                                activeQuestion.createdAt,
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3.5">
                          <ProfileAvatar
                            userId={
                              activeQuestion.questionerId
                            }
                            profileImageUrl={
                              questionerImageUrl
                            }
                            name={
                              activeQuestion.questionerName ??
                              '질문자'
                            }
                            className="size-10 shrink-0 text-[13px]"
                          />

                          <div className="max-w-[85%] sm:max-w-[72%]">
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-semibold text-[#29483B]">
                                {activeQuestion.questionerName ??
                                  '질문자'}
                              </p>

                              {questionerMeta && (
                                <span className="text-[12px] text-[#748A80]">
                                  {questionerMeta}
                                </span>
                              )}
                            </div>

                            <div className="mt-2.5 rounded-[5px_18px_18px_18px] border border-[#DCECE4] bg-white px-5 py-4">
                              <p className="whitespace-pre-wrap text-[14px] leading-6 text-[#20342C] sm:text-[15px]">
                                {activeQuestion.content}
                              </p>
                            </div>

                            <p className="mt-2 text-[12px] text-[#748A80]">
                              {formatTime(
                                activeQuestion.createdAt,
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="my-8 flex items-center gap-4">
                        <div className="h-px flex-1 bg-[#DCEDE5]" />

                        <span className="text-[12px] font-medium text-[#6B8277]">
                          Noddi AI
                        </span>

                        <div className="h-px flex-1 bg-[#DCEDE5]" />
                      </div>

                      {activeAnswer?.content ? (
                        <div className="flex items-start gap-3.5">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#31F5A0] text-[#101211]">
                            <SparkleIcon />
                          </div>

                          <div className="max-w-[90%] sm:max-w-[78%]">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[14px] font-semibold text-[#101211]">
                                {getAnswerLabel(
                                  activeAnswer.answerType,
                                )}
                              </p>

                              {activeAnswer.revised && (
                                <span className="text-[12px] font-medium text-[#F64E42]">
                                  수정됨
                                </span>
                              )}
                            </div>

                            <div className="mt-2.5 rounded-[5px_18px_18px_18px] bg-[#EFFFF7] px-5 py-4.5">
                              <p className="whitespace-pre-wrap text-[14px] leading-6 text-[#20342C] sm:text-[15px]">
                                {activeAnswer.content}
                              </p>

                              {(activeAnswer.answerType ===
                                'AI' ||
                                activeAnswer.revised) && (
                                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#D1EFDF] pt-3">
                                    {activeAnswer.answerType ===
                                      'AI' && (
                                        <span className="text-[11px] text-[#637B70]">
                                          AI 답변
                                        </span>
                                      )}

                                    {activeAnswer.revised &&
                                      activeAnswer.lastRevisedByName && (
                                        <>
                                          <span className="text-[11px] text-[#A4B7AE]">
                                            ·
                                          </span>

                                          <span className="text-[11px] text-[#637B70]">
                                            {
                                              activeAnswer.lastRevisedByName
                                            }
                                            님이 수정
                                          </span>
                                        </>
                                      )}
                                  </div>
                                )}
                            </div>

                            <p className="mt-2 text-[12px] text-[#748A80]">
                              {formatTime(
                                activeAnswer.lastRevisedAt ??
                                activeAnswer.updatedAt ??
                                activeAnswer.createdAt,
                              )}
                            </p>

                            {canEditAnswer && (
                              <button
                                type="button"
                                onClick={() =>
                                  setIsEditorOpen(
                                    true,
                                  )
                                }
                                className="mt-2 flex h-9 items-center gap-2 rounded-[9px] px-2 text-[12px] font-semibold text-[#3D6855] transition hover:bg-[#E5FFF1]"
                              >
                                <EditIcon />
                                답변 수정
                              </button>
                            )}
                          </div>
                        </div>
                      ) : activeQuestion.status ===
                        'FAILED' ? (
                        <div className="flex justify-center">
                          <div className="rounded-[13px] border border-[#FFD7D2] bg-[#FFF6F5] px-6 py-5 text-center">
                            <p className="text-[14px] font-semibold text-[#D84A40]">
                              답변을 생성하지 못했습니다.
                            </p>
                          </div>
                        </div>
                      ) : activeQuestion.status ===
                        'MANUAL_REQUIRED' ? (
                        <div className="flex justify-center">
                          <div className="rounded-[13px] border border-[#FFE1C5] bg-[#FFF8F0] px-6 py-5 text-center">
                            <p className="text-[14px] font-semibold text-[#A76020]">
                              팀원의 직접 답변이 필요합니다.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3.5">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#31F5A0] text-[#101211]">
                            <SparkleIcon />
                          </div>

                          <div className="rounded-[5px_18px_18px_18px] bg-[#EFFFF7] px-5 py-4">
                            <div className="flex items-center gap-3">
                              <LoadingSpinner
                                size={18}
                              />

                              <div>
                                <p className="text-[14px] font-semibold text-[#29483B]">
                                  {activeQuestion.status ===
                                    'TEAM_ANSWER_PENDING'
                                    ? '팀원의 답변을 기다리고 있습니다.'
                                    : 'AI가 답변을 생성하고 있습니다.'}
                                </p>

                                <p className="mt-1 text-[12px] text-[#637B70]">
                                  완료되면 자동으로 표시됩니다.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeSources.length >
                        0 && (
                          <div className="mt-6 max-w-[600px] sm:ml-[54px]">
                            <p className="mb-3 text-[13px] font-semibold text-[#52695F]">
                              답변 출처
                            </p>

                            <div className="space-y-2">
                              {activeSources.map(
                                (
                                  source,
                                  index,
                                ) => (
                                  <SourceCard
                                    key={`${source.citationIndex}-${source.referenceId}-${index}`}
                                    source={
                                      source
                                    }
                                  />
                                ),
                              )}
                            </div>
                          </div>
                        )}

                      <div className="mt-9 flex items-center gap-3">
                        <div className="h-px flex-1 bg-[#DCEDE5]" />

                        <span className="text-[11px] text-[#81968C]">
                          {formatDate(
                            activeQuestion.createdAt,
                          )}
                        </span>

                        <div className="h-px flex-1 bg-[#DCEDE5]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t border-[#DFEEE7] bg-white p-4 sm:px-6">
                  <form
                    onSubmit={
                      handleSubmitQuestion
                    }
                    className="mx-auto flex max-w-[900px] items-end gap-2 rounded-[14px] border border-[#DFECE6] bg-[#F4FAF7] px-4 py-2.5 transition focus-within:border-[#A4EFC8] focus-within:bg-[#EFFFF7]"
                  >
                    <textarea
                      id="qa-question-input"
                      value={
                        questionInput
                      }
                      maxLength={500}
                      disabled={
                        !selectedTeamId ||
                        isCreating
                      }
                      onChange={(event) =>
                        setQuestionInput(
                          event.target.value,
                        )
                      }
                      onKeyDown={
                        handleQuestionKeyDown
                      }
                      rows={1}
                      placeholder={
                        selectedTeam
                          ? `${selectedTeam.name}에 질문을 입력하세요.`
                          : '질문할 팀을 선택해주세요.'
                      }
                      className="max-h-[110px] min-h-[42px] min-w-0 flex-1 resize-none bg-transparent px-1 py-2.5 text-[14px] leading-5 text-[#101211] outline-none placeholder:text-[#82968D] disabled:cursor-not-allowed"
                    />

                    <div className="flex shrink-0 items-center gap-3 pb-0.5">
                      <span className="hidden text-[11px] text-[#768C82] sm:inline">
                        {questionInput.length}/500
                      </span>

                      <button
                        type="submit"
                        disabled={
                          !questionInput.trim() ||
                          !selectedTeamId ||
                          isCreating
                        }
                        className="flex size-10 items-center justify-center rounded-[10px] bg-[#31F5A0] text-[#101211] transition hover:brightness-[0.97] disabled:cursor-not-allowed disabled:bg-[#D6E7DF] disabled:text-[#879B92]"
                        aria-label="질문 전송"
                      >
                        <SendIcon />
                      </button>
                    </div>
                  </form>

                  <p className="mx-auto mt-2 hidden max-w-[900px] px-1 text-[11px] text-[#82968D] sm:block">
                    Enter 전송 · Shift + Enter 줄바꿈
                  </p>
                </div>
              </main>

              {isEditorOpen && (
                <aside className="hidden w-[350px] shrink-0 border-l border-[#DCEDE5] xl:block">
                  <AnswerEditorPanel
                    answerDraft={
                      answerDraft
                    }
                    questionDetail={
                      questionDetail
                    }
                    isRevising={
                      isRevising
                    }
                    onChange={(event) =>
                      setAnswerDraft(
                        event.target.value,
                      )
                    }
                    onSave={
                      handleReviseAnswer
                    }
                    onClose={() =>
                      setIsEditorOpen(
                        false,
                      )
                    }
                  />
                </aside>
              )}
            </>
          )}
        </div>
      </section>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#101211]/30"
            onClick={() =>
              setIsSidebarOpen(
                false,
              )
            }
            aria-label="대화 목록 닫기"
          />

          <aside className="absolute bottom-0 left-0 top-0 w-[min(90vw,330px)] border-r border-[#DCEDE5] bg-white shadow-[12px_0_40px_rgba(16,18,17,0.12)]">
            <div className="flex h-16 items-center justify-between border-b border-[#DFEEE7] px-4">
              <p className="text-[16px] font-semibold text-[#101211]">
                Q&A 목록
              </p>

              <button
                type="button"
                onClick={() =>
                  setIsSidebarOpen(
                    false,
                  )
                }
                className="flex size-9 items-center justify-center rounded-full text-[#587268] hover:bg-[#EFFFF7]"
                aria-label="닫기"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="h-[calc(100%-64px)]">
              <ConversationSidebar
                teams={teams}
                selectedTeamId={
                  selectedTeamId
                }
                myQuestions={
                  projectMyQuestions
                }
                recentQuestions={
                  feedQuestions
                }
                selectedQuestionId={
                  activeQuestionId
                }
                hasNext={
                  feedHasNext
                }
                isLoadingFeed={
                  isLoadingFeed ||
                  isLoadingTeams
                }
                isLoadingMore={
                  isLoadingMoreFeed
                }
                onSelectTeam={
                  handleSelectTeam
                }
                onNewChat={
                  handleNewChat
                }
                onSelectQuestion={
                  handleSelectQuestion
                }
                onRefresh={
                  handleRefresh
                }
                onLoadMore={
                  handleLoadMore
                }
              />
            </div>
          </aside>
        </div>
      )}

      {isEditorOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#101211]/30"
            onClick={() =>
              setIsEditorOpen(
                false,
              )
            }
            aria-label="답변 수정 닫기"
          />

          <aside className="absolute bottom-0 right-0 top-0 w-[min(94vw,400px)] border-l border-[#DCEDE5] bg-white shadow-[-12px_0_40px_rgba(16,18,17,0.12)]">
            <AnswerEditorPanel
              answerDraft={
                answerDraft
              }
              questionDetail={
                questionDetail
              }
              isRevising={
                isRevising
              }
              onChange={(event) =>
                setAnswerDraft(
                  event.target.value,
                )
              }
              onSave={
                handleReviseAnswer
              }
              onClose={() =>
                setIsEditorOpen(
                  false,
                )
              }
            />
          </aside>
        </div>
      )}
    </div>
  );
}

export default QAPage;
