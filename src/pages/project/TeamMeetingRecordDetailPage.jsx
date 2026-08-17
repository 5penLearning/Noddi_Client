import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import MeetingAiResult from '../../components/project/MeetingAiResult';
import MeetingAudioPlayer from '../../components/project/MeetingAudioPlayer';
import MeetingDetailHeader from '../../components/project/MeetingDetailHeader';
import MeetingParticipants from '../../components/project/MeetingParticipants';
import MeetingTranscriptPanel from '../../components/project/MeetingTranscriptPanel';
import { getApiErrorMessage } from '../../api/axios';
import { getMeeting, getMeetingParticipants, getMeetingRecordingUrl } from '../../api/meetingApi';
import { getMeetingSummary } from '../../api/summaryApi';

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

  useEffect(() => {
    let isCurrentRequest = true;

    const loadMeetingDetail = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const [meetingResult, participantResult, summaryResult] = await Promise.allSettled([
          getMeeting(meetingId),
          getMeetingParticipants(meetingId),
          getMeetingSummary(meetingId),
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
    }),
    [displayMeeting?.agenda, summaryData],
  );

  const requestRecording = async () => {
    try {
      setRecordingErrorMessage('');
      const response = await getMeetingRecordingUrl(meetingId);
      const result = response.result ?? response;
      const nextRecordingUrl = result.recordingUrl ?? result.url ?? result;

      if (typeof nextRecordingUrl !== 'string' || !nextRecordingUrl) {
        throw new Error('녹음 파일 URL이 없습니다.');
      }

      setRecordingUrl(nextRecordingUrl);
    } catch (error) {
      setRecordingErrorMessage(getApiErrorMessage(error, '녹음 파일을 불러오지 못했습니다.'));
    }
  };

  const handleDownloadRecording = async () => {
    try {
      setRecordingErrorMessage('');
      const response = await getMeetingRecordingUrl(meetingId);
      const result = response.result ?? response;
      const nextRecordingUrl = result.recordingUrl ?? result.url ?? result;

      if (typeof nextRecordingUrl !== 'string' || !nextRecordingUrl) {
        throw new Error('녹음 파일 URL이 없습니다.');
      }

      const downloadLink = document.createElement('a');
      downloadLink.href = nextRecordingUrl;
      downloadLink.target = '_blank';
      downloadLink.rel = 'noopener noreferrer';
      downloadLink.click();
    } catch (error) {
      setRecordingErrorMessage(getApiErrorMessage(error, '녹음 파일을 내려받지 못했습니다.'));
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
            onDownload={handleDownloadRecording}
          />
          <MeetingParticipants participants={participants} teamName={teamName} />

          <div className="mt-6 flex items-start gap-6 px-[29px] pb-8">
            <MeetingTranscriptPanel
              transcript={summary.rawTranscript ?? ''}
              participants={participants}
            />
            <MeetingAiResult summaryData={summary} />
          </div>
        </div>
      )}

      {recordingErrorMessage && (
        <p className="px-8 py-2 text-[12px] text-[var(--color-red)]">{recordingErrorMessage}</p>
      )}
      <MeetingAudioPlayer recordingUrl={recordingUrl} onRequestRecording={requestRecording} />
    </main>
  );
}

export default TeamMeetingRecordDetailPage;
