import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import ActionItemPanel from '../../components/feature/meeting/ActionItemPanel';

import { getMeeting } from '../../api/meetingApi';

import {
  getMeetingSummary,
  retryMeetingSummary,
  updateMeetingSummary,
} from '../../api/summaryApi';

function ArrowLeftIcon() {
  return (
    <svg
      width="20"
      height="20"
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
        d="M20 11A8 8 0 1 0 18.4 15.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M20 6V11H15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 5V19M5 12H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="15"
      height="15"
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

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12L10 17L19 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 3L21 19H3L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M12 9V13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="16.5"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#DCE5E1] border-t-[#31F5A0]" />
  );
}

function EmptyListText() {
  return (
    <p className="text-sm text-[#8A9490]">
      등록된 내용이 없습니다.
    </p>
  );
}

function StatusView({
  status,
  onRetry,
  isRetrying,
}) {
  if (
    status === 'PENDING' ||
    status === 'PROCESSING'
  ) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#E5EAE8] bg-white px-6 text-center">
        <Spinner />

        <h2 className="mt-5 text-lg font-semibold text-[#101211]">
          AI가 회의록을 정리하고 있어요
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#7B8581]">
          녹음 내용을 분석해서
          <br />
          주요 내용과 할 일을 정리하고 있습니다.
        </p>

        <div className="mt-6 rounded-full bg-[#ECFFF6] px-4 py-2 text-xs font-medium text-[#16885B]">
          {status === 'PENDING'
            ? '분석 대기 중'
            : '분석 진행 중'}
        </div>
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-[#F3DEDC] bg-white px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF1F0] text-[#F64E42]">
          <AlertIcon />
        </div>

        <h2 className="mt-5 text-lg font-semibold text-[#101211]">
          회의록 생성에 실패했어요
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#7B8581]">
          녹음 처리 중 문제가 발생했습니다.
          <br />
          다시 시도할 수 있습니다.
        </p>

        <button
          type="button"
          disabled={isRetrying}
          onClick={onRetry}
          className="mt-6 flex h-10 items-center gap-2 rounded-lg bg-[#101211] px-5 text-sm font-semibold text-white transition hover:bg-[#272B29] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshIcon />

          {isRetrying
            ? '다시 요청 중...'
            : '다시 시도'}
        </button>
      </div>
    );
  }

  return null;
}

