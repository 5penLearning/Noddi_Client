import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import MeetingRecordsTab from '../../components/project/meetingRecords/MeetingRecordsTab';
import MeetingRecordsTabs from '../../components/project/meetingRecords/MeetingRecordsTabs';
import SharedPagesTab from '../../components/project/meetingRecords/SharedPagesTab';
import {
  formatMeetingDate,
  formatMeetingRecord,
} from '../../components/project/meetingRecords/meetingRecordUtils';

import { getApiErrorMessage, getUserId } from '../../api/axios';
import { getMeetings } from '../../api/meetingApi';
import { createTeamPage, getTeamPage, getTeamPages, updateTeamPage } from '../../api/teamPages';
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

function TeamMeetingRecordsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, teamId } = useParams();
  const [activeTab, setActiveTab] = useState('records');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [memoSearchKeyword, setMemoSearchKeyword] = useState('');
  const [sharedMemos, setSharedMemos] = useState([]);
  const [selectedMemoId, setSelectedMemoId] = useState(null);
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [isSharedMemosLoading, setIsSharedMemosLoading] = useState(false);
  const [isSharedMemoDetailLoading, setIsSharedMemoDetailLoading] = useState(false);
  const [isSharedMemoCreating, setIsSharedMemoCreating] = useState(false);
  const [isSharedMemoUpdating, setIsSharedMemoUpdating] = useState(false);
  const [sharedMemosErrorMessage, setSharedMemosErrorMessage] = useState('');
  const [sharedMemoDetailErrorMessage, setSharedMemoDetailErrorMessage] = useState('');
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
    if (activeTab !== 'memos' || !teamId) return;

    let isCurrentRequest = true;

    const loadSharedMemos = async () => {
      try {
        setIsSharedMemosLoading(true);
        setSharedMemosErrorMessage('');

        const pageResult = await getTeamPages(teamId, {
          page: 0,
          size: 20,
          sort: 'updatedAt,desc',
        });
        const nextMemos = pageResult.content ?? [];

        if (!isCurrentRequest) return;

        setSharedMemos(nextMemos);
        setSelectedMemoId((currentMemoId) => {
          const hasCurrentMemo = nextMemos.some((memo) => memo.pageId === currentMemoId);

          return hasCurrentMemo ? currentMemoId : (nextMemos[0]?.pageId ?? null);
        });
      } catch (error) {
        if (isCurrentRequest) {
          setSharedMemos([]);
          setSelectedMemoId(null);
          setSharedMemosErrorMessage(
            getApiErrorMessage(error, '공유 메모 목록을 불러오지 못했습니다.'),
          );
        }
      } finally {
        if (isCurrentRequest) {
          setIsSharedMemosLoading(false);
        }
      }
    };

    loadSharedMemos();

    return () => {
      isCurrentRequest = false;
    };
  }, [activeTab, teamId]);

  useEffect(() => {
    if (activeTab !== 'memos' || !teamId || !selectedMemoId) {
      setSelectedMemo(null);
      return;
    }

    let isCurrentRequest = true;

    const loadSharedMemoDetail = async () => {
      try {
        setIsSharedMemoDetailLoading(true);
        setSharedMemoDetailErrorMessage('');

        const nextMemo = await getTeamPage(teamId, selectedMemoId);

        if (isCurrentRequest) {
          setSelectedMemo(nextMemo);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setSelectedMemo(null);
          setSharedMemoDetailErrorMessage(
            getApiErrorMessage(error, '공유 메모를 불러오지 못했습니다.'),
          );
        }
      } finally {
        if (isCurrentRequest) {
          setIsSharedMemoDetailLoading(false);
        }
      }
    };

    loadSharedMemoDetail();

    return () => {
      isCurrentRequest = false;
    };
  }, [activeTab, selectedMemoId, teamId]);

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

  const handleCreateSharedMemo = async () => {
    try {
      setIsSharedMemoCreating(true);
      setSharedMemosErrorMessage('');

      const createdPage = await createTeamPage(teamId, {
        title: '새 공유 메모',
        content: '공유할 내용을 입력해주세요.',
      });
      const createdPageId = createdPage.pageId;
      const pageResult = await getTeamPages(teamId, {
        page: 0,
        size: 20,
        sort: 'updatedAt,desc',
      });

      setSharedMemos(pageResult.content ?? []);
      setSelectedMemoId(createdPageId ?? pageResult.content?.[0]?.pageId ?? null);
    } catch (error) {
      setSharedMemosErrorMessage(getApiErrorMessage(error, '공유 메모를 생성하지 못했습니다.'));
    } finally {
      setIsSharedMemoCreating(false);
    }
  };

  const handleUpdateSharedMemo = async ({ title, content }) => {
    if (!selectedMemoId) return false;

    try {
      setIsSharedMemoUpdating(true);
      setSharedMemoDetailErrorMessage('');

      await updateTeamPage(teamId, selectedMemoId, { title, content });

      const [nextMemo, pageResult] = await Promise.all([
        getTeamPage(teamId, selectedMemoId),
        getTeamPages(teamId, {
          page: 0,
          size: 20,
          sort: 'updatedAt,desc',
        }),
      ]);

      setSelectedMemo(nextMemo);
      setSharedMemos(pageResult.content ?? []);

      return true;
    } catch (error) {
      setSharedMemoDetailErrorMessage(
        getApiErrorMessage(error, '공유 페이지를 수정하지 못했습니다.'),
      );

      return false;
    } finally {
      setIsSharedMemoUpdating(false);
    }
  };

  const meetingDates = serverMeetings
    .map((meeting) =>
      formatMeetingDate(meeting.scheduledStartAt ?? meeting.startedAt ?? meeting.createdAt),
    )
    .map((meetingDate) => meetingDate?.date)
    .filter(Boolean);

  const memberInviteProps = {
    isOpen: isMemberInviteModalOpen,
    projectName: location.state?.projectName ?? '프로젝트',
    teamName: currentTeam?.name ?? location.state?.teamName ?? '팀',
    projectMembers,
    teamMembers,
    currentUserId: getUserId(),
    isLoading: isMembersLoading,
    isSubmitting: isInviting,
    memberActionUserId,
    errorMessage: memberErrorMessage,
    resultMessage: inviteResultMessage,
    onClose: () => {
      setIsMemberInviteModalOpen(false);
      setMemberErrorMessage('');
      setInviteResultMessage('');
    },
    onInvite: handleInviteMembers,
    onRoleChange: handleChangeTeamMemberRole,
    onRemoveMember: handleRemoveTeamMember,
  };

  const teamEditProps = {
    isOpen: isTeamEditModalOpen,
    mode: 'edit',
    initialTeam: currentTeam,
    isSubmitting: isTeamUpdating,
    errorMessage: teamActionErrorMessage,
    onClose: () => {
      setIsTeamEditModalOpen(false);
      setTeamActionErrorMessage('');
    },
    onSubmit: handleUpdateTeam,
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1347px] flex-col">
      <MeetingRecordsTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'records' ? (
        <MeetingRecordsTab
          searchKeyword={searchKeyword}
          meetingRecords={meetingRecords}
          meetingDates={meetingDates}
          selectedDate={selectedDate}
          isCalendarOpen={isCalendarOpen}
          isLoading={isMeetingsLoading}
          errorMessage={meetingErrorMessage}
          currentTeam={currentTeam}
          isTeamDeleting={isTeamDeleting}
          teamActionErrorMessage={teamActionErrorMessage}
          memberInviteProps={memberInviteProps}
          teamEditProps={teamEditProps}
          onSearchKeywordChange={setSearchKeyword}
          onToggleSort={() => setSortType((type) => (type === 'team' ? 'recent' : 'team'))}
          onToggleCalendar={() => setIsCalendarOpen((isOpen) => !isOpen)}
          onSelectDate={setSelectedDate}
          onOpenRecord={(record) =>
            navigate(`/projects/${projectId}/teams/${teamId}/meetings/${record.id}`, {
              state: {
                ...location.state,
                meetingRecord: record,
              },
            })
          }
          onOpenTeamEdit={() => {
            setTeamActionErrorMessage('');
            setIsTeamEditModalOpen(true);
          }}
          onDeleteTeam={handleDeleteTeam}
          onLeaveTeam={handleLeaveTeam}
          onOpenMemberInvite={() => {
            setMemberErrorMessage('');
            setInviteResultMessage('');
            setIsMemberInviteModalOpen(true);
          }}
        />
      ) : (
        <SharedPagesTab
          memos={sharedMemos}
          keyword={memoSearchKeyword}
          selectedMemoId={selectedMemoId}
          selectedMemo={selectedMemo}
          projectName={location.state?.projectName ?? '노디 프로젝트'}
          teamName={currentTeam?.name ?? location.state?.teamName ?? '마케팅팀'}
          isListLoading={isSharedMemosLoading}
          isDetailLoading={isSharedMemoDetailLoading}
          isCreating={isSharedMemoCreating}
          isUpdating={isSharedMemoUpdating}
          listErrorMessage={sharedMemosErrorMessage}
          detailErrorMessage={sharedMemoDetailErrorMessage}
          onKeywordChange={setMemoSearchKeyword}
          onSelect={setSelectedMemoId}
          onCreate={handleCreateSharedMemo}
          onBack={() => setSelectedMemoId(null)}
          onUpdate={handleUpdateSharedMemo}
        />
      )}
    </div>
  );
}

export default TeamMeetingRecordsPage;
