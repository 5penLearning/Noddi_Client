import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import MeetingAiResult from '../../components/project/MeetingAiResult';
import MeetingAudioPlayer from '../../components/project/MeetingAudioPlayer';
import MeetingDetailHeader from '../../components/project/MeetingDetailHeader';
import MeetingParticipants from '../../components/project/MeetingParticipants';
import MeetingTranscriptPanel from '../../components/project/MeetingTranscriptPanel';
import { getApiErrorMessage } from '../../api/axios';
import { getMeeting, getMeetingParticipants, getMeetingRecordingUrl } from '../../api/meetingApi';
import { getMeetingSummary, updateMeetingSummary } from '../../api/summaryApi';

const formatMeetingDate = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return '-';

  const dateText = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(date);
  const timeText = new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return `${dateText} ${timeText}`;
};

const formatDuration = (startValue, endValue) => {
  const startDate = new Date(startValue);
  const endDate = new Date(endValue);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return '-';

  const totalSeconds = Math.max(0, Math.floor((endDate.getTime() - startDate.getTime()) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours ? `${hours}시간 ` : ''}${minutes}분 ${seconds}초`;
};

const getRecordingUrlFromResponse = (response) => {
  const result = response?.result ?? response;
  const url = result?.recordingUrl ?? result?.url ?? result;

  return typeof url === 'string' ? url : '';
};

function TeamMeetingRecordDetailPage() {
  const location = useLocation();
  const { meetingId } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [recordingErrorMessage, setRecordingErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editErrorMessage, setEditErrorMessage] = useState('');
  const [editForm, setEditForm] = useState({ summary: '', decisions: [], issues: [] });

  useEffect(() => {
    let isCurrentRequest = true;

    const loadMeetingDetail = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const [meetingResult, participantResult, summaryResult, recordingResult] =
          await Promise.allSettled([
            getMeeting(meetingId),
            getMeetingParticipants(meetingId),
            getMeetingSummary(meetingId),
            getMeetingRecordingUrl(meetingId),
          ]);

        if (!isCurrentRequest) return;

        if (meetingResult.status === 'rejected') {
          throw meetingResult.reason;
        }

        setMeeting(meetingResult.value.result ?? meetingResult.value);
        setParticipants(
          participantResult.status === 'fulfilled'
            ? (participantResult.value.result ?? participantResult.value ?? [])
            : [],
        );
        setSummaryData(
          summaryResult.status === 'fulfilled'
            ? (summaryResult.value.result ?? summaryResult.value ?? null)
            : null,
        );
        setRecordingUrl(
          recordingResult.status === 'fulfilled'
            ? getRecordingUrlFromResponse(recordingResult.value)
            : '',
        );
      } catch (error) {
        if (isCurrentRequest) {
          setErrorMessage(getApiErrorMessage(error, '회의록을 불러오지 못했습니다.'));
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadMeetingDetail();

    return () => {
      isCurrentRequest = false;
    };
  }, [meetingId]);

  const displayMeeting = meeting ?? location.state?.meetingRecord ?? null;
  const startAt =
    displayMeeting?.startedAt ?? displayMeeting?.scheduledStartAt ?? displayMeeting?.createdAt;
  const endAt = displayMeeting?.endedAt ?? displayMeeting?.scheduledEndAt;
  const teamName = location.state?.teamName ?? displayMeeting?.teamName ?? '팀';
  const summary = useMemo(
    () => ({
      ...summaryData,
      summary: summaryData?.summary ?? displayMeeting?.agenda ?? '',
      keywords: summaryData?.keywords ?? summaryData?.issues ?? [],
    }),
    [displayMeeting?.agenda, summaryData],
  );

  const requestRecording = async () => {
    try {
      setRecordingErrorMessage('');
      const response = await getMeetingRecordingUrl(meetingId);
      const nextRecordingUrl = getRecordingUrlFromResponse(response);

      if (!nextRecordingUrl) {
        throw new Error('녹음 파일 URL이 없습니다.');
      }

      setRecordingUrl(nextRecordingUrl);
      return nextRecordingUrl;
    } catch (error) {
      setRecordingErrorMessage(getApiErrorMessage(error, '녹음 파일을 불러오지 못했습니다.'));
      return '';
    }
  };

  const handleStartEdit = () => {
    setEditErrorMessage('');
    setEditForm({
      summary: summary.summary ?? '',
      decisions: [...(summary.decisions ?? [])],
      issues: [...(summary.keywords ?? [])],
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    const nextSummary = editForm.summary.trim();
    const nextDecisions = editForm.decisions.map((item) => item.trim()).filter(Boolean);
    const nextIssues = editForm.issues.map((item) => item.trim()).filter(Boolean);

    if (!nextSummary) {
      setEditErrorMessage('회의 요약을 입력해주세요.');
      return;
    }

    try {
      setIsSaving(true);
      setEditErrorMessage('');
      await updateMeetingSummary(meetingId, {
        summary: nextSummary,
        decisions: nextDecisions,
        issues: nextIssues,
      });
      setSummaryData((currentSummary) => ({
        ...currentSummary,
        summary: nextSummary,
        decisions: nextDecisions,
        issues: nextIssues,
      }));
      setIsEditing(false);
    } catch (error) {
      setEditErrorMessage(getApiErrorMessage(error, '회의록을 수정하지 못했습니다.'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="mx-auto flex h-full w-full max-w-[1388px] flex-col overflow-hidden rounded-[10px] bg-white">
      {isLoading && (
        <p className="p-8 text-[16px] text-[var(--color-gray-500)]">회의록을 불러오는 중입니다.</p>
      )}
      {!isLoading && errorMessage && (
        <p className="p-8 text-[16px] text-[var(--color-red)]">{errorMessage}</p>
      )}
      {!isLoading && !errorMessage && displayMeeting && (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <MeetingDetailHeader
            title={displayMeeting.title ?? '회의록 상세'}
            dateLabel={formatMeetingDate(startAt)}
            durationLabel={formatDuration(startAt, endAt)}
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={handleStartEdit}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
          <MeetingParticipants participants={participants} teamName={teamName} />

          <div className="mt-6 grid grid-cols-[310px_minmax(0,1fr)] items-start gap-6 px-[29px] pb-8">
            <aside className="min-w-0">
              <section>
                <h2 className="text-[16px] leading-[1.3] font-semibold text-[var(--color-gray-900)]">
                  주요 이슈
                </h2>
                <div className="mt-4 flex flex-wrap gap-1">
                  {isEditing ? (
                    <div className="w-full space-y-2">
                      {editForm.issues.map((issue, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            value={issue}
                            onChange={(event) =>
                              setEditForm((currentForm) => ({
                                ...currentForm,
                                issues: currentForm.issues.map((item, itemIndex) =>
                                  itemIndex === index ? event.target.value : item,
                                ),
                              }))
                            }
                            placeholder="주요 이슈를 입력해주세요."
                            className="h-10 min-w-0 flex-1 rounded-[8px] border border-[var(--color-gray-300)] bg-[var(--color-gray-50)] px-3 text-[14px] outline-none focus:border-[var(--color-primary)] focus:bg-white"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setEditForm((currentForm) => ({
                                ...currentForm,
                                issues: currentForm.issues.filter(
                                  (_, itemIndex) => itemIndex !== index,
                                ),
                              }))
                            }
                            className="size-8 shrink-0 text-[18px] text-[var(--color-gray-500)]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setEditForm((currentForm) => ({
                            ...currentForm,
                            issues: [...currentForm.issues, ''],
                          }))
                        }
                        className="text-[13px] text-[var(--color-gray-600)]"
                      >
                        + 항목 추가
                      </button>
                    </div>
                  ) : (summary.keywords ?? []).length > 0 ? (
                    summary.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-[10px] bg-[#e8fff5] px-[10px] py-[5px] text-[14px] leading-[1.3] tracking-[-0.28px] text-[var(--color-primary-700,#11e489)]"
                      >
                        {keyword}
                      </span>
                    ))
                  ) : (
                    <p className="text-[14px] text-[var(--color-gray-500)]">
                      등록된 주요 이슈가 없습니다.
                    </p>
                  )}
                </div>
              </section>

              <div className="mt-8">
                <MeetingTranscriptPanel transcript={summary.rawTranscript ?? ''} />
              </div>
            </aside>

            <MeetingAiResult
              summaryData={summary}
              meetingId={meetingId}
              participants={participants}
              isEditing={isEditing}
              editForm={editForm}
              onSummaryChange={(value) =>
                setEditForm((currentForm) => ({ ...currentForm, summary: value }))
              }
              onDecisionChange={(index, value) =>
                setEditForm((currentForm) => ({
                  ...currentForm,
                  decisions: currentForm.decisions.map((item, itemIndex) =>
                    itemIndex === index ? value : item,
                  ),
                }))
              }
              onAddDecision={() =>
                setEditForm((currentForm) => ({
                  ...currentForm,
                  decisions: [...currentForm.decisions, ''],
                }))
              }
              onRemoveDecision={(index) =>
                setEditForm((currentForm) => ({
                  ...currentForm,
                  decisions: currentForm.decisions.filter((_, itemIndex) => itemIndex !== index),
                }))
              }
            />
          </div>
        </div>
      )}

      {recordingErrorMessage && (
        <p className="px-8 py-2 text-[12px] text-[var(--color-red)]">{recordingErrorMessage}</p>
      )}
      {editErrorMessage && (
        <p className="px-8 py-2 text-[12px] text-[var(--color-red)]">{editErrorMessage}</p>
      )}
      <MeetingAudioPlayer recordingUrl={recordingUrl} onRequestRecording={requestRecording} />
    </main>
  );
}

export default TeamMeetingRecordDetailPage;
