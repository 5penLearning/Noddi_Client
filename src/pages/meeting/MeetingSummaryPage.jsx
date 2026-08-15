import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  getMeetingSummary,
  retryMeetingSummary,
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
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 6V11H15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4 18V13H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M6.1 8.3A7 7 0 0117.5 6L20 8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M17.9 15.7A7 7 0 016.5 18L4 15.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SummarySection({
  title,
  children,
}) {
  return (
    <section className="rounded-2xl border border-[#E8ECEA] bg-white p-6">
      <h2 className="text-base font-semibold text-[#101211]">
        {title}
      </h2>

      <div className="mt-4">
        {children}
      </div>
    </section>
  );
}

function ProcessingState({
  aiStatus,
  onRefresh,
  isRefreshing,
}) {
  const isPending =
    aiStatus === 'PENDING';

  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#E8ECEA] bg-white px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E7FFF4]">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#31F5A0] border-t-transparent" />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-[#101211]">
        {isPending
          ? 'AI 회의록 생성을 기다리고 있습니다.'
          : 'AI가 회의 내용을 정리하고 있습니다.'}
      </h2>

      <p className="mt-2 max-w-[420px] text-sm leading-6 text-[#7B8581]">
        녹음본 처리가 완료되면 요약,
        결정사항, 주요 이슈와 할 일이
        자동으로 정리됩니다.
      </p>

      <button
        type="button"
        disabled={isRefreshing}
        onClick={onRefresh}
        className="mt-6 flex items-center gap-2 rounded-lg border border-[#D8DFDC] px-4 py-2.5 text-sm font-medium text-[#303633] transition hover:bg-[#F5F7F6] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshIcon />

        {isRefreshing
          ? '확인 중...'
          : '상태 새로고침'}
      </button>
    </div>
  );
}

function FailedState({
  onRetry,
  isRetrying,
  errorMessage,
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#FFDAD6] bg-white px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF1F0] text-xl font-bold text-[#F64E42]">
        !
      </div>

      <h2 className="mt-5 text-lg font-semibold text-[#101211]">
        AI 회의록 생성에 실패했습니다.
      </h2>

      <p className="mt-2 max-w-[420px] text-sm leading-6 text-[#7B8581]">
        {errorMessage ||
          '녹음본 처리 중 문제가 발생했습니다. 다시 시도할 수 있습니다.'}
      </p>

      <button
        type="button"
        disabled={isRetrying}
        onClick={onRetry}
        className="mt-6 rounded-lg bg-[#101211] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRetrying
          ? '재시도 중...'
          : 'AI 회의록 다시 생성'}
      </button>
    </div>
  );
}

