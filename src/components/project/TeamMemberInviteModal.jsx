import { useEffect, useMemo, useState } from 'react';

import closeIcon from '../../assets/icons/project-create/modal-close-x.svg';
import defaultMemberAvatar from '../../assets/icons/my-team-avatar.svg';
import searchIcon from '../../assets/icons/project-create/search.svg';
import teamLogo from '../../assets/icons/my-team-logo.svg';
import ProfileAvatar from '../common/ProfileAvatar';

function MemberProfile({ member, selected = false, onClick }) {
  const content = (
    <>
      <ProfileAvatar
        userId={member.userId ?? member.id}
        profileImageUrl={member.profileImageUrl ?? member.avatarUrl}
        name={member.name}
        fallbackSrc={defaultMemberAvatar}
        className="size-6 rounded-full object-cover"
      />
      <span className="flex min-w-0 items-end gap-[6px] whitespace-nowrap">
        <span className="truncate text-[16px] leading-[1.3] font-medium text-[#101211]">
          {member.name}
        </span>
        <span className="truncate text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#8E9592]">
          {member.department || member.position || member.email}
        </span>
      </span>
    </>
  );

  if (!onClick) {
    return <div className="flex min-w-0 items-center gap-2">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[34px] min-w-0 items-center gap-2 rounded-[30px] py-1 pr-[10px] pl-1 text-left ${selected ? 'border border-[var(--color-action-primary)] bg-[#EFFFF8]' : ''}`}
    >
      {content}
    </button>
  );
}

function TeamMemberInviteModal({
  isOpen,
  projectName = '프로젝트',
  teamName = '팀',
  projectMembers,
  teamMembers,
  currentUserId,
  isLoading,
  isSubmitting,
  memberActionUserId,
  errorMessage,
  resultMessage,
  onClose,
  onInvite,
  onRoleChange,
  onRemoveMember,
}) {
  const [isManaging, setIsManaging] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const teamMemberIds = useMemo(
    () => new Set(teamMembers.map((member) => String(member.userId))),
    [teamMembers],
  );
  const availableMembers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) return [];

    return projectMembers
      .filter((member) => {
        const isAlreadyMember = teamMemberIds.has(String(member.userId));
        const isSelected = selectedUserIds.includes(member.userId);
        const matchesKeyword = [member.name, member.email, member.department, member.position]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedKeyword));

        return !isAlreadyMember && !isSelected && matchesKeyword;
      })
      .slice(0, 4);
  }, [keyword, projectMembers, selectedUserIds, teamMemberIds]);
  const selectedMembers = projectMembers.filter((member) =>
    selectedUserIds.includes(member.userId),
  );

  useEffect(() => {
    if (!isOpen) {
      setIsManaging(false);
      setKeyword('');
      setSelectedUserIds([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectMember = (userId) => {
    setSelectedUserIds((currentUserIds) => [...currentUserIds, userId]);
    setKeyword('');
  };

  const handleRemoveSelectedMember = (userId) => {
    setSelectedUserIds((currentUserIds) =>
      currentUserIds.filter((currentUserId) => currentUserId !== userId),
    );
  };

  const handleInvite = async () => {
    const isSuccess = await onInvite(selectedUserIds);

    if (isSuccess) {
      setSelectedUserIds([]);
      setKeyword('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose?.();
      }}
    >
      <section className="h-[583px] w-[672px] overflow-hidden rounded-[30px] bg-[linear-gradient(196deg,#FFFFFF_49%,#BAFFE1_121%)] px-11 py-12 shadow-[0_81px_48px_rgba(0,0,0,0.05),0_36px_36px_rgba(0,0,0,0.09),0_9px_20px_rgba(0,0,0,0.10)]">
        <header className="flex items-start justify-between">
          <h2 className="text-[24px] leading-[1.3] font-medium whitespace-nowrap text-black">
            [{projectName}/ {teamName}]에 멤버 초대하기
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex size-6 items-center justify-center"
          >
            <img src={closeIcon} alt="" className="size-[6px]" />
          </button>
        </header>

        <div className="mt-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[20px] leading-[1.3] font-medium text-[#0C0D0D]">현재 팀원</h3>
              <span className="text-[16px] leading-[1.3] font-medium text-[#A9B0AD]">
                {teamMembers.length}명
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsManaging((current) => !current)}
              className="text-[16px] leading-[1.4] tracking-[-0.16px] text-[#8E9592] underline"
            >
              멤버 수정하기
            </button>
          </div>

          <div className="mt-3 grid h-[96px] [scrollbar-width:none] grid-cols-2 content-start gap-x-3 gap-y-3 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {isLoading ? (
              <p className="text-[14px] text-[#8E9592]">팀원을 불러오는 중입니다.</p>
            ) : (
              teamMembers.map((member) =>
                isManaging && String(member.userId) !== String(currentUserId) ? (
                  <div key={member.userId} className="flex min-w-0 items-center gap-2">
                    <MemberProfile member={member} />
                    <select
                      value={member.role}
                      onChange={(event) => onRoleChange(member.userId, event.target.value)}
                      disabled={String(memberActionUserId) === String(member.userId)}
                      className="h-7 rounded border border-[#D7DEDB] bg-white text-[12px]"
                    >
                      <option value="MEMBER">MEMBER</option>
                      <option value="LEADER">LEADER</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => onRemoveMember(member)}
                      className="shrink-0 text-[12px] text-[#FF4851] underline"
                    >
                      내보내기
                    </button>
                  </div>
                ) : (
                  <MemberProfile key={member.userId} member={member} />
                ),
              )
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-[20px] leading-[1.3] font-medium text-black">인원 추가</h3>
          <p className="text-[16px] leading-[1.4] tracking-[-0.16px] text-[#707673]">
            현재 해당 프로젝트에 초대된 사람만 팀에 추가할 수 있어요.
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div className="relative w-[428px]">
              <label className="flex h-11 items-center justify-between rounded-[10px] border border-[#D7DEDB] bg-white px-3 py-[10px]">
                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="추가하려는 인원을 검색해보세요"
                  className="min-w-0 flex-1 bg-transparent text-[16px] leading-[1.4] tracking-[-0.16px] text-[#343836] outline-none placeholder:text-[#8E9592]"
                />
                <img src={searchIcon} alt="" className="size-6 shrink-0 opacity-50" />
              </label>

              {keyword.trim() && (
                <div className="absolute top-12 left-0 z-10 flex max-h-[140px] w-full [scrollbar-width:none] flex-col gap-2 overflow-y-auto rounded-[10px] bg-white p-2 shadow-md [&::-webkit-scrollbar]:hidden">
                  {availableMembers.length > 0 ? (
                    availableMembers.map((member) => (
                      <MemberProfile
                        key={member.userId}
                        member={member}
                        onClick={() => handleSelectMember(member.userId)}
                      />
                    ))
                  ) : (
                    <p className="px-2 text-[14px] text-[#8E9592]">검색 결과가 없습니다.</p>
                  )}
                </div>
              )}
            </div>

            <img src={teamLogo} alt="" className="h-[26px] w-[31px]" />
            <button
              type="button"
              onClick={handleInvite}
              disabled={isSubmitting || selectedUserIds.length === 0}
              className="flex h-11 w-[110px] items-center justify-center rounded-[10px] bg-[var(--color-action-primary)] px-5 py-[10px] text-[16px] leading-[1.3] font-semibold whitespace-nowrap text-[#101211] disabled:opacity-40"
            >
              {isSubmitting ? '추가 중' : '추가하기'}
            </button>
          </div>

          <div className="mt-6 flex h-[118px] [scrollbar-width:none] flex-wrap content-start gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {selectedMembers.map((member) => (
              <MemberProfile
                key={member.userId}
                member={member}
                selected
                onClick={() => handleRemoveSelectedMember(member.userId)}
              />
            ))}
          </div>

          {errorMessage && (
            <p className="-mt-5 text-[14px] leading-[1.4] text-[#FF4851]">{errorMessage}</p>
          )}
          {resultMessage && (
            <p className="-mt-5 text-[14px] leading-[1.4] text-[#707673]">{resultMessage}</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default TeamMemberInviteModal;
