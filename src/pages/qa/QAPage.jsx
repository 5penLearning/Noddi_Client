import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  createQuestion,
  getMyQuestions,
  getQuestionDetail,
  getTeamQuestions,
  reviseAnswer,
} from '../../api/qaApi';

import { getMyTeams } from '../../api/teams';

function ChatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 5H19C20.1046 5 21 5.89543 21 7V15C21 16.1046 20.1046 17 19 17H10L5 21V17C3.89543 17 3 16.1046 3 15V7C3 5.89543 3.89543 5 5 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4L21 12L4 20L7 12L4 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path d="M7 12H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SourceIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 3H14L19 8V21H6V3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path d="M14 3V8H19" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STATUS_MAP = {
  PENDING: {
    label: '대기 중',
    className: 'bg-[#F3F5F4] text-[#77807C]',
  },

  PROCESSING: {
    label: '답변 생성 중',
    className: 'bg-[#FFF8DA] text-[#89751E]',
  },

  ANSWERED: {
    label: '답변 완료',
    className: 'bg-[#EFFFF7] text-[#16885B]',
  },

  FAILED: {
    label: '답변 실패',
    className: 'bg-[#FFF1F0] text-[#F64E42]',
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

function formatTime(value) {
  if (!value) {
    return '';
  }

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
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
  });
}

function getInitial(name) {
  if (!name) {
    return 'Q';
  }

  return name.trim().charAt(0) || 'Q';
}

