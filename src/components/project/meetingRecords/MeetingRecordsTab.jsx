import AddUserIcon from '../AddUserIcon';
import MeetingDateFilterCalendar from '../MeetingDateFilterCalendar';
import MeetingRecordCard from '../MeetingRecordCard';
import TeamCreateModal from '../TeamCreateModal';
import TeamMemberInviteModal from '../TeamMemberInviteModal';

import aiIcon from '../../../assets/icons/meeting-records/ai.svg';
import calendarIcon from '../../../assets/icons/meeting-records/calendar.svg';
import searchIcon from '../../../assets/icons/search/search.svg';

function MeetingRecordsTab({
  searchKeyword,
  meetingRecords,
  meetingDates,
  selectedDate,
  isCalendarOpen,
  isLoading,
  errorMessage,
  currentTeam,
  isTeamDeleting,
  teamActionErrorMessage,
  memberInviteProps,
  teamEditProps,
  onSearchKeywordChange,
  onToggleCalendar,
  onSelectDate,
  onOpenRecord,
  onOpenTeamEdit,
  onDeleteTeam,
  onLeaveTeam,
  onOpenMemberInvite,
}) {
  return (
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
                onChange={(event) => onSearchKeywordChange(event.target.value)}
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
            <button
              type="button"
              onClick={onToggleCalendar}
              className={`ml-1 flex size-11 shrink-0 items-center justify-center rounded-full ${
                isCalendarOpen ? 'bg-white' : 'bg-[var(--color-gray-50)]'
              }`}
            >
              <img
                src={calendarIcon}
                alt="날짜 필터"
                className={`size-6 ${isCalendarOpen ? 'brightness-50' : ''}`}
              />
            </button>
          </div>

        </div>

        <div className="mt-4 min-h-0 flex-1 [scrollbar-width:thin] [scrollbar-color:#d9d9d9_transparent] overflow-x-hidden overflow-y-auto pb-[43px]">
          <div className="flex min-h-full flex-col">
            <div className="w-full min-w-0 space-y-2 pr-3">
              <MeetingListState
                isLoading={isLoading}
                errorMessage={errorMessage}
                isEmpty={meetingRecords.length === 0}
              />
              {!isLoading &&
                !errorMessage &&
                meetingRecords.map((record) => (
                  <MeetingRecordCard
                    key={record.id}
                    meetingDate={record.meetingDate}
                    title={record.title}
                    teams={record.teams}
                    summary={record.summary}
                    onClick={() => onOpenRecord(record)}
                  />
                ))}
            </div>

            <TeamManagementActions
              currentTeam={currentTeam}
              isDeleting={isTeamDeleting}
              errorMessage={teamActionErrorMessage}
              onEdit={onOpenTeamEdit}
              onDelete={onDeleteTeam}
              onLeave={onLeaveTeam}
            />
          </div>
        </div>
      </div>

      {isCalendarOpen && (
        <MeetingDateFilterCalendar
          selectedDate={selectedDate}
          meetingDates={meetingDates}
          onSelect={onSelectDate}
          className="absolute top-[92px] right-[140px]"
        />
      )}

      {currentTeam?.myRole === 'LEADER' && (
        <button
          type="button"
          onClick={onOpenMemberInvite}
          className="absolute right-5 bottom-5 flex size-11 items-center justify-center rounded-full bg-[var(--color-black)] p-[10px]"
          aria-label="팀 멤버 초대"
        >
          <AddUserIcon variant="white" />
        </button>
      )}

      <TeamMemberInviteModal {...memberInviteProps} />
      <TeamCreateModal {...teamEditProps} />
    </main>
  );
}

function MeetingListState({ isLoading, errorMessage, isEmpty }) {
  if (isLoading) {
    return (
      <p className="body-4 py-10 text-center text-[var(--color-gray-500)]">
        회의 목록을 불러오는 중입니다.
      </p>
    );
  }

  if (errorMessage) {
    return <p className="body-4 py-10 text-center text-[var(--color-red)]">{errorMessage}</p>;
  }

  if (isEmpty) {
    return (
      <p className="body-4 py-10 text-center text-[var(--color-gray-500)]">
        표시할 회의가 없습니다.
      </p>
    );
  }

  return null;
}

function TeamManagementActions({ currentTeam, isDeleting, errorMessage, onEdit, onDelete, onLeave }) {
  if (!currentTeam) return null;

  return (
    <div className="relative left-[195px] mt-auto flex flex-col items-center pt-10">
      {errorMessage && <p className="body-5 mb-3 text-[var(--color-red)]">{errorMessage}</p>}
      {currentTeam.myRole === 'LEADER' ? (
        <div className="flex items-center gap-3 text-[12px] leading-[1.3] text-[var(--color-gray-500)]">
          <button type="button" onClick={onEdit}>
            수정하기
          </button>
          <span>·</span>
          <button type="button" onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? '삭제 중' : '삭제하기'}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onLeave}
          disabled={isDeleting}
          className="text-[12px] leading-[1.3] text-[var(--color-gray-500)]"
        >
          {isDeleting ? '탈퇴 중' : '팀 탈퇴하기'}
        </button>
      )}
    </div>
  );
}

export default MeetingRecordsTab;
