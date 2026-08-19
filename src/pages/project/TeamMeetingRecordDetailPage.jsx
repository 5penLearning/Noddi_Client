import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import MeetingAudioPlayer from '../../components/project/MeetingAudioPlayer';
import MeetingDetailHeader from '../../components/project/MeetingDetailHeader';
import MeetingParticipants from '../../components/project/MeetingParticipants';
import MeetingRecordDetailContent from '../../components/project/meetingRecords/MeetingRecordDetailContent';
import {
  formatMeetingDateTime,
  formatMeetingDuration,
  getRecordingUrlFromResponse,
} from '../../components/project/meetingRecords/meetingRecordUtils';
import { getApiErrorMessage } from '../../api/axios';
import { getMeeting, getMeetingParticipants, getMeetingRecordingUrl } from '../../api/meetingApi';
import { getMeetingSummary, updateMeetingSummary } from '../../api/summaryApi';

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
    <main className="green-border-theme mx-auto flex h-full w-full max-w-[1388px] flex-col overflow-hidden rounded-[10px] bg-white">
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
            dateLabel={formatMeetingDateTime(startAt)}
            durationLabel={formatMeetingDuration(startAt, endAt)}
            isEditing={isEditing}
            isSaving={isSaving}
            onEdit={handleStartEdit}
            onCancel={() => setIsEditing(false)}
            onSave={handleSave}
          />
          <MeetingParticipants participants={participants} teamName={teamName} />

          <MeetingRecordDetailContent
            summary={summary}
            meetingId={meetingId}
            participants={participants}
            isEditing={isEditing}
            editForm={editForm}
            setEditForm={setEditForm}
          />
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