function MeetingSummaryPage() {
  const navigate = useNavigate();

  const { meetingId } =
    useParams();

  const [summary, setSummary] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [
    isRetrying,
    setIsRetrying,
  ] = useState(false);

  const [error, setError] =
    useState('');

  const loadSummary =
    useCallback(
      async ({
        showLoading = false,
      } = {}) => {
        try {
          if (showLoading) {
            setIsLoading(true);
          } else {
            setIsRefreshing(true);
          }

          setError('');

          const response =
            await getMeetingSummary(
              meetingId,
            );

          setSummary(
            response?.result ?? null,
          );
        } catch (requestError) {
          console.error(
            'Failed to load meeting summary:',
            requestError,
          );

          setError(
            requestError?.response
              ?.data?.message ??
            'AI 회의록을 불러오지 못했습니다.',
          );
        } finally {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      },
      [meetingId],
    );

  /*
   * 최초 조회
   */
  useEffect(() => {
    loadSummary({
      showLoading: true,
    });
  }, [loadSummary]);

  /*
   * PENDING / PROCESSING 상태는
   * 5초 간격으로 다시 조회
   */
  useEffect(() => {
    const aiStatus =
      summary?.aiStatus;

    if (
      aiStatus !== 'PENDING' &&
      aiStatus !== 'PROCESSING'
    ) {
      return undefined;
    }

    const timer = window.setTimeout(
      () => {
        loadSummary();
      },
      5000,
    );

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    summary?.aiStatus,
    loadSummary,
  ]);

  const handleRetry = async () => {
    if (isRetrying) {
      return;
    }

    try {
      setIsRetrying(true);
      setError('');

      await retryMeetingSummary(
        meetingId,
      );

      await loadSummary();
    } catch (retryError) {
      console.error(
        'Failed to retry summary:',
        retryError,
      );

      setError(
        retryError?.response?.data
          ?.message ??
        'AI 회의록 재시도에 실패했습니다.',
      );
    } finally {
      setIsRetrying(false);
    }
  };

  const aiStatus =
    summary?.aiStatus;

  const decisions =
    summary?.decisions ?? [];

  const issues =
    summary?.issues ?? [];

  const actionItems =
    summary?.actionItems ?? [];

  if (isLoading) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <p className="text-sm text-[#8A9490]">
          AI 회의록을 불러오고 있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto pb-10">
      <header className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            navigate('/meetings')
          }
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#303633] transition hover:bg-[#EEF2F0]"
          aria-label="뒤로가기"
        >
          <ArrowLeftIcon />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-[#101211]">
            AI 회의록
          </h1>

          <p className="mt-1 text-sm text-[#8A9490]">
            회의 #{meetingId}
          </p>
        </div>
      </header>

      {error &&
        aiStatus !== 'FAILED' && (
          <div className="mb-4 rounded-xl bg-[#FFF1F0] px-4 py-3">
            <p className="text-sm text-[#F64E42]">
              {error}
            </p>
          </div>
        )}

      {!summary ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-[#E8ECEA] bg-white">
          <p className="text-sm text-[#8A9490]">
            회의록 정보가 없습니다.
          </p>

          <button
            type="button"
            onClick={() =>
              loadSummary()
            }
            className="mt-4 rounded-lg bg-[#101211] px-4 py-2 text-sm font-medium text-white"
          >
            다시 불러오기
          </button>
        </div>
      ) : aiStatus === 'PENDING' ||
        aiStatus ===
        'PROCESSING' ? (
        <ProcessingState
          aiStatus={aiStatus}
          onRefresh={() =>
            loadSummary()
          }
          isRefreshing={
            isRefreshing
          }
        />
      ) : aiStatus === 'FAILED' ? (
        <FailedState
          onRetry={handleRetry}
          isRetrying={isRetrying}
          errorMessage={error}
        />
      ) : (
        <div className="space-y-4">
          <SummarySection title="회의 요약">
            <p className="whitespace-pre-wrap text-sm leading-7 text-[#303633]">
              {summary.summary ||
                '작성된 요약이 없습니다.'}
            </p>
          </SummarySection>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <SummarySection title="결정 사항">
              {decisions.length ===
                0 ? (
                <p className="text-sm text-[#8A9490]">
                  정리된 결정 사항이
                  없습니다.
                </p>
              ) : (
                <ul className="space-y-3">
                  {decisions.map(
                    (
                      decision,
                      index,
                    ) => (
                      <li
                        key={`${decision}-${index}`}
                        className="flex gap-3 text-sm leading-6 text-[#303633]"
                      >
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#31F5A0]" />

                        <span>
                          {decision}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </SummarySection>

            <SummarySection title="주요 논의 이슈">
              {issues.length === 0 ? (
                <p className="text-sm text-[#8A9490]">
                  정리된 논의 이슈가
                  없습니다.
                </p>
              ) : (
                <ul className="space-y-3">
                  {issues.map(
                    (
                      issue,
                      index,
                    ) => (
                      <li
                        key={`${issue}-${index}`}
                        className="flex gap-3 text-sm leading-6 text-[#303633]"
                      >
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FBF83E]" />

                        <span>
                          {issue}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </SummarySection>
          </div>

          <SummarySection title="Action Items">
            {actionItems.length ===
              0 ? (
              <p className="text-sm text-[#8A9490]">
                등록된 Action Item이
                없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {actionItems.map(
                  (item) => (
                    <div
                      key={
                        item.actionItemId
                      }
                      className="rounded-xl border border-[#E8ECEA] bg-[#FAFBFA] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm font-medium leading-6 text-[#303633]">
                          {
                            item.content
                          }
                        </p>

                        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#7B8581]">
                          {
                            item.status
                          }
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8A9490]">
                        {item.assigneeName && (
                          <span>
                            담당자:{' '}
                            {
                              item.assigneeName
                            }
                          </span>
                        )}

                        {item.dueDate && (
                          <span>
                            기한:{' '}
                            {
                              item.dueDate
                            }
                          </span>
                        )}

                        {item.isUncertain && (
                          <span className="text-[#F64E42]">
                            AI 확인 필요
                          </span>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </SummarySection>

          <SummarySection title="회의 원문">
            {summary.rawTranscript ? (
              <details>
                <summary className="cursor-pointer text-sm font-medium text-[#303633]">
                  전체 원문 보기
                </summary>

                <p className="mt-4 whitespace-pre-wrap rounded-xl bg-[#F7F9F8] p-4 text-sm leading-7 text-[#59625F]">
                  {
                    summary.rawTranscript
                  }
                </p>
              </details>
            ) : (
              <p className="text-sm text-[#8A9490]">
                저장된 회의 원문이
                없습니다.
              </p>
            )}
          </SummarySection>
        </div>
      )}
    </div>
  );
}

export default MeetingSummaryPage;
