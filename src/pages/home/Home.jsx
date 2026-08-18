import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../../api/axios';
import { getUnreadAnswerCards, getUnreadAnswerCountsByProject } from '../../api/homeApi';
import { getMeetings } from '../../api/meetingApi';
import { getMyTeams } from '../../api/teams';
import logo from '../../assets/logo-green.svg';
import { homePageMockData } from '../../mocks/homePageData';
import AiReplyStatus from '../../components/home/AiReplyStatus';
import {
  formatDateKey,
  formatMeetingScheduleItem,
  normalizeUnreadAnswerCards,
} from '../../components/home/homeUtils';
import MeetingSchedule from '../../components/home/MeetingSchedule';
import TodoList from '../../components/home/TodoList';

function Home() {
  const navigate = useNavigate();
  const { hero, todoList } = homePageMockData;
  const [projects, setProjects] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [isMeetingsLoading, setIsMeetingsLoading] = useState(true);
  const [meetingErrorMessage, setMeetingErrorMessage] = useState('');
  const [aiReplies, setAiReplies] = useState([]);
  const [isAiRepliesLoading, setIsAiRepliesLoading] = useState(true);
  const [aiRepliesErrorMessage, setAiRepliesErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    const loadHomeData = async () => {
      try {
        setIsMeetingsLoading(true);
        setIsAiRepliesLoading(true);
        setMeetingErrorMessage('');
        setAiRepliesErrorMessage('');

        const [answerProjects, myTeams] = await Promise.all([
          getUnreadAnswerCountsByProject(),
          getMyTeams(),
        ]);

        const [meetingResults, answerCardResults] = await Promise.all([
          Promise.allSettled(myTeams.map((team) => getMeetings(team.teamId))),
          Promise.allSettled(
            answerProjects.map((project) => getUnreadAnswerCards(project.projectId)),
          ),
        ]);

        const nextMeetings = meetingResults
          .flatMap((result, index) => {
            if (result.status !== 'fulfilled') return [];

            return result.value
              .map((meeting) => formatMeetingScheduleItem(meeting, myTeams[index]))
              .filter(Boolean);
          })
          .sort((firstMeeting, secondMeeting) =>
            `${firstMeeting.date}T${firstMeeting.time}`.localeCompare(
              `${secondMeeting.date}T${secondMeeting.time}`,
            ),
          );

        const nextAiReplies = answerCardResults
          .flatMap((result) =>
            result.status === 'fulfilled' ? normalizeUnreadAnswerCards(result.value) : [],
          )
          .sort(
            (firstReply, secondReply) =>
              new Date(secondReply.answeredAt).getTime() -
              new Date(firstReply.answeredAt).getTime(),
          );

        if (!isCurrentRequest) return;

        setProjects(answerProjects);
        setMeetings(nextMeetings);
        setAiReplies(nextAiReplies);

        if (
          answerCardResults.length > 0 &&
          answerCardResults.every((result) => result.status === 'rejected')
        ) {
          setAiRepliesErrorMessage('AI 답변을 불러오지 못했습니다.');
        }
      } catch (error) {
        console.error('Failed to load home data:', error);

        if (isCurrentRequest) {
          setProjects([]);
          setMeetings([]);
          setAiReplies([]);
          setMeetingErrorMessage(getApiErrorMessage(error, '회의 일정을 불러오지 못했습니다.'));
          setAiRepliesErrorMessage(getApiErrorMessage(error, 'AI 답변을 불러오지 못했습니다.'));
        }
      } finally {
        if (isCurrentRequest) {
          setIsMeetingsLoading(false);
          setIsAiRepliesLoading(false);
        }
      }
    };

    loadHomeData();

    return () => {
      isCurrentRequest = false;
    };
  }, []);

  const today = new Date();
  const initialMeetingDate = formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const handleJoinMeeting = (meeting) => {
    navigate(`/meetings/${meeting.meetingId}/room`, {
      state: {
        meeting: meeting.rawMeeting,
      },
    });
  };

  const handleOpenMeetingRecord = (actionItem, meeting) => {
    if (!actionItem.meetingId) return;

    navigate(`/meetings/${actionItem.meetingId}/record`, {
      state: { teamName: meeting?.teams[0] ?? actionItem.teamName },
    });
  };

  const handleOpenQaDetail = (reply) => {
    navigate('/qa', { state: { questionId: reply.questionId, teamId: reply.teamId } });
  };

  const handleOpenReference = (reply) => {
    if (!reply.referenceId) return;

    const meetingId = reply.referenceNavigation?.meetingId ?? reply.referenceId;
    const teamId = reply.referenceNavigation?.teamId ?? reply.teamId;

    navigate(`/projects/${reply.projectId}/teams/${teamId}/meetings/${meetingId}`, {
      state: { teamName: reply.teamName },
    });
  };

  return (
    <div className="h-full overflow-auto">
      <div className="mx-auto flex min-h-full w-full max-w-[1346px] flex-col gap-5">
        <section className="h-[183px] shrink-0 rounded-[10px] bg-[linear-gradient(180deg,#2affa3_0%,#37efd9_100%)] px-6 py-5 text-[var(--color-black)]">
          <img src={logo} alt="Noddi" className="h-auto w-[190px] brightness-0" />
          <p className="subhead-3 mt-2">{hero.tagline}</p>
        </section>

        <div className="grid min-h-[400px] flex-1 grid-cols-[minmax(0,818px)_minmax(370px,1fr)] gap-4">
          <div className="grid grid-rows-[auto_1fr] gap-3">
            <MeetingSchedule
              initialDate={initialMeetingDate}
              meetings={meetings}
              isLoading={isMeetingsLoading}
              errorMessage={meetingErrorMessage}
              onJoin={handleJoinMeeting}
            />
            <TodoList
              {...todoList}
              meetings={meetings}
              onOpenMeetingRecord={handleOpenMeetingRecord}
            />
          </div>

          <AiReplyStatus
            replies={aiReplies}
            projects={projects}
            isLoading={isAiRepliesLoading}
            errorMessage={aiRepliesErrorMessage}
            onDetail={handleOpenQaDetail}
            onReference={handleOpenReference}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