function QuestionListItem({ question, selected, onClick }) {
  const status = getStatus(question.status);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl px-3 py-3 text-left transition ${
        selected ? 'bg-[#ECFFF5]' : 'hover:bg-[#F7F9F8]'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C8F4DC] bg-white text-[9px] font-semibold text-[#16885B]">
          Q&A
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-semibold text-[#101211]">
              {question.targetTeamName ?? '팀 Q&A'}
            </p>

            <span className="shrink-0 text-[9px] text-[#A0A8A4]">
              {formatTime(question.createdAt)}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#7C8681]">
            {question.content}
          </p>

          <div className="mt-2">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function EmptyList({ children }) {
  return (
    <div className="px-3 py-7 text-center">
      <p className="text-[11px] leading-5 text-[#9AA39F]">{children}</p>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="h-6 w-6 animate-spin rounded-full border-[3px] border-[#E0E6E3] border-t-[#31F5A0]" />
  );
}

function QAPage() {
  const location = useLocation();
  const targetQuestionId = location.state?.questionId;
  const targetTeamId = location.state?.teamId;
  const [teams, setTeams] = useState([]);

  const [selectedTeamId, setSelectedTeamId] = useState(null);

  const [myQuestions, setMyQuestions] = useState([]);

  const [teamQuestions, setTeamQuestions] = useState([]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [questionDetail, setQuestionDetail] = useState(null);

  const [questionInput, setQuestionInput] = useState('');

  const [answerDraft, setAnswerDraft] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  const [isLoadingTeamQuestions, setIsLoadingTeamQuestions] = useState(false);

  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const [isCreating, setIsCreating] = useState(false);

  const [isRevising, setIsRevising] = useState(false);

  const [error, setError] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const selectedTeam = useMemo(() => {
    return teams.find((team) => Number(team.teamId) === Number(selectedTeamId)) ?? null;
  }, [teams, selectedTeamId]);

  const selectedQuestionTeamId = selectedQuestion?.targetTeamId ?? questionDetail?.targetTeamId;

  const canEditAnswer = useMemo(() => {
    if (!selectedQuestionTeamId) {
      return false;
    }

    return teams.some((team) => Number(team.teamId) === Number(selectedQuestionTeamId));
  }, [teams, selectedQuestionTeamId]);

  const loadQuestionDetail = useCallback(async (questionId) => {
    if (!questionId) {
      setQuestionDetail(null);

      setAnswerDraft('');

      return;
    }

    try {
      setIsLoadingDetail(true);

      setError('');

      const response = await getQuestionDetail(questionId);

      const detail = response?.result ?? null;

      setQuestionDetail(detail);

      setAnswerDraft(detail?.answer?.content ?? '');
    } catch (requestError) {
      console.error('Failed to load question detail:', requestError);

      setError(requestError?.response?.data?.message ?? '질문 상세 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const loadMyQuestions = useCallback(async () => {
    try {
      const response = await getMyQuestions();

      const questions = getPageContent(response);

      setMyQuestions(questions);

      return questions;
    } catch (requestError) {
      console.error('Failed to load my questions:', requestError);

      throw requestError;
    }
  }, []);

  const loadTeamQuestions = useCallback(async (teamId) => {
    if (!teamId) {
      setTeamQuestions([]);

      return [];
    }

    try {
      setIsLoadingTeamQuestions(true);

      const response = await getTeamQuestions(teamId);

      const questions = getPageContent(response);

      setTeamQuestions(questions);

      return questions;
    } catch (requestError) {
      console.error('Failed to load team questions:', requestError);

      setTeamQuestions([]);

      return [];
    } finally {
      setIsLoadingTeamQuestions(false);
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);

      setError('');

      const [teamResponse, myQuestionResponse] = await Promise.all([
        getMyTeams(),
        getMyQuestions(),
      ]);

      const nextTeams = teamResponse;

      const nextMyQuestions = getPageContent(myQuestionResponse);

      setTeams(nextTeams);

      setMyQuestions(nextMyQuestions);

      if (targetTeamId || nextTeams.length > 0) {
        setSelectedTeamId(targetTeamId ?? nextTeams[0].teamId);
      }

      if (targetQuestionId) {
        setSelectedQuestion({
          questionId: targetQuestionId,
          targetTeamId,
        });
      } else if (nextMyQuestions.length > 0) {
        setSelectedQuestion(nextMyQuestions[0]);
      }
    } catch (requestError) {
      console.error('Failed to load Q&A:', requestError);

      setError(requestError?.response?.data?.message ?? 'Q&A 정보를 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [targetQuestionId, targetTeamId]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    if (!selectedTeamId) {
      setTeamQuestions([]);

      return;
    }

    loadTeamQuestions(selectedTeamId);
  }, [selectedTeamId, loadTeamQuestions]);

  useEffect(() => {
    if (!selectedQuestion?.questionId) {
      setQuestionDetail(null);

      setAnswerDraft('');

      return;
    }

    loadQuestionDetail(selectedQuestion.questionId);
  }, [selectedQuestion, loadQuestionDetail]);

  useEffect(() => {
    const status = questionDetail?.status;

    if (status !== 'PENDING' && status !== 'PROCESSING') {
      return undefined;
    }

    const intervalId = window.setInterval(async () => {
      await loadQuestionDetail(questionDetail.questionId);
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [questionDetail?.questionId, questionDetail?.status, loadQuestionDetail]);

  const handleRefresh = async () => {
    try {
      setError('');
      setSuccessMessage('');

      await Promise.all([
        loadMyQuestions(),

        selectedTeamId ? loadTeamQuestions(selectedTeamId) : Promise.resolve([]),

        selectedQuestion?.questionId
          ? loadQuestionDetail(selectedQuestion.questionId)
          : Promise.resolve(),
      ]);
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? '질문 목록을 새로고침하지 못했습니다.');
    }
  };

  const handleSelectTeam = (teamId) => {
    setSelectedTeamId(teamId);

    setSuccessMessage('');
    setError('');
  };

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);

    setSuccessMessage('');
    setError('');
  };

  const handleSubmitQuestion = async (event) => {
    event.preventDefault();

    const content = questionInput.trim();

    if (!content || !selectedTeamId || isCreating) {
      return;
    }

    try {
      setIsCreating(true);

      setError('');
      setSuccessMessage('');

      const response = await createQuestion({
        targetTeamId: selectedTeamId,

        content,
      });

      const created = response?.result;

      setQuestionInput('');

      const createdQuestion = {
        questionId: created?.questionId,

        targetTeamId: selectedTeamId,

        targetTeamName: selectedTeam?.name ?? '팀',

        questionerName: '나',

        content,

        status: created?.status ?? 'PENDING',

        createdAt: new Date().toISOString(),
      };

      if (created?.questionId) {
        setSelectedQuestion(createdQuestion);
      }

      await Promise.all([loadMyQuestions(), loadTeamQuestions(selectedTeamId)]);

      setSuccessMessage('질문을 등록했습니다.');
    } catch (requestError) {
      console.error('Failed to create question:', requestError);

      setError(requestError?.response?.data?.message ?? '질문을 등록하지 못했습니다.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuestionKeyDown = (event) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (!questionInput.trim() || !selectedTeamId || isCreating) {
      return;
    }

    event.currentTarget.form?.requestSubmit();
  };

  const handleReviseAnswer = async () => {
    const answerId = questionDetail?.answer?.answerId;

    const content = answerDraft.trim();

    if (!answerId || !content || isRevising) {
      return;
    }

    try {
      setIsRevising(true);

      setError('');
      setSuccessMessage('');

      await reviseAnswer(answerId, content);

      await loadQuestionDetail(questionDetail.questionId);

      setSuccessMessage('답변을 수정했습니다.');
    } catch (requestError) {
      console.error('Failed to revise answer:', requestError);

      setError(requestError?.response?.data?.message ?? '답변을 수정하지 못했습니다.');
    } finally {
      setIsRevising(false);
    }
  };

  const detailStatus = getStatus(questionDetail?.status ?? selectedQuestion?.status);

  const hasAnswerChanged = answerDraft.trim() !== (questionDetail?.answer?.content ?? '').trim();

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      {/* 페이지 헤더 */}
      <header className="shrink-0 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#101211]">Q&A</h1>

          <p className="mt-1 text-xs text-[#8A9490]">
            팀의 회의록과 공유 정보를 기반으로 필요한 내용을 질문해보세요.
          </p>
        </div>

        {/* 팀 탭 */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {teams.map((team) => {
            const selected = Number(team.teamId) === Number(selectedTeamId);

            return (
              <button
                key={team.teamId}
                type="button"
                onClick={() => handleSelectTeam(team.teamId)}
                className={`shrink-0 rounded-xl border px-5 py-3 text-xs font-semibold transition ${
                  selected
                    ? 'border-[#31F5A0] bg-[#31F5A0] text-[#101211]'
                    : 'border-[#E1E7E4] bg-white text-[#4F5955] hover:bg-[#F7F9F8]'
                }`}
              >
                {team.name}
              </button>
            );
          })}

          {teams.length === 0 && !isLoading && (
            <div className="rounded-xl border border-dashed border-[#DCE3E0] px-5 py-3 text-xs text-[#8A9490]">
              참여 중인 팀이 없습니다.
            </div>
          )}
        </div>
      </header>

      {error && (
        <div className="mb-3 shrink-0 rounded-xl border border-[#FFDAD6] bg-[#FFF5F4] px-4 py-3 text-xs text-[#D83D34]">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-3 shrink-0 rounded-xl border border-[#C8F7DF] bg-[#EDFFF6] px-4 py-3 text-xs text-[#16885B]">
          {successMessage}
        </div>
      )}

      {/* Q&A 본체 */}
      <section className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-[#DFE6E2] bg-white">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center">
                <LoadingSpinner />
              </div>

              <p className="mt-4 text-xs text-[#8A9490]">Q&A를 불러오고 있습니다.</p>
            </div>
          </div>
        ) : (
          <div className="grid h-full min-h-0 grid-cols-[270px_minmax(0,1fr)_300px]">
            {/* 질문 목록 */}
            <aside className="flex min-h-0 flex-col border-r border-[#E6EBE8] bg-white">
              <div className="shrink-0 border-b border-[#EDF1EF] p-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!selectedTeam}
                    onClick={() => document.getElementById('qa-question-input')?.focus()}
                    className="flex h-10 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-[#31F5A0] bg-[#ECFFF5] text-xs font-semibold text-[#16885B] transition hover:bg-[#DFFFF0] disabled:cursor-not-allowed disabled:border-[#DCE3E0] disabled:bg-[#F5F7F6] disabled:text-[#A0A8A4]"
                  >
                    <ChatIcon />새 질문
                  </button>

                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E1E7E4] text-[#59625F] transition hover:bg-[#F5F7F6]"
                    aria-label="새로고침"
                  >
                    <RefreshIcon />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
                <div className="flex items-center justify-between px-2 pb-2">
                  <p className="text-[11px] font-semibold text-[#59625F]">내 질문</p>

                  <span className="text-[9px] text-[#A0A8A4]">{myQuestions.length}</span>
                </div>

                {myQuestions.length === 0 ? (
                  <EmptyList>아직 작성한 질문이 없습니다.</EmptyList>
                ) : (
                  <div className="space-y-1">
                    {myQuestions.map((question) => (
                      <QuestionListItem
                        key={`MY-${question.questionId}`}
                        question={question}
                        selected={
                          Number(selectedQuestion?.questionId) === Number(question.questionId)
                        }
                        onClick={() => handleSelectQuestion(question)}
                      />
                    ))}
                  </div>
                )}

                <div className="mx-2 my-4 border-t border-[#EDF1EF]" />

                <div className="flex items-center justify-between px-2 pb-2">
                  <div className="flex items-center gap-1.5">
                    <p className="max-w-[150px] truncate text-[11px] font-semibold text-[#59625F]">
                      {selectedTeam?.name ?? '팀'} 질문
                    </p>

                    <ChevronDownIcon />
                  </div>

                  <span className="text-[9px] text-[#A0A8A4]">{teamQuestions.length}</span>
                </div>

                {isLoadingTeamQuestions ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : teamQuestions.length === 0 ? (
                  <EmptyList>이 팀에 등록된 질문이 없습니다.</EmptyList>
                ) : (
                  <div className="space-y-1">
                    {teamQuestions.map((question) => (
                      <QuestionListItem
                        key={`TEAM-${question.questionId}`}
                        question={question}
                        selected={
                          Number(selectedQuestion?.questionId) === Number(question.questionId)
                        }
                        onClick={() => handleSelectQuestion(question)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </aside>

            {/* 가운데 */}
            <main className="flex min-h-0 min-w-0 flex-col">
              {/* 중앙 콘텐츠 */}
              <div className="min-h-0 flex-1">
                {!selectedQuestion ? (
                  <div className="flex h-full items-center justify-center px-10">
                    <div className="max-w-[320px] text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFFF5] text-[#16885B]">
                        <SparkleIcon />
                      </div>

                      <h2 className="mt-4 text-sm font-semibold text-[#101211]">
                        팀에 질문해보세요
                      </h2>

                      <p className="mt-2 text-xs leading-5 text-[#8A9490]">
                        궁금한 업무 내용을 입력하면 팀의 정보를 바탕으로 AI 답변을 생성합니다.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-0 flex-col">
                    {/* 질문 헤더 */}
                    <div className="shrink-0 border-b border-[#EDF1EF] px-6 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E5E9E7] text-[11px] font-semibold text-[#59625F]">
                              {getInitial(
                                questionDetail?.questionerName ?? selectedQuestion.questionerName,
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-[#101211]">
                                {questionDetail?.questionerName ??
                                  selectedQuestion.questionerName ??
                                  '질문자'}
                              </p>

                              <p className="mt-0.5 truncate text-[10px] text-[#8A9490]">
                                {questionDetail?.targetTeamName ??
                                  selectedQuestion.targetTeamName ??
                                  '팀'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-[#A0A8A4]">
                            {formatDate(questionDetail?.createdAt ?? selectedQuestion.createdAt)}{' '}
                            {formatTime(questionDetail?.createdAt ?? selectedQuestion.createdAt)}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[9px] font-medium ${detailStatus.className}`}
                          >
                            {detailStatus.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 질문 + 답변 */}
                    <div className="min-h-0 flex-1 overflow-y-auto px-7 py-7">
                      {isLoadingDetail ? (
                        <div className="flex h-full items-center justify-center">
                          <LoadingSpinner />
                        </div>
                      ) : (
                        <div className="mx-auto max-w-[720px]">
                          {/* 사용자 질문 */}
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E5E9E7] text-xs font-semibold text-[#59625F]">
                              {getInitial(
                                questionDetail?.questionerName ?? selectedQuestion.questionerName,
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#303633]">
                                {questionDetail?.questionerName ??
                                  selectedQuestion.questionerName ??
                                  '질문자'}
                              </p>

                              <div className="mt-2 max-w-[520px] rounded-[4px_15px_15px_15px] bg-[#F2F4F3] px-4 py-3">
                                <p className="text-sm leading-6 whitespace-pre-wrap text-[#303633]">
                                  {questionDetail?.content ?? selectedQuestion.content}
                                </p>
                              </div>

                              <p className="mt-1.5 text-[9px] text-[#A0A8A4]">
                                {formatTime(
                                  questionDetail?.createdAt ?? selectedQuestion.createdAt,
                                )}
                              </p>
                            </div>
                          </div>

                          {/* AI 답변 */}
                          <div className="mt-8 flex justify-end">
                            {questionDetail?.status === 'ANSWERED' && questionDetail?.answer ? (
                              <div className="max-w-[78%]">
                                <div className="rounded-[15px_4px_15px_15px] border border-[#D3F4E3] bg-[#F0FFF8] px-5 py-4">
                                  <div className="mb-3 flex items-center gap-2 text-[#16885B]">
                                    <SparkleIcon />

                                    <span className="text-[10px] font-semibold">AI 답변</span>
                                  </div>

                                  <p className="text-sm leading-6 whitespace-pre-wrap text-[#25302B]">
                                    {questionDetail.answer.content}
                                  </p>

                                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#DDF4E8] pt-3">
                                    <span className="text-[9px] text-[#7C8681]">AI generated</span>

                                    {questionDetail.answer.revised && (
                                      <>
                                        <span className="text-[9px] text-[#C1C7C4]">·</span>

                                        <span className="text-[9px] font-medium text-[#F64E42]">
                                          수정됨
                                        </span>

                                        {questionDetail.answer.lastRevisedByName && (
                                          <span className="text-[9px] text-[#8A9490]">
                                            {questionDetail.answer.lastRevisedByName}
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* 답변 출처 */}
                                {questionDetail?.sources?.length > 0 && (
                                  <div className="mt-3">
                                    <p className="mb-2 text-[10px] font-semibold text-[#7C8681]">
                                      답변 출처
                                    </p>

                                    <div className="space-y-2">
                                      {questionDetail.sources.map((source, index) => (
                                        <div
                                          key={`${source.citationIndex}-${source.referenceId}-${index}`}
                                          className="rounded-xl border border-[#E3E9E6] bg-white px-3 py-3"
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="text-[#59625F]">
                                              <SourceIcon />
                                            </span>

                                            <p className="min-w-0 flex-1 truncate text-[10px] font-semibold text-[#303633]">
                                              {source.sourceTitle ?? '참고 자료'}
                                            </p>

                                            <span className="shrink-0 rounded-full bg-[#F2F5F3] px-2 py-0.5 text-[8px] font-medium text-[#7C8681]">
                                              {source.sourceType === 'TRANSCRIPT'
                                                ? '회의 기록'
                                                : '팀 페이지'}
                                            </span>
                                          </div>

                                          {source.excerpt && (
                                            <p className="mt-2 line-clamp-3 text-[9px] leading-4 text-[#8A9490]">
                                              {source.excerpt}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : questionDetail?.status === 'FAILED' ? (
                              <div className="rounded-xl border border-[#FFDAD6] bg-[#FFF5F4] px-5 py-4">
                                <p className="text-xs font-semibold text-[#D83D34]">
                                  답변 생성에 실패했습니다.
                                </p>

                                <p className="mt-1 text-[10px] text-[#A85F59]">
                                  잠시 후 다시 확인해주세요.
                                </p>
                              </div>
                            ) : (
                              <div className="rounded-xl border border-[#E3E9E6] bg-[#FAFBFA] px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#DCE5E1] border-t-[#31F5A0]" />

                                  <div>
                                    <p className="text-xs font-semibold text-[#303633]">
                                      AI가 답변을 생성하고 있습니다.
                                    </p>

                                    <p className="mt-1 text-[9px] text-[#8A9490]">
                                      완료되면 자동으로 표시됩니다.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 새 질문 입력 */}
              <div className="shrink-0 border-t border-[#EDF1EF] bg-white px-6 py-4">
                <form
                  onSubmit={handleSubmitQuestion}
                  className="rounded-xl border border-[#DCE3E0] bg-white transition focus-within:border-[#31F5A0]"
                >
                  <textarea
                    id="qa-question-input"
                    value={questionInput}
                    maxLength={500}
                    disabled={!selectedTeam || isCreating}
                    onChange={(event) => setQuestionInput(event.target.value)}
                    onKeyDown={handleQuestionKeyDown}
                    rows={2}
                    placeholder={
                      selectedTeam
                        ? `${selectedTeam.name}에 궁금한 내용을 질문하세요.`
                        : '질문할 팀을 먼저 선택해주세요.'
                    }
                    className="block max-h-28 min-h-[64px] w-full resize-none rounded-t-xl bg-transparent px-4 pt-3 text-xs leading-5 text-[#101211] outline-none placeholder:text-[#A0A8A4] disabled:cursor-not-allowed disabled:bg-[#FAFBFA]"
                  />

                  <div className="flex items-center justify-between px-4 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-[#A0A8A4]">Enter 전송</span>

                      <span className="text-[9px] text-[#C4CAC7]">·</span>

                      <span className="text-[9px] text-[#A0A8A4]">Shift + Enter 줄바꿈</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[9px] text-[#A0A8A4]">
                        {questionInput.length}
                        /500
                      </span>

                      <button
                        type="submit"
                        disabled={!questionInput.trim() || !selectedTeam || isCreating}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#31F5A0] text-[#101211] transition hover:bg-[#23E993] disabled:cursor-not-allowed disabled:bg-[#DCE3E0] disabled:text-[#9AA39F]"
                        aria-label="질문 전송"
                      >
                        <SendIcon />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </main>

            {/* 오른쪽 답변 수정 */}
            <aside className="flex min-h-0 flex-col border-l border-[#E6EBE8] bg-[#FAFBFA]">
              <div className="shrink-0 border-b border-[#E6EBE8] px-5 py-5">
                <div className="flex items-center gap-2">
                  <span className="text-[#16885B]">
                    <SparkleIcon />
                  </span>

                  <h2 className="text-sm font-semibold text-[#101211]">답변 수정</h2>
                </div>

                <p className="mt-2 text-[10px] leading-4 text-[#8A9490]">
                  AI가 생성한 답변을 팀 상황에 맞게 수정할 수 있습니다.
                </p>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-5">
                {!selectedQuestion ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <p className="text-xs leading-5 text-[#9AA39F]">
                      수정할 질문을
                      <br />
                      먼저 선택해주세요.
                    </p>
                  </div>
                ) : isLoadingDetail ? (
                  <div className="flex h-full items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : !questionDetail?.answer ? (
                  <div className="rounded-xl border border-[#E3E9E6] bg-white px-4 py-5">
                    <p className="text-xs font-semibold text-[#303633]">
                      아직 수정할 답변이 없습니다.
                    </p>

                    <p className="mt-2 text-[10px] leading-4 text-[#8A9490]">
                      AI 답변 생성이 완료되면 이곳에서 답변을 수정할 수 있습니다.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="qa-answer-editor"
                        className="text-[11px] font-semibold text-[#59625F]"
                      >
                        답변 내용
                      </label>

                      <textarea
                        id="qa-answer-editor"
                        value={answerDraft}
                        maxLength={1000}
                        disabled={!canEditAnswer || isRevising}
                        onChange={(event) => setAnswerDraft(event.target.value)}
                        className="mt-2 h-[280px] w-full resize-none rounded-xl border border-[#DCE3E0] bg-white p-4 text-xs leading-5 text-[#303633] transition outline-none focus:border-[#31F5A0] disabled:bg-[#F3F5F4] disabled:text-[#8A9490]"
                      />

                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-[9px] text-[#9AA39F]">
                          {answerDraft.length}
                          /1000
                        </span>

                        {!canEditAnswer && (
                          <span className="text-right text-[9px] text-[#F64E42]">
                            대상 팀의 팀원만 수정할 수 있습니다.
                          </span>
                        )}
                      </div>
                    </div>

                    {questionDetail?.sources?.length > 0 && (
                      <div className="mt-6">
                        <p className="text-[11px] font-semibold text-[#59625F]">
                          답변에 참고한 정보
                        </p>

                        <div className="mt-3 space-y-2">
                          {questionDetail.sources.map((source, index) => (
                            <div
                              key={`RIGHT-${source.citationIndex}-${source.referenceId}-${index}`}
                              className="rounded-xl border border-[#E3E9E6] bg-white px-3 py-3"
                            >
                              <div className="flex items-center gap-2">
                                <span className="shrink-0 text-[#59625F]">
                                  <SourceIcon />
                                </span>

                                <p className="min-w-0 flex-1 truncate text-[10px] font-semibold text-[#303633]">
                                  {source.sourceTitle ?? '참고 자료'}
                                </p>
                              </div>

                              <p className="mt-2 text-[8px] font-medium text-[#16885B]">
                                {source.sourceType === 'TRANSCRIPT' ? '회의 기록' : '팀 페이지'}
                              </p>

                              {source.excerpt && (
                                <p className="mt-2 line-clamp-4 text-[9px] leading-4 text-[#8A9490]">
                                  {source.excerpt}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="shrink-0 border-t border-[#E6EBE8] bg-white p-5">
                <button
                  type="button"
                  disabled={
                    !questionDetail?.answer ||
                    !canEditAnswer ||
                    !answerDraft.trim() ||
                    !hasAnswerChanged ||
                    isRevising
                  }
                  onClick={handleReviseAnswer}
                  className="h-10 w-full rounded-xl bg-[#101211] text-xs font-semibold text-white transition hover:bg-[#292E2B] disabled:cursor-not-allowed disabled:bg-[#D8DEDB] disabled:text-[#8A9490]"
                >
                  {isRevising ? '수정 중...' : '답변 수정하기'}
                </button>
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

export default QAPage;