function MeetingSummaryPage() {
  const navigate = useNavigate();

  const { meetingId } =
    useParams();

  const [meeting, setMeeting] =
    useState(null);

  const [summaryData, setSummaryData] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isRetrying, setIsRetrying] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState('');

  const [editForm, setEditForm] =
    useState({
      summary: '',
      decisions: [],
      issues: [],
    });

  const loadSummary =
    useCallback(async () => {
      try {
        const response =
          await getMeetingSummary(
            meetingId,
          );

        const result =
          response?.result ?? null;

        setSummaryData(result);

        return result;
      } catch (requestError) {
        console.error(
          'Failed to get meeting summary:',
          requestError,
        );

        setError(
          requestError?.response?.data
            ?.message ??
          requestError?.message ??
          'AI 회의록을 불러오지 못했습니다.',
        );

        return null;
      }
    }, [meetingId]);

  useEffect(() => {
    let cancelled = false;

    const initialize =
      async () => {
        try {
          setIsLoading(true);
          setError('');

          const [
            meetingResponse,
            summaryResponse,
          ] = await Promise.all([
            getMeeting(meetingId),
            getMeetingSummary(
              meetingId,
            ),
          ]);

          if (cancelled) {
            return;
          }

          setMeeting(
            meetingResponse?.result ??
            null,
          );

          setSummaryData(
            summaryResponse?.result ??
            null,
          );
        } catch (requestError) {
          if (cancelled) {
            return;
          }

          console.error(
            'Failed to initialize meeting summary:',
            requestError,
          );

          setError(
            requestError?.response?.data
              ?.message ??
            requestError?.message ??
            '회의록을 불러오지 못했습니다.',
          );
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };

    initialize();

    return () => {
      cancelled = true;
    };
  }, [meetingId]);

  useEffect(() => {
    if (
      summaryData?.aiStatus !==
      'PENDING' &&
      summaryData?.aiStatus !==
      'PROCESSING'
    ) {
      return undefined;
    }

    const intervalId =
      window.setInterval(() => {
        loadSummary();
      }, 5000);

    return () => {
      window.clearInterval(
        intervalId,
      );
    };
  }, [
    summaryData?.aiStatus,
    loadSummary,
  ]);

  const handleRetry =
    async () => {
      try {
        setIsRetrying(true);
        setError('');

        await retryMeetingSummary(
          meetingId,
        );

        setSummaryData(
          (prev) => ({
            ...prev,
            aiStatus: 'PENDING',
          }),
        );
      } catch (requestError) {
        console.error(
          'Failed to retry meeting summary:',
          requestError,
        );

        setError(
          requestError?.response?.data
            ?.message ??
          requestError?.message ??
          '회의록 생성을 다시 요청하지 못했습니다.',
        );
      } finally {
        setIsRetrying(false);
      }
    };

  const handleStartEdit = () => {
    setEditForm({
      summary:
        summaryData?.summary ?? '',
      decisions: [
        ...(summaryData?.decisions ??
          []),
      ],
      issues: [
        ...(summaryData?.issues ??
          []),
      ],
    });

    setError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);

    setEditForm({
      summary: '',
      decisions: [],
      issues: [],
    });

    setError('');
  };

  const handleSummaryChange = (
    event,
  ) => {
    setEditForm((prev) => ({
      ...prev,
      summary: event.target.value,
    }));
  };

  const handleListChange = (
    type,
    index,
    value,
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [type]: prev[type].map(
        (item, itemIndex) =>
          itemIndex === index
            ? value
            : item,
      ),
    }));
  };

  const handleAddListItem = (
    type,
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        '',
      ],
    }));
  };

  const handleRemoveListItem = (
    type,
    index,
  ) => {
    setEditForm((prev) => ({
      ...prev,
      [type]: prev[type].filter(
        (_, itemIndex) =>
          itemIndex !== index,
      ),
    }));
  };

  const handleSave = async () => {
    const trimmedSummary =
      editForm.summary.trim();

    const trimmedDecisions =
      editForm.decisions
        .map((item) =>
          item.trim(),
        )
        .filter(Boolean);

    const trimmedIssues =
      editForm.issues
        .map((item) =>
          item.trim(),
        )
        .filter(Boolean);

    if (!trimmedSummary) {
      setError(
        '회의 요약을 입력해주세요.',
      );
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      await updateMeetingSummary(
        meetingId,
        {
          summary: trimmedSummary,
          decisions:
            trimmedDecisions,
          issues: trimmedIssues,
        },
      );

      setSummaryData(
        (prev) => ({
          ...prev,
          summary: trimmedSummary,
          decisions:
            trimmedDecisions,
          issues: trimmedIssues,
        }),
      );

      setIsEditing(false);
    } catch (requestError) {
      console.error(
        'Failed to update meeting summary:',
        requestError,
      );

      setError(
        requestError?.response?.data
          ?.message ??
        requestError?.message ??
        '회의록을 수정하지 못했습니다.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 w-full items-center justify-center">
        <div className="flex flex-col items-center">
          <Spinner />

          <p className="mt-4 text-sm text-[#7B8581]">
            회의록을 불러오고
            있습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 w-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[1180px] px-1 pb-12">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={() =>
                navigate('/meetings')
              }
              className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#303633] transition hover:bg-[#EEF2F0]"
              aria-label="회의 목록으로 돌아가기"
            >
              <ArrowLeftIcon />
            </button>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-semibold text-[#101211]">
                  {meeting?.title ??
                    'AI 회의록'}
                </h1>

                {summaryData?.aiStatus ===
                  'COMPLETED' && (
                    <span className="rounded-full bg-[#E8FFF4] px-3 py-1 text-xs font-semibold text-[#16885B]">
                      분석 완료
                    </span>
                  )}
              </div>

              <p className="mt-1 text-sm text-[#8A9490]">
                AI가 회의 내용을
                바탕으로 정리한
                회의록입니다.
              </p>
            </div>
          </div>

          {summaryData?.aiStatus ===
            'COMPLETED' &&
            !isEditing && (
              <button
                type="button"
                onClick={
                  handleStartEdit
                }
                className="flex shrink-0 items-center gap-2 rounded-lg border border-[#DCE3E0] bg-white px-4 py-2.5 text-sm font-semibold text-[#303633] transition hover:bg-[#F7F9F8]"
              >
                <EditIcon />
                수정
              </button>
            )}

          {summaryData?.aiStatus ===
            'COMPLETED' &&
            isEditing && (
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={
                    handleCancelEdit
                  }
                  className="rounded-lg border border-[#DCE3E0] bg-white px-4 py-2.5 text-sm font-semibold text-[#59625F] transition hover:bg-[#F7F9F8] disabled:opacity-50"
                >
                  취소
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSave}
                  className="rounded-lg bg-[#101211] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#272B29] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving
                    ? '저장 중...'
                    : '저장'}
                </button>
              </div>
            )}
        </header>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl bg-[#FFF1F0] px-4 py-3 text-sm text-[#D83D34]">
            <AlertIcon />
            <p>{error}</p>
          </div>
        )}

        {!summaryData ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-[#E5EAE8] bg-white">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-[#101211]">
                회의록 정보가
                없습니다.
              </h2>

              <p className="mt-2 text-sm text-[#7B8581]">
                아직 생성된 AI
                회의록이 없습니다.
              </p>
            </div>
          </div>
        ) : summaryData.aiStatus !==
          'COMPLETED' ? (
          <StatusView
            status={
              summaryData.aiStatus
            }
            onRetry={handleRetry}
            isRetrying={
              isRetrying
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-5">
              <section className="rounded-2xl border border-[#E5EAE8] bg-white p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#31F5A0]" />

                  <h2 className="text-base font-semibold text-[#101211]">
                    회의 요약
                  </h2>
                </div>

                {isEditing ? (
                  <textarea
                    value={
                      editForm.summary
                    }
                    onChange={
                      handleSummaryChange
                    }
                    rows={7}
                    placeholder="회의 요약을 입력해주세요."
                    className="w-full resize-y rounded-xl border border-[#DCE3E0] bg-[#FBFCFC] px-4 py-3 text-sm leading-7 text-[#303633] outline-none transition focus:border-[#31F5A0] focus:bg-white"
                  />
                ) : summaryData.summary ? (
                  <p className="whitespace-pre-wrap text-sm leading-7 text-[#3E4743]">
                    {
                      summaryData.summary
                    }
                  </p>
                ) : (
                  <EmptyListText />
                )}
              </section>

              <section className="rounded-2xl border border-[#E5EAE8] bg-white p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-[#101211]">
                    주요 결정사항
                  </h2>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAddListItem(
                          'decisions',
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#303633] transition hover:bg-[#F2F5F4]"
                    >
                      <PlusIcon />
                      항목 추가
                    </button>
                  )}
                </div>

                {isEditing ? (
                  editForm.decisions
                    .length > 0 ? (
                    <div className="space-y-3">
                      {editForm.decisions.map(
                        (
                          decision,
                          index,
                        ) => (
                          <div
                            key={index}
                            className="flex items-start gap-2"
                          >
                            <span className="mt-3.5 h-2 w-2 shrink-0 rounded-full bg-[#31F5A0]" />

                            <textarea
                              rows={2}
                              value={
                                decision
                              }
                              onChange={(
                                event,
                              ) =>
                                handleListChange(
                                  'decisions',
                                  index,
                                  event
                                    .target
                                    .value,
                                )
                              }
                              placeholder="결정사항을 입력해주세요."
                              className="min-h-[46px] flex-1 resize-y rounded-xl border border-[#DCE3E0] bg-[#FBFCFC] px-3 py-2.5 text-sm leading-6 text-[#303633] outline-none transition focus:border-[#31F5A0] focus:bg-white"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveListItem(
                                  'decisions',
                                  index,
                                )
                              }
                              className="mt-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8A9490] transition hover:bg-[#FFF1F0] hover:text-[#F64E42]"
                              aria-label="결정사항 삭제"
                            >
                              <CloseIcon />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        handleAddListItem(
                          'decisions',
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#DCE3E0] py-5 text-sm text-[#8A9490] transition hover:border-[#31F5A0] hover:text-[#303633]"
                    >
                      <PlusIcon />
                      결정사항 추가
                    </button>
                  )
                ) : summaryData
                  .decisions
                  ?.length > 0 ? (
                  <ul className="space-y-3">
                    {summaryData.decisions.map(
                      (
                        decision,
                        index,
                      ) => (
                        <li
                          key={`${decision}-${index}`}
                          className="flex gap-3 rounded-xl bg-[#F7FAF8] px-4 py-3"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#31F5A0] text-[#101211]">
                            <CheckIcon />
                          </span>

                          <p className="text-sm leading-6 text-[#3E4743]">
                            {decision}
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <EmptyListText />
                )}
              </section>

              <section className="rounded-2xl border border-[#E5EAE8] bg-white p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-[#101211]">
                    논의 이슈
                  </h2>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAddListItem(
                          'issues',
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#303633] transition hover:bg-[#F2F5F4]"
                    >
                      <PlusIcon />
                      항목 추가
                    </button>
                  )}
                </div>

                {isEditing ? (
                  editForm.issues
                    .length > 0 ? (
                    <div className="space-y-3">
                      {editForm.issues.map(
                        (
                          issue,
                          index,
                        ) => (
                          <div
                            key={index}
                            className="flex items-start gap-2"
                          >
                            <span className="mt-3.5 h-2 w-2 shrink-0 rounded-full bg-[#101211]" />

                            <textarea
                              rows={2}
                              value={issue}
                              onChange={(
                                event,
                              ) =>
                                handleListChange(
                                  'issues',
                                  index,
                                  event
                                    .target
                                    .value,
                                )
                              }
                              placeholder="논의 이슈를 입력해주세요."
                              className="min-h-[46px] flex-1 resize-y rounded-xl border border-[#DCE3E0] bg-[#FBFCFC] px-3 py-2.5 text-sm leading-6 text-[#303633] outline-none transition focus:border-[#31F5A0] focus:bg-white"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveListItem(
                                  'issues',
                                  index,
                                )
                              }
                              className="mt-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8A9490] transition hover:bg-[#FFF1F0] hover:text-[#F64E42]"
                              aria-label="논의 이슈 삭제"
                            >
                              <CloseIcon />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        handleAddListItem(
                          'issues',
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#DCE3E0] py-5 text-sm text-[#8A9490] transition hover:border-[#31F5A0] hover:text-[#303633]"
                    >
                      <PlusIcon />
                      논의 이슈 추가
                    </button>
                  )
                ) : summaryData
                  .issues?.length >
                  0 ? (
                  <ul className="space-y-3">
                    {summaryData.issues.map(
                      (
                        issue,
                        index,
                      ) => (
                        <li
                          key={`${issue}-${index}`}
                          className="flex gap-3 border-b border-[#EFF2F1] pb-3 last:border-none last:pb-0"
                        >
                          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#101211]" />

                          <p className="text-sm leading-6 text-[#3E4743]">
                            {issue}
                          </p>
                        </li>
                      ),
                    )}
                  </ul>
                ) : (
                  <EmptyListText />
                )}
              </section>

              <section className="rounded-2xl border border-[#E5EAE8] bg-white p-6">
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-[#101211]">
                    전체 대화 기록
                  </h2>

                  {isEditing && (
                    <p className="mt-1 text-xs text-[#8A9490]">
                      전체 대화 기록은
                      수정할 수 없습니다.
                    </p>
                  )}
                </div>

                {summaryData.rawTranscript ? (
                  <div className="max-h-[420px] overflow-y-auto rounded-xl bg-[#F7F9F8] p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#59625F]">
                      {
                        summaryData.rawTranscript
                      }
                    </p>
                  </div>
                ) : (
                  <EmptyListText />
                )}
              </section>
            </div>

            <aside className="min-w-0">
              <ActionItemPanel
                meetingId={
                  meetingId
                }
                teamId={
                  meeting?.teamId
                }
                actionItems={
                  summaryData.actionItems ??
                  []
                }
                onRefresh={
                  loadSummary
                }
              />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default MeetingSummaryPage;
