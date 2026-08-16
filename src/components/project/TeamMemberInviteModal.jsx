import { useMemo, useState } from 'react';

import OutlineButton from '../common/OutlineButton';

import defaultMemberAvatar from '../../assets/icons/project-create/modal-member-avatar.svg';
import searchIcon from '../../assets/icons/project-create/search.svg';

function TeamMemberInviteModal({
  isOpen,
  projectMembers,
  teamMembers,
  isLoading,
  isSubmitting,
  errorMessage,
  resultMessage,
  onClose,
  onInvite,
}) {
  const [keyword, setKeyword] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const teamMemberIds = useMemo(
    () => new Set(teamMembers.map((member) => String(member.userId))),
    [teamMembers],
  );
  const availableMembers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return projectMembers.filter((member) => {
      const isAlreadyMember = teamMemberIds.has(String(member.userId));
      const matchesKeyword =
        !normalizedKeyword ||
        member.name.toLowerCase().includes(normalizedKeyword) ||
        member.email.toLowerCase().includes(normalizedKeyword);

      return !isAlreadyMember && matchesKeyword;
    });
  }, [keyword, projectMembers, teamMemberIds]);

  if (!isOpen) return null;

  const handleToggleMember = (userId) => {
    setSelectedUserIds((currentUserIds) =>
      currentUserIds.includes(userId)
        ? currentUserIds.filter((currentUserId) => currentUserId !== userId)
        : [...currentUserIds, userId],
    );
  };

  const handleClose = () => {
    setKeyword('');
    setSelectedUserIds([]);
    onClose();
  };

  const handleInvite = async () => {
    const isSuccess = await onInvite(selectedUserIds);

    if (isSuccess) {
      setSelectedUserIds([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <section className="h-[562px] w-[647px] overflow-hidden rounded-[10px] bg-[var(--color-white)] px-[25px] pt-[23px]">
        <header className="flex h-[48px] items-start border-b border-[var(--color-gray-300)]">
          <h2 className="subhead-1 text-[var(--color-black)]">팀 멤버 초대하기</h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="body-2 ml-auto size-8 text-[var(--color-gray-600)]"
          >
            ×
          </button>
        </header>

        <div className="mt-6 flex items-center gap-[15px]">
          <label className="flex h-11 min-w-0 flex-1 items-center rounded-[10px] border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-3">
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="프로젝트 멤버의 이름 또는 이메일 검색"
              className="body-4 min-w-0 flex-1 bg-transparent outline-none"
            />
            <img src={searchIcon} className="size-6 shrink-0" />
          </label>
          <OutlineButton
            onClick={handleInvite}
            disabled={isSubmitting || selectedUserIds.length === 0}
            className="h-11 w-[114px] !px-0 !py-0 disabled:opacity-40"
          >
            {isSubmitting ? '전송 중' : '초대장 보내기'}
          </OutlineButton>
        </div>

        <div className="mt-6 flex items-center">
          <h3 className="subhead-1">초대 가능한 프로젝트 멤버</h3>
          <span className="subhead-2 ml-[19px] text-[var(--color-gray-500)]">
            {availableMembers.length}명
          </span>
        </div>

        {errorMessage && <p className="body-4 mt-3 text-[var(--color-red)]">{errorMessage}</p>}
        {resultMessage && (
          <p className="body-4 mt-3 text-[var(--color-gray-600)]">{resultMessage}</p>
        )}

        <div className="mt-4 h-[330px] [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {isLoading && (
            <p className="body-4 py-10 text-center text-[var(--color-gray-500)]">
              멤버를 불러오는 중입니다.
            </p>
          )}
          {!isLoading && availableMembers.length === 0 && (
            <p className="body-4 py-10 text-center text-[var(--color-gray-500)]">
              초대할 수 있는 프로젝트 멤버가 없습니다.
            </p>
          )}
          {!isLoading && (
            <ul className="space-y-2">
              {availableMembers.map((member) => {
                const isSelected = selectedUserIds.includes(member.userId);

                return (
                  <li key={member.userId}>
                    <button
                      type="button"
                      onClick={() => handleToggleMember(member.userId)}
                      className={`flex h-14 w-full items-center rounded-[10px] px-3 text-left ${
                        isSelected
                          ? 'bg-[var(--color-action-primary)]'
                          : 'hover:bg-[var(--color-gray-50)]'
                      }`}
                    >
                      <img src={defaultMemberAvatar} className="size-10 rounded-full" />
                      <span className="subhead-2 ml-4">{member.name}</span>
                      <span className="body-4 ml-3 text-[var(--color-gray-500)]">
                        {member.email}
                      </span>
                      <span className="body-5 ml-auto text-[var(--color-gray-500)]">
                        {member.role}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default TeamMemberInviteModal;
