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
  getTeamQuestions,
  reviseAnswer,
} from '../../api/qaApi';

import { getMyProfile } from '../../api/mypageApi';
import { getMemberProjects } from '../../api/projects';
import {
  getMyTeams,
  getProjectTeams,
} from '../../api/teams';

import ProfileAvatar from '../../components/common/ProfileAvatar';

const POLLING_STATUSES = [
  'PENDING',
  'PROCESSING',
  'MANUAL_REQUIRED',
  'TEAM_ANSWER_PENDING',
];

const STATUS_MAP = {
  PENDING: {
    label: '답변 대기 중',
    className: 'text-[#74877D]',
  },
  PROCESSING: {
    label: 'AI가 답변 중...',
    className: 'text-[#16885B]',
  },
  ANSWERED: {
    label: '답변 완료',
    className: 'text-[#16885B]',
  },
  FAILED: {
    label: '답변 실패',
    className: 'text-[#F64E42]',
  },
  MANUAL_REQUIRED: {
    label: '팀 답변 필요',
    className: 'text-[#A96627]',
  },
  TEAM_ANSWER_PENDING: {
    label: '팀 답변 대기',
    className: 'text-[#39738F]',
  },
};

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
      width="17"
      height="17"
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

function LoadingSpinner({
  size = 24,
}) {
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

function getStatus(status) {
  return (
    STATUS_MAP[status] ??
    STATUS_MAP.PENDING
  );
}

function getPageContent(
  response,
) {
  const result =
    response?.result;

  if (
    Array.isArray(
      result?.content,
    )
  ) {
    return result.content;
  }

  return [];
}

function formatTime(value) {
  if (!value) {
    return '';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  return date.toLocaleTimeString(
    'ko-KR',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
  );
}

function getDateKey(value) {
  if (!value) {
    return '';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  ].join('-');
}

function formatChatDate(
  value,
) {
  if (!value) {
    return '';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return '';
  }

  const today =
    new Date();

  if (
    getDateKey(date) ===
    getDateKey(today)
  ) {
    return '오늘';
  }

  const yesterday =
    new Date();

  yesterday.setDate(
    yesterday.getDate() - 1,
  );

  if (
    getDateKey(date) ===
    getDateKey(yesterday)
  ) {
    return '어제';
  }

  return date.toLocaleDateString(
    'ko-KR',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    },
  );
}

function getAnswerLabel(
  answerType,
) {
  if (
    answerType === 'TEAM'
  ) {
    return '팀 답변';
  }

  if (
    answerType === 'SYSTEM'
  ) {
    return 'Noddi';
  }

  return 'Noddi AI';
}

function normalizeFeedItem(
  item,
  feed,
) {
  const question =
    item?.question ?? {};

  const answer =
    item?.answer ?? null;

  return {
    questionId:
      question.questionId,

    targetTeamId:
      feed?.teamId,

    targetTeamName:
      feed?.teamName,

    questionerId:
      question.questionerId,

    questionerName:
      question.questionerName,

    questionerDepartment:
      question.questionerDepartment,

    questionerPosition:
      question.questionerPosition,

    questionerProfileImageUrl:
      question.questionerProfileImageUrl,

    content:
      question.content,

    createdAt:
      question.createdAt,

    status:
      item?.status ??
      'PENDING',

    answer,

    canAnswer:
      Boolean(
        item?.canAnswer,
      ),

    sources:
      Array.isArray(
        answer?.sources,
      )
        ? answer.sources
        : [],
  };
}

function getQuestionTime(
  question,
) {
  const time =
    new Date(
      question?.createdAt,
    ).getTime();

  return Number.isNaN(time)
    ? 0
    : time;
}

function sortQuestions(
  questions,
) {
  return [...questions].sort(
    (first, second) => {
      const difference =
        getQuestionTime(first) -
        getQuestionTime(second);

      if (difference !== 0) {
        return difference;
      }

      return (
        Number(
          first.questionId,
        ) -
        Number(
          second.questionId,
        )
      );
    },
  );
}

function mergeQuestions(
  previous,
  incoming,
) {
  const questionMap =
    new Map();

  previous.forEach(
    (question) => {
      questionMap.set(
        Number(
          question.questionId,
        ),
        question,
      );
    },
  );

  incoming.forEach(
    (question) => {
      const questionId =
        Number(
          question.questionId,
        );

      const current =
        questionMap.get(
          questionId,
        );

      questionMap.set(
        questionId,
        {
          ...current,
          ...question,

          answer:
            question.answer ??
            current?.answer ??
            null,

          sources:
            question.sources
              ?.length
              ? question.sources
              : current?.sources ??
              [],
        },
      );
    },
  );

  return sortQuestions(
    Array.from(
      questionMap.values(),
    ),
  );
}

function SourceCard({
  source,
}) {
  return (
    <div className="rounded-[11px] border border-[#D8E8E0] bg-white px-3.5 py-3">
      <div className="flex items-center gap-2.5">
        <span className="shrink-0 text-[#527064]">
          <SourceIcon />
        </span>

        <p className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#29483B]">
          {source.sourceTitle ??
            '참고 자료'}
        </p>

        <span className="shrink-0 rounded-full bg-[#EFFFF7] px-2.5 py-1 text-[10px] font-medium text-[#39735A]">
          {source.sourceType ===
            'TRANSCRIPT'
            ? '회의 기록'
            : '팀 페이지'}
        </span>
      </div>

      {source.excerpt && (
        <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-[12px] leading-5 text-[#687F75]">
          {source.excerpt}
        </p>
      )}
    </div>
  );
}

function RoomItem({
  team,
  selected,
  latestQuestion,
  onClick,
}) {
  const status =
    latestQuestion
      ? getStatus(
        latestQuestion.status,
      )
      : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[11px] px-3 py-3 text-left transition ${selected
          ? 'bg-[#E8FFF3]'
          : 'hover:bg-[#F5FAF7]'
        }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${selected
              ? 'bg-[#31F5A0] text-[#101211]'
              : 'bg-[#EFFFF7] text-[#177551]'
            }`}
        >
          Q&A
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-[#101211]">
            {team.name} Q&A
          </p>

          <p
            className={`mt-1 truncate text-[12px] ${status?.className ??
              'text-[#83938B]'
              }`}
          >
            {status?.label ??
              '팀 Q&A 채팅방'}
          </p>
        </div>

        {latestQuestion && (
          <span className="shrink-0 pt-0.5 text-[10px] text-[#9BA9A2]">
            {formatTime(
              latestQuestion.createdAt,
            )}
          </span>
        )}
      </div>
    </button>
  );
}

function RecentQuestionItem({
  question,
  selected,
  onClick,
}) {
  const status =
    question?.answer?.revised
      ? {
        label:
          'AI 답변이 수정됐어요',
        className:
          'text-[#F06459]',
      }
      : getStatus(
        question.status,
      );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[11px] px-3 py-3 text-left transition ${selected
          ? 'bg-[#F0FFF7]'
          : 'hover:bg-[#F7FBF9]'
        }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EFFFF7] text-[11px] font-semibold text-[#177551]">
          Q&A
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#101211]">
              {question.targetTeamName ??
                '팀'}{' '}
              Q&A
            </p>

            <span className="shrink-0 pt-0.5 text-[10px] text-[#9BA9A2]">
              {formatTime(
                question.createdAt,
              )}
            </span>
          </div>

          <p className="mt-1 line-clamp-1 text-[12px] text-[#65796F]">
            {question.content}
          </p>

          <p
            className={`mt-1 text-[11px] font-medium ${status.className}`}
          >
            {status.label}
          </p>
        </div>
      </div>
    </button>
  );
}

function ConversationSidebar({
  teams,
  myTeamIds,
  myQuestions,
  recentQuestions,
  selectedTeamId,
  focusedQuestionId,
  isLoadingTeams,
  isLoadingRecent,
  onSelectTeam,
  onNewChat,
  onFocusQuestion,
  onRefresh,
}) {
  const myProjectTeams =
    useMemo(() => {
      return teams.filter(
        (team) =>
          myTeamIds.has(
            Number(team.id),
          ),
      );
    }, [
      teams,
      myTeamIds,
    ]);

  const getLatestMyQuestion =
    (teamId) => {
      return (
        myQuestions.find(
          (question) =>
            Number(
              question.targetTeamId,
            ) ===
            Number(teamId),
        ) ?? null
      );
    };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="shrink-0 bg-[#31F5A0] px-4 pb-5 pt-4">
        <p className="text-[14px] font-semibold text-[#101211]">
          팀 선택
        </p>

        <div className="mt-3 space-y-2">
          {isLoadingTeams ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner
                size={20}
              />
            </div>
          ) : teams.length === 0 ? (
            <p className="rounded-[10px] bg-white/45 px-3 py-3 text-[12px] text-[#355447]">
              프로젝트에 팀이 없습니다.
            </p>
          ) : (
            teams.map(
              (team) => {
                const selected =
                  Number(
                    selectedTeamId,
                  ) ===
                  Number(team.id);

                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() =>
                      onSelectTeam(
                        team.id,
                      )
                    }
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
              },
            )
          )}
        </div>
      </div>

      <div className="shrink-0 border-b border-[#E3ECE7] p-3.5">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={
              !selectedTeamId
            }
            onClick={onNewChat}
            className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-[11px] bg-[#31F5A0] text-[13px] font-semibold text-[#101211] transition hover:brightness-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PlusIcon />
            새 채팅
          </button>

          <button
            type="button"
            disabled={
              !selectedTeamId
            }
            onClick={onRefresh}
            className="flex size-11 shrink-0 items-center justify-center rounded-[11px] border border-[#D8E7DF] bg-white text-[#506C5F] transition hover:bg-[#F3FAF6] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="새로고침"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-4">
        <div className="px-2.5 pb-2">
          <p className="text-[13px] font-medium text-[#84938B]">
            내 팀 채팅
          </p>
        </div>

        {myProjectTeams.length ===
          0 ? (
          <p className="px-3 py-4 text-[12px] leading-5 text-[#9AA8A1]">
            이 프로젝트에 소속된 내 팀이 없습니다.
          </p>
        ) : (
          <div className="space-y-1">
            {myProjectTeams.map(
              (team) => (
                <RoomItem
                  key={team.id}
                  team={team}
                  selected={
                    Number(
                      selectedTeamId,
                    ) ===
                    Number(
                      team.id,
                    )
                  }
                  latestQuestion={
                    getLatestMyQuestion(
                      team.id,
                    )
                  }
                  onClick={() =>
                    onSelectTeam(
                      team.id,
                    )
                  }
                />
              ),
            )}
          </div>
        )}

        <div className="px-2.5 pb-2 pt-6">
          <p className="text-[13px] font-medium text-[#84938B]">
            최근
          </p>
        </div>

        {isLoadingRecent ? (
          <div className="flex justify-center py-7">
            <LoadingSpinner
              size={20}
            />
          </div>
        ) : recentQuestions.length ===
          0 ? (
          <p className="px-3 py-4 text-[12px] text-[#9AA8A1]">
            최근 질문이 없습니다.
          </p>
        ) : (
          <div className="space-y-0.5">
            {recentQuestions.map(
              (question) => (
                <RecentQuestionItem
                  key={
                    question.questionId
                  }
                  question={
                    question
                  }
                  selected={
                    String(
                      focusedQuestionId ??
                      '',
                    ) ===
                    String(
                      question.questionId,
                    )
                  }
                  onClick={() =>
                    onFocusQuestion(
                      question,
                    )
                  }
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DateDivider({
  value,
}) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="h-px flex-1 bg-[#E5EEE9]" />

      <span className="shrink-0 rounded-full bg-[#F3F8F5] px-3 py-1.5 text-[11px] font-medium text-[#7D8F86]">
        {formatChatDate(
          value,
        )}
      </span>

      <div className="h-px flex-1 bg-[#E5EEE9]" />
    </div>
  );
}

function QuestionMessage({
  question,
  profile,
}) {
  const isMine =
    Boolean(
      profile?.userId &&
      question?.questionerId &&
      Number(
        profile.userId,
      ) ===
      Number(
        question.questionerId,
      ),
    );

  const name =
    question.questionerName ??
    (isMine
      ? profile?.name
      : null) ??
    '질문자';

  const imageUrl =
    question.questionerProfileImageUrl ??
    (isMine
      ? profile?.profileImageUrl
      : null);

  const department =
    question.questionerDepartment ??
    (isMine
      ? profile?.department
      : null);

  const position =
    question.questionerPosition ??
    (isMine
      ? profile?.position
      : null);

  const meta = [
    department,
    position,
  ]
    .filter(Boolean)
    .join(' · ');

  if (isMine) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[86%] sm:max-w-[72%]">
          <div className="rounded-[17px_17px_5px_17px] border border-[#9FEBC4] bg-[#CFFFF0] px-4 py-3">
            <p className="whitespace-pre-wrap break-words text-[14px] leading-6 text-[#173329]">
              {question.content}
            </p>
          </div>

          <p className="mt-1 text-right text-[11px] text-[#899890]">
            {formatTime(
              question.createdAt,
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <ProfileAvatar
        userId={
          question.questionerId
        }
        profileImageUrl={
          imageUrl
        }
        name={name}
        className="size-9 shrink-0 text-[12px]"
      />

      <div className="max-w-[86%] sm:max-w-[72%]">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-[13px] font-semibold text-[#101211]">
            {name}
          </p>

          {meta && (
            <span className="text-[11px] text-[#889890]">
              {meta}
            </span>
          )}
        </div>

        <div className="mt-2 rounded-[5px_17px_17px_17px] bg-[#EEF2F0] px-4 py-3">
          <p className="whitespace-pre-wrap break-words text-[14px] leading-6 text-[#263A31]">
            {question.content}
          </p>
        </div>

        <p className="mt-1 text-[11px] text-[#899890]">
          {formatTime(
            question.createdAt,
          )}
        </p>
      </div>
    </div>
  );
}

function AnswerMessage({
  question,
  teamName,
  onEdit,
}) {
  const answer =
    question.answer;

  const canEdit =
    Boolean(
      question.canAnswer &&
      answer?.answerId,
    );

  if (!answer?.content) {
    const isManual =
      question.status ===
      'MANUAL_REQUIRED';

    const isFailed =
      question.status ===
      'FAILED';

    return (
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#31F5A0] text-[#101211]">
          <SparkleIcon />
        </div>

        <div className="max-w-[88%] sm:max-w-[76%]">
          <p className="text-[13px] font-semibold text-[#101211]">
            Noddi AI
          </p>

          {isFailed ? (
            <div className="mt-2 rounded-[5px_17px_17px_17px] border border-[#FFD6D1] bg-[#FFF6F5] px-4 py-3">
              <p className="text-[13px] font-medium text-[#D84A40]">
                답변을 생성하지 못했습니다.
              </p>

              {canEdit && (
                <button
                  type="button"
                  onClick={() =>
                    onEdit(
                      question,
                    )
                  }
                  className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-[#9B514B]"
                >
                  <EditIcon />
                  직접 답변하기
                </button>
              )}
            </div>
          ) : isManual ? (
            <div className="mt-2 rounded-[5px_17px_17px_17px] border border-[#FFE0C3] bg-[#FFF8F0] px-4 py-3">
              <p className="text-[13px] font-medium text-[#9B5C24]">
                팀원의 확인이 필요한 질문입니다.
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#9B7756]">
                대상 팀원이 답변하면 현재 대화에 이어서 표시됩니다.
              </p>

              {canEdit && (
                <button
                  type="button"
                  onClick={() =>
                    onEdit(
                      question,
                    )
                  }
                  className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-[#8F5727]"
                >
                  <EditIcon />
                  직접 답변하기
                </button>
              )}
            </div>
          ) : (
            <div className="mt-2 rounded-[5px_17px_17px_17px] bg-[#EEF2F0] px-4 py-3">
              <div className="flex items-center gap-3">
                <LoadingSpinner
                  size={16}
                />

                <div>
                  <p className="text-[13px] font-medium text-[#334C40]">
                    {question.status ===
                      'TEAM_ANSWER_PENDING'
                      ? '팀원의 답변을 기다리고 있습니다.'
                      : 'AI가 답변을 생성하고 있습니다.'}
                  </p>

                  <p className="mt-1 text-[11px] text-[#7E9188]">
                    완료되면 이 대화에 바로 표시됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isTeamAnswer =
    answer.answerType ===
    'TEAM';

  const sources =
    Array.isArray(
      question.sources,
    )
      ? question.sources
      : [];

  const answerName =
    isTeamAnswer
      ? answer.lastRevisedByName
        ? `${answer.lastRevisedByName} · ${teamName ?? '팀'}`
        : `${teamName ?? '팀'} 답변`
      : getAnswerLabel(
        answer.answerType,
      );

  return (
    <div className="flex items-start gap-3">
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${isTeamAnswer
            ? 'bg-[#E4EBE7] text-[#476057]'
            : 'bg-[#31F5A0] text-[#101211]'
          }`}
      >
        {isTeamAnswer ? (
          <span className="text-[12px] font-semibold">
            T
          </span>
        ) : (
          <SparkleIcon />
        )}
      </div>

      <div className="min-w-0 max-w-[88%] sm:max-w-[77%]">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[13px] font-semibold text-[#101211]">
            {answerName}
          </p>

          {answer.revised && (
            <span className="text-[11px] font-medium text-[#F06459]">
              수정됨
            </span>
          )}
        </div>

        <div
          className={`mt-2 rounded-[5px_17px_17px_17px] px-4 py-3.5 ${isTeamAnswer
              ? 'border border-[#DCE6E1] bg-white'
              : 'bg-[#EEF2F0]'
            }`}
        >
          <p className="whitespace-pre-wrap break-words text-[14px] leading-6 text-[#263A31]">
            {answer.content}
          </p>

          {answer.revised &&
            answer.lastRevisedByName && (
              <div className="mt-3 border-t border-[#D8E2DD] pt-2.5">
                <span className="text-[11px] text-[#74877D]">
                  {
                    answer.lastRevisedByName
                  }
                  님이 답변을 수정했습니다.
                </span>
              </div>
            )}
        </div>

        <div className="mt-1 flex items-center gap-3">
          <span className="text-[11px] text-[#899890]">
            {formatTime(
              answer.updatedAt ??
              answer.createdAt,
            )}
          </span>

          {canEdit && (
            <button
              type="button"
              onClick={() =>
                onEdit(
                  question,
                )
              }
              className="flex items-center gap-1 text-[11px] font-semibold text-[#4B7361] transition hover:text-[#101211]"
            >
              <EditIcon />
              답변 수정
            </button>
          )}
        </div>

        {sources.length >
          0 && (
            <div className="mt-3 space-y-2">
              {sources.map(
                (
                  source,
                  index,
                ) => (
                  <SourceCard
                    key={`${question.questionId}-${source.citationIndex}-${source.referenceId}-${index}`}
                    source={
                      source
                    }
                  />
                ),
              )}
            </div>
          )}
      </div>
    </div>
  );
}

function ConversationItem({
  question,
  profile,
  teamName,
  focused,
  onEdit,
}) {
  return (
    <div
      id={`qa-question-${question.questionId}`}
      className={`scroll-mt-24 rounded-[15px] px-2 py-3 transition-all duration-500 ${focused
          ? 'bg-[#F0FFF7] shadow-[0_0_0_1px_rgba(49,245,160,0.55)]'
          : 'bg-transparent'
        }`}
    >
      <div className="space-y-3">
        <QuestionMessage
          question={question}
          profile={profile}
        />

        <AnswerMessage
          question={question}
          teamName={teamName}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
}

function AnswerEditorPanel({
  answerDraft,
  questionDetail,
  isLoading,
  isRevising,
  onChange,
  onSave,
  onClose,
}) {
  const answer =
    questionDetail?.answer;

  const originalContent =
    answer?.content ?? '';

  const isNewAnswer =
    !originalContent.trim();

  const hasChanged =
    answerDraft.trim() !==
    originalContent.trim();

  const sources =
    Array.isArray(
      questionDetail?.sources,
    )
      ? questionDetail.sources
      : Array.isArray(
        answer?.sources,
      )
        ? answer.sources
        : [];

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#FAFFFC]">
      <div className="flex shrink-0 items-start justify-between border-b border-[#DCEDE5] px-5 py-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[#147950]">
              <EditIcon />
            </span>

            <h2 className="text-[17px] font-semibold text-[#101211]">
              {isNewAnswer
                ? '답변 작성'
                : '답변 수정'}
            </h2>
          </div>

          <p className="mt-2 text-[13px] leading-5 text-[#687F75]">
            {isNewAnswer
              ? '팀을 대신해 직접 답변을 작성할 수 있습니다.'
              : '팀 상황에 맞게 답변을 보완할 수 있습니다.'}
          </p>
        </div>

        <button
          type="button"
          disabled={
            isRevising
          }
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full text-[#587268] transition hover:bg-[#EFFFF7] hover:text-[#101211]"
          aria-label="답변 작성 닫기"
        >
          <CloseIcon />
        </button>
      </div>

      {isLoading ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="qa-answer-editor"
                className="text-[14px] font-semibold text-[#29483B]"
              >
                답변 내용
              </label>

              <span className="text-[12px] text-[#71877D]">
                {answerDraft.length}
                /1000
              </span>
            </div>

            <textarea
              id="qa-answer-editor"
              value={
                answerDraft
              }
              maxLength={1000}
              disabled={
                isRevising
              }
              onChange={
                onChange
              }
              placeholder="답변을 입력해주세요."
              className="mt-3 h-[320px] w-full resize-none rounded-[13px] border border-[#CCE7D9] bg-white p-4 text-[14px] leading-6 text-[#20342C] outline-none transition placeholder:text-[#9AA9A2] focus:border-[#31F5A0]"
            />

            {sources.length >
              0 && (
                <div className="mt-6">
                  <p className="text-[14px] font-semibold text-[#29483B]">
                    답변에 참고한 정보
                  </p>

                  <div className="mt-3 space-y-2">
                    {sources.map(
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
                ? isNewAnswer
                  ? '등록 중...'
                  : '수정 중...'
                : isNewAnswer
                  ? '답변 등록하기'
                  : '답변 수정하기'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function QAPage() {
  const location =
    useLocation();

  const targetQuestionId =
    location.state
      ?.questionId ?? null;

  const targetTeamId =
    location.state
      ?.teamId ?? null;

  const conversationRef =
    useRef(null);

  const preferredTeamRef =
    useRef(targetTeamId);

  const pendingFocusRef =
    useRef(targetQuestionId);

  const focusSearchCountRef =
    useRef(0);

  const loadingMoreRef =
    useRef(false);

  const restoreScrollRef =
    useRef(null);

  const shouldScrollBottomRef =
    useRef(false);

  const isNearBottomRef =
    useRef(true);

  const flashTimeoutRef =
    useRef(null);

  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    projects,
    setProjects,
  ] = useState([]);

  const [
    myTeams,
    setMyTeams,
  ] = useState([]);

  const [
    teams,
    setTeams,
  ] = useState([]);

  const [
    selectedProjectId,
    setSelectedProjectId,
  ] = useState(null);

  const [
    selectedTeamId,
    setSelectedTeamId,
  ] = useState(null);

  const [
    myQuestions,
    setMyQuestions,
  ] = useState([]);

  const [
    teamQuestions,
    setTeamQuestions,
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
    focusedQuestionId,
    setFocusedQuestionId,
  ] = useState(null);

  const [
    flashQuestionId,
    setFlashQuestionId,
  ] = useState(null);

  const [
    questionInput,
    setQuestionInput,
  ] = useState('');

  const [
    questionDetail,
    setQuestionDetail,
  ] = useState(null);

  const [
    answerDraft,
    setAnswerDraft,
  ] = useState('');

  const [
    editingQuestionId,
    setEditingQuestionId,
  ] = useState(null);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isLoadingTeams,
    setIsLoadingTeams,
  ] = useState(false);

  const [
    isLoadingRecent,
    setIsLoadingRecent,
  ] = useState(false);

  const [
    isLoadingFeed,
    setIsLoadingFeed,
  ] = useState(false);

  const [
    isLoadingMore,
    setIsLoadingMore,
  ] = useState(false);

  const [
    isCreating,
    setIsCreating,
  ] = useState(false);

  const [
    isEditorLoading,
    setIsEditorLoading,
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

  const [
    error,
    setError,
  ] = useState('');

  const selectedProject =
    useMemo(() => {
      return (
        projects.find(
          (project) =>
            Number(
              project.projectId,
            ) ===
            Number(
              selectedProjectId,
            ),
        ) ?? null
      );
    }, [
      projects,
      selectedProjectId,
    ]);

  const selectedTeam =
    useMemo(() => {
      return (
        teams.find(
          (team) =>
            Number(
              team.id,
            ) ===
            Number(
              selectedTeamId,
            ),
        ) ?? null
      );
    }, [
      teams,
      selectedTeamId,
    ]);

  const myTeamIds =
    useMemo(() => {
      return new Set(
        myTeams.map(
          (team) =>
            Number(
              team.teamId ??
              team.id,
            ),
        ),
      );
    }, [myTeams]);

  const recentQuestions =
    useMemo(() => {
      return teamQuestions.map(
        (question) => {
          const feedQuestion =
            feedQuestions.find(
              (feedItem) =>
                Number(
                  feedItem.questionId,
                ) ===
                Number(
                  question.questionId,
                ),
            );

          return {
            ...question,
            answer:
              feedQuestion?.answer ??
              null,
          };
        },
      );
    }, [
      teamQuestions,
      feedQuestions,
    ]);

  const hasPollingQuestion =
    useMemo(() => {
      return feedQuestions.some(
        (question) =>
          POLLING_STATUSES.includes(
            question.status,
          ),
      );
    }, [feedQuestions]);

  const scrollToBottom =
    useCallback(
      (
        behavior = 'auto',
      ) => {
        const container =
          conversationRef.current;

        if (!container) {
          return;
        }

        container.scrollTo({
          top:
            container.scrollHeight,
          behavior,
        });

        isNearBottomRef.current =
          true;
      },
      [],
    );

  const highlightQuestion =
    useCallback(
      (
        questionId,
        behavior = 'smooth',
      ) => {
        const element =
          document.getElementById(
            `qa-question-${questionId}`,
          );

        if (!element) {
          return false;
        }

        setFocusedQuestionId(
          questionId,
        );

        setFlashQuestionId(
          questionId,
        );

        element.scrollIntoView({
          behavior,
          block: 'center',
        });

        if (
          flashTimeoutRef.current
        ) {
          window.clearTimeout(
            flashTimeoutRef.current,
          );
        }

        flashTimeoutRef.current =
          window.setTimeout(
            () => {
              setFlashQuestionId(
                null,
              );
            },
            1800,
          );

        return true;
      },
      [],
    );

  useEffect(() => {
    return () => {
      if (
        flashTimeoutRef.current
      ) {
        window.clearTimeout(
          flashTimeoutRef.current,
        );
      }
    };
  }, []);

  useEffect(() => {
    const container =
      conversationRef.current;

    if (!container) {
      return;
    }

    if (
      restoreScrollRef.current
    ) {
      const {
        previousHeight,
        previousTop,
      } =
        restoreScrollRef.current;

      const nextHeight =
        container.scrollHeight;

      container.scrollTop =
        previousTop +
        (nextHeight -
          previousHeight);

      restoreScrollRef.current =
        null;

      return;
    }

    if (
      !shouldScrollBottomRef.current
    ) {
      return;
    }

    const frame =
      requestAnimationFrame(
        () => {
          scrollToBottom();

          shouldScrollBottomRef.current =
            false;
        },
      );

    return () => {
      cancelAnimationFrame(
        frame,
      );
    };
  }, [
    feedQuestions,
    scrollToBottom,
  ]);

  const loadMyQuestionList =
    useCallback(async () => {
      const response =
        await getMyQuestions({
          page: 0,
          size: 30,
        });

      const questions =
        getPageContent(
          response,
        );

      setMyQuestions(
        questions,
      );

      return questions;
    }, []);

  const loadTeamQuestionList =
    useCallback(
      async (teamId) => {
        if (!teamId) {
          setTeamQuestions(
            [],
          );

          return [];
        }

        try {
          setIsLoadingRecent(
            true,
          );

          const response =
            await getTeamQuestions(
              teamId,
              {
                page: 0,
                size: 30,
              },
            );

          const questions =
            getPageContent(
              response,
            );

          setTeamQuestions(
            questions,
          );

          return questions;
        } catch (
        requestError
        ) {
          console.error(
            'Failed to load team question list:',
            requestError,
          );

          setTeamQuestions(
            [],
          );

          return [];
        } finally {
          setIsLoadingRecent(
            false,
          );
        }
      },
      [],
    );

  const loadInitialData =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setError('');

        const [
          profileResponse,
          myTeamResponse,
          myQuestionResponse,
        ] =
          await Promise.all([
            getMyProfile(),
            getMyTeams(),
            getMyQuestions({
              page: 0,
              size: 30,
            }),
          ]);

        const profileData =
          profileResponse
            ?.result ?? null;

        const nextMyTeams =
          Array.isArray(
            myTeamResponse,
          )
            ? myTeamResponse
            : [];

        setProfile(
          profileData,
        );

        setMyTeams(
          nextMyTeams,
        );

        setMyQuestions(
          getPageContent(
            myQuestionResponse,
          ),
        );

        let memberProjects =
          [];

        if (
          profileData?.userId
        ) {
          try {
            const response =
              await getMemberProjects(
                profileData.userId,
              );

            memberProjects =
              Array.isArray(
                response,
              )
                ? response
                : [];
          } catch (
          projectError
          ) {
            console.error(
              'Failed to load member projects:',
              projectError,
            );
          }
        }

        if (
          memberProjects.length ===
          0
        ) {
          const projectMap =
            new Map();

          nextMyTeams.forEach(
            (team) => {
              if (
                !team.projectId
              ) {
                return;
              }

              const projectId =
                Number(
                  team.projectId,
                );

              if (
                projectMap.has(
                  projectId,
                )
              ) {
                return;
              }

              projectMap.set(
                projectId,
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

        setProjects(
          memberProjects,
        );

        const targetMyTeam =
          nextMyTeams.find(
            (team) =>
              Number(
                team.teamId ??
                team.id,
              ) ===
              Number(
                targetTeamId,
              ),
          );

        const preferredProjectId =
          targetMyTeam
            ?.projectId &&
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
      } catch (
      requestError
      ) {
        console.error(
          'Failed to load Q&A:',
          requestError,
        );

        setError(
          requestError
            ?.response?.data
            ?.message ??
          'Q&A 정보를 불러오지 못했습니다.',
        );
      } finally {
        setIsLoading(false);
      }
    }, [targetTeamId]);

  const loadProjectTeamList =
    useCallback(
      async (
        projectId,
      ) => {
        if (!projectId) {
          setTeams([]);
          setSelectedTeamId(
            null,
          );

          return;
        }

        try {
          setIsLoadingTeams(
            true,
          );

          const response =
            await getProjectTeams(
              projectId,
            );

          const nextTeams =
            Array.isArray(
              response,
            )
              ? response
              : [];

          setTeams(
            nextTeams,
          );

          const preferredTeamId =
            preferredTeamRef.current;

          const nextTeamId =
            preferredTeamId &&
              nextTeams.some(
                (team) =>
                  Number(
                    team.id,
                  ) ===
                  Number(
                    preferredTeamId,
                  ),
              )
              ? preferredTeamId
              : nextTeams[0]
                ?.id ??
              null;

          preferredTeamRef.current =
            null;

          setSelectedTeamId(
            nextTeamId,
          );
        } catch (
        requestError
        ) {
          console.error(
            'Failed to load project teams:',
            requestError,
          );

          setTeams([]);
          setSelectedTeamId(
            null,
          );

          setError(
            requestError
              ?.response?.data
              ?.message ??
            '프로젝트 팀을 불러오지 못했습니다.',
          );
        } finally {
          setIsLoadingTeams(
            false,
          );
        }
      },
      [],
    );

  const loadInitialFeed =
    useCallback(
      async (teamId) => {
        if (!teamId) {
          setFeedQuestions(
            [],
          );

          setFeedCursor(
            null,
          );

          setFeedHasNext(
            false,
          );

          return;
        }

        try {
          setIsLoadingFeed(
            true,
          );

          setError('');

          const feed =
            await getTeamQaFeed(
              teamId,
              {
                size: 20,
              },
            );

          const questions =
            Array.isArray(
              feed?.items,
            )
              ? feed.items.map(
                (item) =>
                  normalizeFeedItem(
                    item,
                    feed,
                  ),
              )
              : [];

          setFeedQuestions(
            sortQuestions(
              questions,
            ),
          );

          setFeedCursor(
            feed?.nextCursor ??
            null,
          );

          setFeedHasNext(
            Boolean(
              feed?.hasNext,
            ),
          );

          focusSearchCountRef.current =
            0;

          if (
            !pendingFocusRef.current
          ) {
            shouldScrollBottomRef.current =
              true;
          }
        } catch (
        requestError
        ) {
          console.error(
            'Failed to load Q&A feed:',
            requestError,
          );

          setFeedQuestions(
            [],
          );

          setFeedCursor(
            null,
          );

          setFeedHasNext(
            false,
          );

          setError(
            requestError
              ?.response?.data
              ?.message ??
            '팀 Q&A를 불러오지 못했습니다.',
          );
        } finally {
          setIsLoadingFeed(
            false,
          );
        }
      },
      [],
    );

  const refreshLatestFeed =
    useCallback(
      async (
        teamId,
        {
          showError = false,
        } = {},
      ) => {
        if (!teamId) {
          return;
        }

        try {
          const feed =
            await getTeamQaFeed(
              teamId,
              {
                size: 20,
              },
            );

          const questions =
            Array.isArray(
              feed?.items,
            )
              ? feed.items.map(
                (item) =>
                  normalizeFeedItem(
                    item,
                    feed,
                  ),
              )
              : [];

          if (
            isNearBottomRef.current
          ) {
            shouldScrollBottomRef.current =
              true;
          }

          setFeedQuestions(
            (previous) =>
              mergeQuestions(
                previous,
                questions,
              ),
          );
        } catch (
        requestError
        ) {
          console.error(
            'Failed to refresh Q&A:',
            requestError,
          );

          if (showError) {
            setError(
              requestError
                ?.response?.data
                ?.message ??
              'Q&A를 새로고침하지 못했습니다.',
            );
          }
        }
      },
      [],
    );

  const loadOlderMessages =
    useCallback(async () => {
      if (
        !selectedTeamId ||
        !feedCursor ||
        !feedHasNext ||
        loadingMoreRef.current
      ) {
        return;
      }

      const container =
        conversationRef.current;

      loadingMoreRef.current =
        true;

      setIsLoadingMore(
        true,
      );

      if (container) {
        restoreScrollRef.current =
        {
          previousHeight:
            container.scrollHeight,

          previousTop:
            container.scrollTop,
        };
      }

      try {
        const feed =
          await getTeamQaFeed(
            selectedTeamId,
            {
              cursor:
                feedCursor,
              size: 20,
            },
          );

        const questions =
          Array.isArray(
            feed?.items,
          )
            ? feed.items.map(
              (item) =>
                normalizeFeedItem(
                  item,
                  feed,
                ),
            )
            : [];

        setFeedQuestions(
          (previous) =>
            mergeQuestions(
              questions,
              previous,
            ),
        );

        setFeedCursor(
          feed?.nextCursor ??
          null,
        );

        setFeedHasNext(
          Boolean(
            feed?.hasNext,
          ),
        );
      } catch (
      requestError
      ) {
        restoreScrollRef.current =
          null;

        console.error(
          'Failed to load older Q&A:',
          requestError,
        );

        setError(
          requestError
            ?.response?.data
            ?.message ??
          '이전 대화를 불러오지 못했습니다.',
        );
      } finally {
        loadingMoreRef.current =
          false;

        setIsLoadingMore(
          false,
        );
      }
    }, [
      selectedTeamId,
      feedCursor,
      feedHasNext,
    ]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (
      !selectedProjectId
    ) {
      return;
    }

    loadProjectTeamList(
      selectedProjectId,
    );
  }, [
    selectedProjectId,
    loadProjectTeamList,
  ]);

  useEffect(() => {
    if (!selectedTeamId) {
      setFeedQuestions(
        [],
      );

      setTeamQuestions(
        [],
      );

      return;
    }

    setQuestionInput('');
    setFocusedQuestionId(
      null,
    );

    setIsEditorOpen(
      false,
    );

    setQuestionDetail(
      null,
    );

    setEditingQuestionId(
      null,
    );

    setAnswerDraft('');

    Promise.all([
      loadInitialFeed(
        selectedTeamId,
      ),

      loadTeamQuestionList(
        selectedTeamId,
      ),
    ]);
  }, [
    selectedTeamId,
    loadInitialFeed,
    loadTeamQuestionList,
  ]);

  useEffect(() => {
    if (
      !selectedTeamId ||
      !hasPollingQuestion
    ) {
      return undefined;
    }

    const intervalId =
      window.setInterval(
        () => {
          refreshLatestFeed(
            selectedTeamId,
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
    selectedTeamId,
    hasPollingQuestion,
    refreshLatestFeed,
  ]);

  useEffect(() => {
    const questionId =
      pendingFocusRef.current;

    if (
      !questionId ||
      !selectedTeamId ||
      isLoadingFeed
    ) {
      return;
    }

    const found =
      highlightQuestion(
        questionId,
      );

    if (found) {
      pendingFocusRef.current =
        null;

      focusSearchCountRef.current =
        0;

      return;
    }

    if (
      feedHasNext &&
      !isLoadingMore &&
      focusSearchCountRef.current <
      20
    ) {
      focusSearchCountRef.current +=
        1;

      loadOlderMessages();

      return;
    }

    if (!feedHasNext) {
      pendingFocusRef.current =
        null;

      focusSearchCountRef.current =
        0;
    }
  }, [
    selectedTeamId,
    feedQuestions,
    feedHasNext,
    isLoadingFeed,
    isLoadingMore,
    highlightQuestion,
    loadOlderMessages,
  ]);

  const handleConversationScroll =
    (event) => {
      const container =
        event.currentTarget;

      const distanceFromBottom =
        container.scrollHeight -
        container.scrollTop -
        container.clientHeight;

      isNearBottomRef.current =
        distanceFromBottom <=
        160;

      if (
        container.scrollTop <=
        90 &&
        feedHasNext &&
        !loadingMoreRef.current
      ) {
        loadOlderMessages();
      }
    };

  const handleSelectProject =
    (projectId) => {
      if (
        Number(projectId) ===
        Number(
          selectedProjectId,
        )
      ) {
        return;
      }

      preferredTeamRef.current =
        null;

      pendingFocusRef.current =
        null;

      setFocusedQuestionId(
        null,
      );

      setSelectedProjectId(
        projectId,
      );

      setSelectedTeamId(
        null,
      );

      setTeams([]);

      setFeedQuestions(
        [],
      );

      setTeamQuestions(
        [],
      );

      setFeedCursor(
        null,
      );

      setFeedHasNext(
        false,
      );

      setIsEditorOpen(
        false,
      );

      setError('');
    };

  const handleSelectTeam =
    (teamId) => {
      pendingFocusRef.current =
        null;

      setFocusedQuestionId(
        null,
      );

      if (
        Number(teamId) ===
        Number(
          selectedTeamId,
        )
      ) {
        setIsSidebarOpen(
          false,
        );

        scrollToBottom(
          'smooth',
        );

        return;
      }

      setSelectedTeamId(
        teamId,
      );

      setIsSidebarOpen(
        false,
      );

      setError('');
    };

  const handleNewChat = () => {
    pendingFocusRef.current =
      null;

    setFocusedQuestionId(
      null,
    );

    setIsSidebarOpen(
      false,
    );

    scrollToBottom(
      'smooth',
    );

    window.setTimeout(
      () => {
        document
          .getElementById(
            'qa-question-input',
          )
          ?.focus();
      },
      250,
    );
  };

  const handleFocusQuestion =
    (question) => {
      if (
        !question?.questionId
      ) {
        return;
      }

      setIsSidebarOpen(
        false,
      );

      pendingFocusRef.current =
        question.questionId;

      focusSearchCountRef.current =
        0;

      if (
        question.targetTeamId &&
        Number(
          question.targetTeamId,
        ) !==
        Number(
          selectedTeamId,
        )
      ) {
        setSelectedTeamId(
          question.targetTeamId,
        );

        return;
      }

      if (
        highlightQuestion(
          question.questionId,
        )
      ) {
        pendingFocusRef.current =
          null;
      }
    };

  const handleRefresh =
    async () => {
      setError('');

      await Promise.all([
        refreshLatestFeed(
          selectedTeamId,
          {
            showError: true,
          },
        ),

        loadTeamQuestionList(
          selectedTeamId,
        ),

        loadMyQuestionList(),
      ]);
    };

  const handleSubmitQuestion =
    async (event) => {
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
        setIsCreating(
          true,
        );

        setError('');

        pendingFocusRef.current =
          null;

        setFocusedQuestionId(
          null,
        );

        const response =
          await createQuestion({
            targetTeamId:
              selectedTeamId,
            content,
          });

        const created =
          response?.result ??
          {};

        setQuestionInput('');

        if (
          created.questionId
        ) {
          const optimisticQuestion =
          {
            questionId:
              created.questionId,

            targetTeamId:
              selectedTeamId,

            targetTeamName:
              selectedTeam?.name ??
              '팀',

            questionerId:
              profile?.userId,

            questionerName:
              profile?.name ??
              '나',

            questionerDepartment:
              profile?.department,

            questionerPosition:
              profile?.position,

            questionerProfileImageUrl:
              profile?.profileImageUrl,

            content,

            createdAt:
              new Date().toISOString(),

            status:
              created.status ??
              'PENDING',

            answer: null,

            sources: [],

            canAnswer:
              false,
          };

          shouldScrollBottomRef.current =
            true;

          setFeedQuestions(
            (previous) =>
              mergeQuestions(
                previous,
                [
                  optimisticQuestion,
                ],
              ),
          );
        }

        await Promise.all([
          refreshLatestFeed(
            selectedTeamId,
          ),

          loadTeamQuestionList(
            selectedTeamId,
          ),

          loadMyQuestionList(),
        ]);

        shouldScrollBottomRef.current =
          true;
      } catch (
      requestError
      ) {
        console.error(
          'Failed to create question:',
          requestError,
        );

        setError(
          requestError
            ?.response?.data
            ?.message ??
          '질문을 등록하지 못했습니다.',
        );
      } finally {
        setIsCreating(
          false,
        );
      }
    };

  const handleQuestionKeyDown =
    (event) => {
      if (
        event.key !==
        'Enter' ||
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

      event.currentTarget
        .form?.requestSubmit();
    };

  const handleOpenEditor =
    async (question) => {
      if (
        !question?.questionId ||
        !question?.answer
          ?.answerId ||
        !question.canAnswer
      ) {
        return;
      }

      try {
        setIsEditorOpen(
          true,
        );

        setIsEditorLoading(
          true,
        );

        setEditingQuestionId(
          question.questionId,
        );

        setQuestionDetail(
          null,
        );

        setAnswerDraft(
          question.answer
            ?.content ?? '',
        );

        setError('');

        const response =
          await getQuestionDetail(
            question.questionId,
          );

        const detail =
          response?.result ??
          null;

        setQuestionDetail(
          detail,
        );

        setAnswerDraft(
          detail?.answer
            ?.content ??
          question.answer
            ?.content ??
          '',
        );
      } catch (
      requestError
      ) {
        console.error(
          'Failed to load answer detail:',
          requestError,
        );

        setIsEditorOpen(
          false,
        );

        setEditingQuestionId(
          null,
        );

        setQuestionDetail(
          null,
        );

        setAnswerDraft('');

        setError(
          requestError
            ?.response?.data
            ?.message ??
          '답변 정보를 불러오지 못했습니다.',
        );
      } finally {
        setIsEditorLoading(
          false,
        );
      }
    };

  const handleCloseEditor =
    () => {
      if (isRevising) {
        return;
      }

      setIsEditorOpen(
        false,
      );

      setEditingQuestionId(
        null,
      );

      setQuestionDetail(
        null,
      );

      setAnswerDraft('');
    };

  const handleReviseAnswer =
    async () => {
      const answerId =
        questionDetail?.answer
          ?.answerId;

      const content =
        answerDraft.trim();

      if (
        !answerId ||
        !content ||
        !questionDetail
          ?.canAnswer ||
        isRevising
      ) {
        return;
      }

      try {
        setIsRevising(
          true,
        );

        setError('');

        await reviseAnswer(
          answerId,
          content,
        );

        if (
          editingQuestionId
        ) {
          const response =
            await getQuestionDetail(
              editingQuestionId,
            );

          const detail =
            response?.result ??
            null;

          if (detail) {
            setFeedQuestions(
              (previous) =>
                previous.map(
                  (question) => {
                    if (
                      Number(
                        question.questionId,
                      ) !==
                      Number(
                        editingQuestionId,
                      )
                    ) {
                      return question;
                    }

                    return {
                      ...question,

                      status:
                        detail.status ??
                        question.status,

                      answer:
                        detail.answer ??
                        question.answer,

                      canAnswer:
                        detail.canAnswer ??
                        question.canAnswer,

                      sources:
                        Array.isArray(
                          detail.sources,
                        )
                          ? detail.sources
                          : question.sources,
                    };
                  },
                ),
            );
          }
        }

        setIsEditorOpen(
          false,
        );

        setQuestionDetail(
          null,
        );

        setAnswerDraft('');

        setEditingQuestionId(
          null,
        );

        await Promise.all([
          refreshLatestFeed(
            selectedTeamId,
          ),

          loadTeamQuestionList(
            selectedTeamId,
          ),
        ]);
      } catch (
      requestError
      ) {
        console.error(
          'Failed to revise answer:',
          requestError,
        );

        setError(
          requestError
            ?.response?.data
            ?.message ??
          '답변을 저장하지 못했습니다.',
        );
      } finally {
        setIsRevising(
          false,
        );
      }
    };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <header className="shrink-0">
        <div className="flex items-center justify-between gap-4 pb-5">
          <div>
            <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-[#101211]">
              AI Q&A
            </h1>

            <p className="mt-1.5 text-[14px] leading-5 text-[#60766C]">
              팀의 회의록과 공유 정보를 기반으로 필요한 내용을 질문해보세요.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsSidebarOpen(
                true,
              )
            }
            className="flex h-11 items-center gap-2 rounded-[11px] border border-[#D4E9DF] bg-white px-4 text-[13px] font-semibold text-[#355C4B] lg:hidden"
          >
            <MenuIcon />

            {selectedTeam?.name ??
              'Q&A 목록'}
          </button>
        </div>

        <div className="relative z-20 flex min-h-[56px] items-end gap-2 overflow-x-auto">
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

          {projects.length ===
            0 &&
            !isLoading && (
              <div className="mb-[8px] flex h-11 items-center rounded-[11px] border border-dashed border-[#D6E9DF] px-5 text-[13px] text-[#6F857B]">
                참여 중인 프로젝트가 없습니다.
              </div>
            )}
        </div>
      </header>

      <section className="relative z-10 -mt-px flex min-h-0 flex-1 flex-col overflow-hidden rounded-b-[18px] rounded-tr-[18px] border border-[#C9EADD] bg-white">
        <div className="h-[8px] w-full shrink-0 bg-[#31F5A0]" />

        <div className="flex min-h-0 flex-1">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <aside className="hidden w-[290px] shrink-0 border-r border-[#E0E9E4] lg:block">
                <ConversationSidebar
                  teams={teams}
                  myTeamIds={
                    myTeamIds
                  }
                  myQuestions={
                    myQuestions
                  }
                  recentQuestions={
                    recentQuestions
                  }
                  selectedTeamId={
                    selectedTeamId
                  }
                  focusedQuestionId={
                    focusedQuestionId
                  }
                  isLoadingTeams={
                    isLoadingTeams
                  }
                  isLoadingRecent={
                    isLoadingRecent
                  }
                  onSelectTeam={
                    handleSelectTeam
                  }
                  onNewChat={
                    handleNewChat
                  }
                  onFocusQuestion={
                    handleFocusQuestion
                  }
                  onRefresh={
                    handleRefresh
                  }
                />
              </aside>

              <main className="flex min-w-0 flex-1 flex-col bg-white">
                <div className="flex min-h-[68px] shrink-0 items-center justify-between gap-4 border-b border-[#E2EAE6] px-5 sm:px-7">
                  <div className="min-w-0">
                    <p className="truncate text-[16px] font-semibold text-[#101211]">
                      {selectedTeam
                        ? `${selectedTeam.name} Q&A`
                        : '팀을 선택해주세요'}
                    </p>

                    <p className="mt-1 truncate text-[12px] text-[#83938B]">
                      {selectedTeam
                        ? '질문과 답변이 이 채팅방에 계속 이어집니다.'
                        : selectedProject?.name ??
                        ''}
                    </p>
                  </div>

                  {selectedTeam && (
                    <button
                      type="button"
                      onClick={
                        handleRefresh
                      }
                      className="flex size-9 items-center justify-center rounded-[9px] text-[#697D73] transition hover:bg-[#F1F8F4]"
                      aria-label="대화 새로고침"
                    >
                      <RefreshIcon />
                    </button>
                  )}
                </div>

                {error && (
                  <div className="mx-5 mt-3 shrink-0 rounded-[10px] border border-[#FFD6D1] bg-[#FFF6F5] px-4 py-3 text-[12px] text-[#D84A40] sm:mx-7">
                    {error}
                  </div>
                )}

                <div
                  ref={
                    conversationRef
                  }
                  onScroll={
                    handleConversationScroll
                  }
                  className="min-h-0 flex-1 overflow-y-auto bg-white px-5 py-5 sm:px-7 lg:px-9"
                >
                  {!selectedTeamId ? (
                    <div className="flex h-full min-h-[350px] items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#EFFFF7] text-[#16885B]">
                          <SparkleIcon />
                        </div>

                        <h2 className="mt-4 text-[17px] font-semibold text-[#101211]">
                          질문할 팀을 선택해주세요
                        </h2>
                      </div>
                    </div>
                  ) : isLoadingFeed ? (
                    <div className="flex h-full min-h-[350px] items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  ) : feedQuestions.length ===
                    0 ? (
                    <div className="flex h-full min-h-[350px] items-center justify-center">
                      <div className="max-w-[360px] text-center">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#31F5A0] text-[#101211]">
                          <SparkleIcon />
                        </div>

                        <h2 className="mt-4 text-[17px] font-semibold text-[#101211]">
                          {selectedTeam?.name}
                          에 첫 질문을 남겨보세요
                        </h2>

                        <p className="mt-2 text-[13px] leading-5 text-[#788B82]">
                          다음 질문도 같은 채팅방에 계속 이어집니다.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto w-full max-w-[860px]">
                      <div className="mb-4 flex min-h-[28px] items-center justify-center">
                        {isLoadingMore ? (
                          <div className="flex items-center gap-2 text-[11px] text-[#7F9088]">
                            <LoadingSpinner
                              size={14}
                            />
                            이전 대화를 불러오는 중...
                          </div>
                        ) : feedHasNext ? (
                          <button
                            type="button"
                            onClick={
                              loadOlderMessages
                            }
                            className="rounded-full bg-[#F3F8F5] px-4 py-2 text-[11px] font-medium text-[#687D73] transition hover:bg-[#E8F5EE]"
                          >
                            이전 대화 보기
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#A1AEA7]">
                            대화의 시작입니다
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        {feedQuestions.map(
                          (
                            question,
                            index,
                          ) => {
                            const previous =
                              feedQuestions[
                              index - 1
                              ];

                            const showDate =
                              index ===
                              0 ||
                              getDateKey(
                                previous
                                  ?.createdAt,
                              ) !==
                              getDateKey(
                                question.createdAt,
                              );

                            return (
                              <div
                                key={
                                  question.questionId
                                }
                              >
                                {showDate && (
                                  <DateDivider
                                    value={
                                      question.createdAt
                                    }
                                  />
                                )}

                                <ConversationItem
                                  question={
                                    question
                                  }
                                  profile={
                                    profile
                                  }
                                  teamName={
                                    selectedTeam?.name
                                  }
                                  focused={
                                    String(
                                      flashQuestionId ??
                                      '',
                                    ) ===
                                    String(
                                      question.questionId,
                                    )
                                  }
                                  onEdit={
                                    handleOpenEditor
                                  }
                                />
                              </div>
                            );
                          },
                        )}
                      </div>

                      <div className="h-4" />
                    </div>
                  )}
                </div>

                <div className="shrink-0 border-t border-[#E1E9E5] bg-white px-4 py-3 sm:px-6">
                  <form
                    onSubmit={
                      handleSubmitQuestion
                    }
                    className="mx-auto flex max-w-[900px] items-end gap-2 rounded-[12px] bg-[#F2F7F4] px-3.5 py-2"
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
                      onChange={(
                        event,
                      ) =>
                        setQuestionInput(
                          event
                            .target
                            .value,
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
                      className="max-h-[105px] min-h-[40px] min-w-0 flex-1 resize-none bg-transparent px-1 py-2 text-[14px] leading-5 text-[#101211] outline-none placeholder:text-[#9AA8A1] disabled:cursor-not-allowed"
                    />

                    <button
                      type="submit"
                      disabled={
                        !questionInput.trim() ||
                        !selectedTeamId ||
                        isCreating
                      }
                      className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-[#31F5A0] text-[#101211] transition hover:brightness-[0.97] disabled:cursor-not-allowed disabled:bg-[#D6E7DF] disabled:text-[#879B92]"
                      aria-label="질문 전송"
                    >
                      {isCreating ? (
                        <LoadingSpinner
                          size={15}
                        />
                      ) : (
                        <SendIcon />
                      )}
                    </button>
                  </form>

                  <p className="mx-auto mt-2 hidden max-w-[900px] px-1 text-[11px] text-[#8A9991] sm:block">
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
                    isLoading={
                      isEditorLoading
                    }
                    isRevising={
                      isRevising
                    }
                    onChange={(
                      event,
                    ) =>
                      setAnswerDraft(
                        event
                          .target
                          .value,
                      )
                    }
                    onSave={
                      handleReviseAnswer
                    }
                    onClose={
                      handleCloseEditor
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
            aria-label="Q&A 메뉴 닫기"
          />

          <aside className="absolute bottom-0 left-0 top-0 w-[min(90vw,330px)] border-r border-[#DCEDE5] bg-white shadow-[12px_0_40px_rgba(16,18,17,0.12)]">
            <div className="flex h-16 items-center justify-between border-b border-[#DFEEE7] px-4">
              <p className="text-[16px] font-semibold text-[#101211]">
                AI Q&A
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
                myTeamIds={
                  myTeamIds
                }
                myQuestions={
                  myQuestions
                }
                recentQuestions={
                  recentQuestions
                }
                selectedTeamId={
                  selectedTeamId
                }
                focusedQuestionId={
                  focusedQuestionId
                }
                isLoadingTeams={
                  isLoadingTeams
                }
                isLoadingRecent={
                  isLoadingRecent
                }
                onSelectTeam={
                  handleSelectTeam
                }
                onNewChat={
                  handleNewChat
                }
                onFocusQuestion={
                  handleFocusQuestion
                }
                onRefresh={
                  handleRefresh
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
            onClick={
              handleCloseEditor
            }
            aria-label="답변 작성 닫기"
          />

          <aside className="absolute bottom-0 right-0 top-0 w-[min(94vw,400px)] border-l border-[#DCEDE5] bg-white shadow-[-12px_0_40px_rgba(16,18,17,0.12)]">
            <AnswerEditorPanel
              answerDraft={
                answerDraft
              }
              questionDetail={
                questionDetail
              }
              isLoading={
                isEditorLoading
              }
              isRevising={
                isRevising
              }
              onChange={(
                event,
              ) =>
                setAnswerDraft(
                  event.target
                    .value,
                )
              }
              onSave={
                handleReviseAnswer
              }
              onClose={
                handleCloseEditor
              }
            />
          </aside>
        </div>
      )}
    </div>
  );
}

export default QAPage;
