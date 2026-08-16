import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import OutlineButton from '../../components/common/OutlineButton';
import MeetingRecordCard from '../../components/project/MeetingRecordCard';
import TeamMemberInviteModal from '../../components/project/TeamMemberInviteModal';
import { getApiErrorMessage } from '../../api/axios';
import { getProjectMembers, getTeamMembers, inviteTeamMember } from '../../api/teams';
import { meetingRecordMockData } from '../../mocks/projectPageData';

import calendarIcon from '../../assets/icons/meeting-records/calendar.svg';
import searchIcon from '../../assets/icons/search/search.svg';

function TeamMeetingRecordsPage() {
  const location = useLocation();
  const { projectId, teamId } = useParams();
  const dateInputRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [sortType, setSortType] = useState('recent');
  const [isMemberInviteModalOpen, setIsMemberInviteModalOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [memberErrorMessage, setMemberErrorMessage] = useState('');
  const [inviteResultMessage, setInviteResultMessage] = useState('');

  const meetingRecords = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();

    return meetingRecordMockData
      .filter((record) => {
        const matchesKeyword =
          !normalizedKeyword ||
          record.title.toLowerCase().includes(normalizedKeyword) ||
          record.summary.toLowerCase().includes(normalizedKeyword) ||
          record.teams.some((team) => team.toLowerCase().includes(normalizedKeyword));
        const matchesDate = !selectedDate || record.date === selectedDate;

        return matchesKeyword && matchesDate;
      })
      .sort((firstRecord, secondRecord) => {
        if (sortType === 'team') {
          return firstRecord.teams[0].localeCompare(secondRecord.teams[0], 'ko');
        }

        return secondRecord.date.localeCompare(firstRecord.date);
      });
  }, [searchKeyword, selectedDate, sortType]);

  const openDatePicker = () => {
    if (dateInputRef.current?.showPicker) {
      dateInputRef.current.showPicker();
      return;
    }

    dateInputRef.current?.click();
  };

  const loadMembers = useCallback(async () => {
    try {
      setIsMembersLoading(true);
      setMemberErrorMessage('');

      const [nextProjectMembers, nextTeamMembers] = await Promise.all([
        getProjectMembers(projectId),
        getTeamMembers(teamId),
      ]);

      setProjectMembers(nextProjectMembers);
      setTeamMembers(nextTeamMembers);
    } catch (error) {
      setMemberErrorMessage(getApiErrorMessage(error, '멤버 목록을 불러오지 못했습니다.'));
    } finally {
      setIsMembersLoading(false);
    }
  }, [projectId, teamId]);

  useEffect(() => {
    if (!isMemberInviteModalOpen) return;

    loadMembers();
  }, [isMemberInviteModalOpen, loadMembers]);

  const handleInviteMembers = async (targetUserIds) => {
    try {
      setIsInviting(true);
      setMemberErrorMessage('');
      setInviteResultMessage('');

      const inviteResults = await Promise.allSettled(
        targetUserIds.map((targetUserId) => inviteTeamMember(teamId, targetUserId)),
      );
      const successCount = inviteResults.filter((result) => result.status === 'fulfilled').length;
      const failureCount = inviteResults.length - successCount;

      if (successCount > 0) {
        await loadMembers();
      }

      setInviteResultMessage(
        failureCount > 0
          ? `${successCount}명에게 초대장을 보냈고 ${failureCount}명은 전송하지 못했습니다.`
          : `${successCount}명에게 초대장을 보냈습니다.`,
      );

      return failureCount === 0;
    } catch (error) {
      setMemberErrorMessage(getApiErrorMessage(error, '팀 초대장을 보내지 못했습니다.'));

      return false;
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <main className="mx-auto h-full w-full max-w-[1347px] overflow-hidden rounded-[10px] bg-white">
      <div className="flex h-[70px] items-center border-b border-[var(--color-gray-100)] px-[37px]">
        <h1 className="subhead-1 text-[var(--color-black)]">
          {location.state?.teamName ?? '팀 회의록'}
        </h1>
        <OutlineButton
          onClick={() => {
            setMemberErrorMessage('');
            setInviteResultMessage('');
            setIsMemberInviteModalOpen(true);
          }}
          className="ml-auto h-11 w-[114px] !px-0 !py-0"
        >
          멤버 추가하기
        </OutlineButton>
      </div>

      <div className="flex items-center gap-[17px] px-[37px] pt-[27px]">
        <label className="flex h-[44px] w-[959px] shrink-0 items-center rounded-[10px] border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-[14px]">
          <input
            type="search"
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            className="min-w-0 flex-1 bg-transparent outline-none"
          />
          <img src={searchIcon} alt="" className="h-[20.46px] w-5 shrink-0" />
        </label>

        <button
          type="button"
          onClick={openDatePicker}
          className="flex size-[44px] shrink-0 items-center justify-center bg-[var(--color-gray-50)]"
        >
          <img src={calendarIcon} alt="" className="size-6" />
        </button>
        <input
          ref={dateInputRef}
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
      </div>

      <div className="mt-[14px] flex items-center gap-[14px] px-[42px]">
        <button
          type="button"
          onClick={() => setSortType('recent')}
          className={`subhead-3 ${
            sortType === 'recent' ? 'text-[var(--color-black)]' : 'text-[var(--color-gray-500)]'
          }`}
        >
          최근 회의 순
        </button>
        <button
          type="button"
          onClick={() => setSortType('team')}
          className={`subhead-3 ${
            sortType === 'team' ? 'text-[var(--color-black)]' : 'text-[var(--color-gray-500)]'
          }`}
        >
          협업 회의 별
        </button>
      </div>

      <div className="mt-[40px] h-[calc(100%_-_221px)] [scrollbar-width:thin] [scrollbar-color:#d9d9d9_transparent] overflow-y-auto pb-[43px]">
        <div className="ml-[37px] w-[959px] space-y-[12px]">
          {meetingRecords.map((record) => (
            <MeetingRecordCard
              key={record.id}
              title={record.title}
              createdDate={record.createdDate}
              createdTime={record.createdTime}
              teams={record.teams}
              summary={record.summary}
            />
          ))}
        </div>
      </div>

      <TeamMemberInviteModal
        isOpen={isMemberInviteModalOpen}
        projectMembers={projectMembers}
        teamMembers={teamMembers}
        isLoading={isMembersLoading}
        isSubmitting={isInviting}
        errorMessage={memberErrorMessage}
        resultMessage={inviteResultMessage}
        onClose={() => {
          setIsMemberInviteModalOpen(false);
          setMemberErrorMessage('');
          setInviteResultMessage('');
        }}
        onInvite={handleInviteMembers}
      />
    </main>
  );
}

export default TeamMeetingRecordsPage;
