import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import AddUserIcon from '../../components/project/AddUserIcon';
import MeetingDateFilterCalendar from '../../components/project/MeetingDateFilterCalendar';
import MeetingRecordCard from '../../components/project/MeetingRecordCard';
import TeamCreateModal from '../../components/project/TeamCreateModal';
import TeamMemberInviteModal from '../../components/project/TeamMemberInviteModal';
import { getApiErrorMessage, getUserId } from '../../api/axios';
import { getMeetings } from '../../api/meetingApi';
import {
  deleteTeam,
  getMyTeams,
  getProjectMembers,
  getTeamMembers,
  inviteTeamMember,
  removeTeamMember,
  updateTeam,
  updateTeamMemberRole,
} from '../../api/teams';

import calendarIcon from '../../assets/icons/meeting-records/calendar.svg';
import aiIcon from '../../assets/icons/meeting-records/ai.svg';
import filterArrowIcon from '../../assets/icons/meeting-records/filter-arrow.svg';
import searchIcon from '../../assets/icons/search/search.svg';

const formatMeetingDate = (dateValue) => {
  if (!dateValue) return null;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const weekday = new Intl.DateTimeFormat('ko-KR', { weekday: 'short' })
    .format(date)
    .replace('요일', '');

  return {
    date: `${year}-${month}-${day}`,
    displayDate: `${year}. ${month}. ${day}`,
    displayTime: `${hours}:${minutes}`,
    titleDate: `${year}년 ${month}월 ${day}일 (${weekday})`,
  };
};

const formatMeetingRecord = (meeting, teamName) => {
  const meetingDate = formatMeetingDate(
    meeting.scheduledStartAt ?? meeting.startedAt ?? meeting.createdAt,
  );

  return {
    ...meeting,
    id: meeting.meetingId,
    date: meetingDate?.date ?? '',
    meetingDate: meetingDate?.titleDate ?? '-',
    title: meeting.title,
    createdDate: meetingDate?.displayDate ?? '-',
    createdTime: meetingDate?.displayTime ?? '-',
    teams: teamName ? [teamName] : [],
    summary: meeting.agenda || '등록된 회의 안건이 없습니다.',
  };
};

function TeamMeetingRecordsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, teamId } = useParams();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [sortType, setSortType] = useState('recent');
  const [isMemberInviteModalOpen, setIsMemberInviteModalOpen] = useState(false);
  const [projectMembers, setProjectMembers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [memberActionUserId, setMemberActionUserId] = useState(null);
  const [memberErrorMessage, setMemberErrorMessage] = useState('');
  const [inviteResultMessage, setInviteResultMessage] = useState('');
  const [currentTeam, setCurrentTeam] = useState(null);
  const [isTeamEditModalOpen, setIsTeamEditModalOpen] = useState(false);
  const [isTeamUpdating, setIsTeamUpdating] = useState(false);
  const [isTeamDeleting, setIsTeamDeleting] = useState(false);
  const [teamActionErrorMessage, setTeamActionErrorMessage] = useState('');
  const [serverMeetings, setServerMeetings] = useState([]);
  const [isMeetingsLoading, setIsMeetingsLoading] = useState(true);
  const [meetingErrorMessage, setMeetingErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    const loadCurrentTeam = async () => {
      try {
        const myTeams = await getMyTeams();
        const nextCurrentTeam = myTeams.find((team) => String(team.id) === String(teamId));

        if (isCurrentRequest) {
          setCurrentTeam(nextCurrentTeam ?? null);
        }
      } catch (error) {
        console.error('Failed to load current team:', error);
      }
    };

    loadCurrentTeam();

    return () => {
      isCurrentRequest = false;
    };
  }, [teamId]);

  useEffect(() => {
    let isCurrentRequest = true;

    const loadMeetings = async () => {
      try {
        setIsMeetingsLoading(true);
        setMeetingErrorMessage('');

        const nextMeetings = await getMeetings(teamId);

        if (isCurrentRequest) {
          setServerMeetings(nextMeetings);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setServerMeetings([]);
          setMeetingErrorMessage(getApiErrorMessage(error, '회의 목록을 불러오지 못했습니다.'));
        }
      } finally {
        if (isCurrentRequest) {
          setIsMeetingsLoading(false);
        }
      }
    };

    loadMeetings();

    return () => {
      isCurrentRequest = false;
    };
  }, [teamId]);

  const meetingRecords = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase();
    const teamName = currentTeam?.name ?? location.state?.teamName ?? '';

    return serverMeetings
      .map((meeting) => formatMeetingRecord(meeting, teamName))
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
  }, [
    currentTeam?.name,
    location.state?.teamName,
    searchKeyword,
    selectedDate,
    serverMeetings,
    sortType,
  ]);

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

  const handleChangeTeamMemberRole = async (targetUserId, role) => {
    try {
      setMemberActionUserId(targetUserId);
      setMemberErrorMessage('');
      setInviteResultMessage('');
      await updateTeamMemberRole(teamId, targetUserId, role);
      await loadMembers();
      setInviteResultMessage('팀 멤버 권한을 변경했습니다.');
    } catch (error) {
      setMemberErrorMessage(getApiErrorMessage(error, '팀 멤버 권한을 변경하지 못했습니다.'));
    } finally {
      setMemberActionUserId(null);
    }
  };

  const handleRemoveTeamMember = async (member) => {
    const shouldRemove = window.confirm(`${member.name}님을 팀에서 내보낼까요?`);

    if (!shouldRemove) return;

    try {
      setMemberActionUserId(member.userId);
      setMemberErrorMessage('');
      setInviteResultMessage('');
      await removeTeamMember(teamId, member.userId);
      await loadMembers();
      setInviteResultMessage(`${member.name}님을 팀에서 내보냈습니다.`);
    } catch (error) {
      setMemberErrorMessage(getApiErrorMessage(error, '팀 멤버를 내보내지 못했습니다.'));
    } finally {
      setMemberActionUserId(null);
    }
  };

  const handleLeaveTeam = async () => {
    const shouldLeave = window.confirm('이 팀에서 탈퇴할까요?');

    if (!shouldLeave) return;

    try {
      setIsTeamDeleting(true);
      setTeamActionErrorMessage('');
      await removeTeamMember(teamId, getUserId());
      navigate(`/projects/${projectId}`, { replace: true });
    } catch (error) {
      setTeamActionErrorMessage(getApiErrorMessage(error, '팀에서 탈퇴하지 못했습니다.'));
    } finally {
      setIsTeamDeleting(false);
    }
  };

  const handleUpdateTeam = async ({ name, description }) => {
    try {
      setIsTeamUpdating(true);
      setTeamActionErrorMessage('');

      await updateTeam(teamId, { name, description });
      setCurrentTeam((team) => ({
        ...team,
        name,
        description,
      }));
      setIsTeamEditModalOpen(false);
      navigate(location.pathname, {
        replace: true,
        state: {
          ...location.state,
          teamName: name,
        },
      });
    } catch (error) {
      setTeamActionErrorMessage(getApiErrorMessage(error, '팀 정보를 수정하지 못했습니다.'));
    } finally {
      setIsTeamUpdating(false);
    }
  };

  const handleDeleteTeam = async () => {
    const shouldDelete = window.confirm(
      '이 팀을 삭제할까요? 관련 초대장과 멤버 정보도 삭제됩니다.',
    );

    if (!shouldDelete) return;

    try {
      setIsTeamDeleting(true);
      setTeamActionErrorMessage('');
      await deleteTeam(teamId);
      navigate(`/projects/${projectId}`, { replace: true });
    } catch (error) {
      setTeamActionErrorMessage(getApiErrorMessage(error, '팀을 삭제하지 못했습니다.'));
    } finally {
      setIsTeamDeleting(false);
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1347px] flex-col">
      <nav className="flex h-[45px] shrink-0 items-start gap-1 pr-[7px] pl-5">
        <button
          type="button"
          className="border-b-[3px] border-[var(--color-primary)] px-4 py-2 text-[20px] leading-[1.3] font-semibold text-[var(--color-black)]"
        >
          회의록
        </button>
        <button
          type="button"
          className="px-4 py-2 text-[20px] leading-[1.3] font-medium text-[var(--color-gray-400)]"
        >
          채팅방
        </button>
      </nav>

      <main className="relative min-h-0 flex-1 overflow-hidden rounded-[10px] bg-white">
        <div className="ml-5 flex h-full w-[916px] flex-col pt-7">
          <header className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <h2 className="text-[20px] leading-[1.3] font-semibold text-black">AI 요약 회의록</h2>
              <img src={aiIcon} alt="" className="size-6" />
            </div>
            <p className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[var(--color-gray-700)]">
              AI가 화상 회의 내용을 기반으로 회의록을 만들었어요
            </p>
          </header>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="flex h-11 w-[600px] shrink-0 items-center rounded-[10px] border border-[var(--color-gray-200)] bg-white px-3">
                <input
                  type="search"
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="회의록 내용을 검색해보세요"
                  className="min-w-0 flex-1 bg-transparent text-[16px] leading-[1.4] tracking-[-0.16px] outline-none placeholder:text-[var(--color-gray-500)]"
                />
                <img src={searchIcon} alt="" className="size-6 shrink-0 opacity-45" />
              </label>
              <button
                type="button"
                className="flex h-11 w-[110px] items-center justify-center rounded-[10px] bg-[var(--color-primary)] text-[16px] leading-[1.3] font-semibold text-[var(--color-black)]"
              >
                검색하기
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSortType((type) => (type === 'team' ? 'recent' : 'team'))}
                className="flex items-center gap-2 bg-white px-2 py-[10px] text-[16px] leading-[1.3] font-medium text-[var(--color-gray-900)]"
              >
                참여 팀별
                <span className="flex size-6 shrink-0 items-center justify-center">
                  <img src={filterArrowIcon} alt="" className="size-6" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsCalendarOpen((isOpen) => !isOpen)}
                className={`flex size-11 shrink-0 items-center justify-center rounded-full ${
                  isCalendarOpen ? 'bg-white' : 'bg-[var(--color-gray-50)]'
                }`}
              >
                <img
                  src={calendarIcon}
                  alt=""
                  className={`size-6 ${isCalendarOpen ? 'brightness-50' : ''}`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:#d9d9d9_transparent] overflow-y-auto pb-[43px]">
            <div className="flex min-h-full flex-col">
              <div className="w-[904px] space-y-2">
                {isMeetingsLoading && (
                  <p className="body-4 py-10 text-center text-[var(--color-gray-500)]">
                    회의 목록을 불러오는 중입니다.
                  </p>
                )}
                {!isMeetingsLoading && meetingErrorMessage && (
                  <p className="body-4 py-10 text-center text-[var(--color-red)]">
                    {meetingErrorMessage}
                  </p>
                )}
                {!isMeetingsLoading && !meetingErrorMessage && meetingRecords.length === 0 && (
                  <p className="body-4 py-10 text-center text-[var(--color-gray-500)]">
                    표시할 회의가 없습니다.
                  </p>
                )}
                {!isMeetingsLoading &&
                  !meetingErrorMessage &&
                  meetingRecords.map((record) => (
                    <MeetingRecordCard
                      key={record.id}
                      meetingDate={record.meetingDate}
                      title={record.title}
                      teams={record.teams}
                      summary={record.summary}
                      onClick={() =>
                        navigate(`/projects/${projectId}/teams/${teamId}/meetings/${record.id}`, {
                          state: {
                            ...location.state,
                            meetingRecord: record,
                          },
                        })
                      }
                    />
                  ))}
              </div>

              {currentTeam?.myRole === 'LEADER' && (
                <div className="relative left-[195px] mt-auto flex flex-col items-center pt-10">
                  {teamActionErrorMessage && (
                    <p className="body-5 mb-3 text-[var(--color-red)]">{teamActionErrorMessage}</p>
                  )}
                  <div className="flex items-center gap-3 text-[12px] leading-[1.3] text-[var(--color-gray-500)]">
                    <button
                      type="button"
                      onClick={() => {
                        setTeamActionErrorMessage('');
                        setIsTeamEditModalOpen(true);
                      }}
                    >
                      수정하기
                    </button>
                    <span>·</span>
                    <button type="button" onClick={handleDeleteTeam} disabled={isTeamDeleting}>
                      {isTeamDeleting ? '삭제 중' : '삭제하기'}
                    </button>
                  </div>
                </div>
              )}
              {currentTeam && currentTeam.myRole !== 'LEADER' && (
                <div className="relative left-[195px] mt-auto flex flex-col items-center pt-10">
                  {teamActionErrorMessage && (
                    <p className="body-5 mb-3 text-[var(--color-red)]">{teamActionErrorMessage}</p>
                  )}
                  <button
                    type="button"
                    onClick={handleLeaveTeam}
                    disabled={isTeamDeleting}
                    className="text-[12px] leading-[1.3] text-[var(--color-gray-500)]"
                  >
                    {isTeamDeleting ? '탈퇴 중' : '팀 탈퇴하기'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isCalendarOpen && (
          <MeetingDateFilterCalendar
            selectedDate={selectedDate}
            meetingDates={serverMeetings
              .map((meeting) =>
                formatMeetingDate(
                  meeting.scheduledStartAt ?? meeting.startedAt ?? meeting.createdAt,
                ),
              )
              .map((meetingDate) => meetingDate?.date)
              .filter(Boolean)}
            onSelect={setSelectedDate}
            className="absolute top-[92px] right-5"
          />
        )}

        {currentTeam?.myRole === 'LEADER' && (
          <button
            type="button"
            onClick={() => {
              setMemberErrorMessage('');
              setInviteResultMessage('');
              setIsMemberInviteModalOpen(true);
            }}
            className="absolute right-5 bottom-5 flex size-11 items-center justify-center rounded-full bg-[var(--color-black)] p-[10px]"
          >
            <AddUserIcon variant="white" />
          </button>
        )}

        <TeamMemberInviteModal
          isOpen={isMemberInviteModalOpen}
          projectName={location.state?.projectName ?? '프로젝트'}
          teamName={currentTeam?.name ?? location.state?.teamName ?? '팀'}
          projectMembers={projectMembers}
          teamMembers={teamMembers}
          currentUserId={getUserId()}
          isLoading={isMembersLoading}
          isSubmitting={isInviting}
          memberActionUserId={memberActionUserId}
          errorMessage={memberErrorMessage}
          resultMessage={inviteResultMessage}
          onClose={() => {
            setIsMemberInviteModalOpen(false);
            setMemberErrorMessage('');
            setInviteResultMessage('');
          }}
          onInvite={handleInviteMembers}
          onRoleChange={handleChangeTeamMemberRole}
          onRemoveMember={handleRemoveTeamMember}
        />

        <TeamCreateModal
          isOpen={isTeamEditModalOpen}
          mode="edit"
          initialTeam={currentTeam}
          isSubmitting={isTeamUpdating}
          errorMessage={teamActionErrorMessage}
          onClose={() => {
            setIsTeamEditModalOpen(false);
            setTeamActionErrorMessage('');
          }}
          onSubmit={handleUpdateTeam}
        />
      </main>
    </div>
  );
}

export default TeamMeetingRecordsPage;
