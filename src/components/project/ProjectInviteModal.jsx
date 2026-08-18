import { useEffect, useState } from 'react';

import OutlineButton from '../common/OutlineButton';
import ProfileAvatar from '../common/ProfileAvatar';

import clearXIcon from '../../assets/icons/project-create/clear-x.svg';
import defaultMemberAvatar from '../../assets/icons/project-create/modal-member-avatar.svg';
import searchIcon from '../../assets/icons/project-create/search.svg';

function ProjectInviteModal({
  isOpen,
  projectName,
  members,
  projectMembers,
  currentUserId,
  keyword,
  page,
  totalElements,
  totalPages,
  isLoading,
  isProjectMembersLoading,
  isSubmitting,
  memberActionUserId,
  errorMessage,
  resultMessage,
  onKeywordChange,
  onPageChange,
  onClose,
  onInvite,
  onRoleChange,
  onRemoveMember,
}) {
  const [activeTab, setActiveTab] = useState('invite');
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('invite');
      setSelectedUserIds([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMember = (userId) => {
    setSelectedUserIds((currentUserIds) =>
      currentUserIds.includes(userId)
        ? currentUserIds.filter((currentUserId) => currentUserId !== userId)
        : [...currentUserIds, userId],
    );
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
          <h2 className="subhead-1 text-[var(--color-black)]">[{projectName}]에 멤버 초대하기</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="body-2 ml-auto size-8 text-[var(--color-gray-600)]"
          >
            ×
          </button>
        </header>

        <div className="mt-5 flex items-center gap-6 border-b border-[var(--color-gray-100)]">
          <button
            type="button"
            onClick={() => setActiveTab('invite')}
            className={`subhead-3 pb-3 ${
              activeTab === 'invite'
                ? 'border-b-2 border-[var(--color-black)] text-[var(--color-black)]'
                : 'text-[var(--color-gray-500)]'
            }`}
          >
            멤버 초대
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`subhead-3 pb-3 ${
              activeTab === 'manage'
                ? 'border-b-2 border-[var(--color-black)] text-[var(--color-black)]'
                : 'text-[var(--color-gray-500)]'
            }`}
          >
            멤버 관리
          </button>
        </div>

        {activeTab === 'invite' && (
          <>
            <div className="mt-5 flex items-center gap-[15px]">
              <label className="flex h-11 min-w-0 flex-1 items-center rounded-[10px] border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-3">
                <input
                  type="text"
                  value={keyword}
                  onChange={(event) => onKeywordChange(event.target.value)}
                  placeholder="이름 또는 이메일 검색"
                  className="body-4 min-w-0 flex-1 bg-transparent outline-none"
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={() => onKeywordChange('')}
                    className="mr-2 flex size-6 shrink-0 items-center justify-center"
                  >
                    <img src={clearXIcon} className="size-[6px]" />
                  </button>
                )}
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

            <div className="mt-5 flex items-center">
              <h3 className="subhead-1">초대 가능한 조직원</h3>
              <span className="subhead-2 ml-[19px] text-[var(--color-gray-500)]">
                {totalElements}명
              </span>
            </div>

            {errorMessage && <p className="body-4 mt-3 text-[var(--color-red)]">{errorMessage}</p>}
            {resultMessage && (
              <p className="body-4 mt-3 text-[var(--color-gray-600)]">{resultMessage}</p>
            )}

            <div className="mt-4 h-[220px] [scrollbar-width:none] overflow-y-auto [&::-webkit-scrollbar]:hidden">
              {isLoading && (
                <p className="body-4 py-10 text-center text-[var(--color-gray-500)]">
                  초대 가능한 조직원을 불러오는 중입니다.
                </p>
              )}
              {!isLoading && members.length === 0 && (
                <p className="body-4 py-10 text-center text-[var(--color-gray-500)]">
                  초대할 수 있는 조직원이 없습니다.
                </p>
              )}
              {!isLoading && (
                <ul className="space-y-2">
                  {members.map((member) => {
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
                          <ProfileAvatar
                            userId={member.userId}
                            profileImageUrl={member.profileImageUrl}
                            name={member.name}
                            fallbackSrc={defaultMemberAvatar}
                            className="size-10"
                          />
                          <span className="subhead-2 ml-4">{member.name}</span>
                          <span className="body-4 ml-3 text-[var(--color-gray-500)]">
                            {member.email}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-3 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 0 || isLoading}
                  className="body-4 disabled:opacity-30"
                >
                  이전
                </button>
                <span className="body-4 text-[var(--color-gray-500)]">
                  {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page + 1 >= totalPages || isLoading}
                  className="body-4 disabled:opacity-30"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'manage' && (
          <div className="mt-5">
            <div className="flex items-center">
              <h3 className="subhead-1">현재 프로젝트 멤버</h3>
              <span className="subhead-2 ml-[19px] text-[var(--color-gray-500)]">
                {projectMembers.length}명
              </span>
            </div>

            {errorMessage && <p className="body-4 mt-3 text-[var(--color-red)]">{errorMessage}</p>}
            {resultMessage && (
              <p className="body-4 mt-3 text-[var(--color-gray-600)]">{resultMessage}</p>
            )}

            <ul className="mt-4 h-[350px] [scrollbar-width:none] space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
              {isProjectMembersLoading && (
                <li className="body-4 py-10 text-center text-[var(--color-gray-500)]">
                  프로젝트 멤버를 불러오는 중입니다.
                </li>
              )}
              {!isProjectMembersLoading && projectMembers.length === 0 && (
                <li className="body-4 py-10 text-center text-[var(--color-gray-500)]">
                  프로젝트 멤버가 없습니다.
                </li>
              )}
              {projectMembers.map((member) => {
                const isMe = String(member.userId) === String(currentUserId);
                const isProcessing = String(memberActionUserId) === String(member.userId);

                return (
                  <li
                    key={member.userId}
                    className="flex h-14 items-center rounded-[10px] px-3 hover:bg-[var(--color-gray-50)]"
                  >
                    <ProfileAvatar
                      userId={member.userId}
                      profileImageUrl={member.profileImageUrl}
                      name={member.name}
                      fallbackSrc={defaultMemberAvatar}
                      className="size-10"
                    />
                    <div className="ml-4 min-w-0">
                      <p className="subhead-2 truncate">{member.name}</p>
                      <p className="body-5 truncate text-[var(--color-gray-500)]">{member.email}</p>
                    </div>
                    {isMe ? (
                      <span className="body-4 ml-auto text-[var(--color-gray-500)]">
                        {member.role}
                      </span>
                    ) : (
                      <>
                        <select
                          value={member.role}
                          onChange={(event) => onRoleChange(member.userId, event.target.value)}
                          disabled={isProcessing}
                          className="body-4 ml-auto h-9 rounded-[8px] border border-[var(--color-gray-300)] bg-white px-2 outline-none"
                        >
                          <option value="MEMBER">MEMBER</option>
                          <option value="LEADER">LEADER</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => onRemoveMember(member)}
                          disabled={isProcessing}
                          className="body-3 ml-3 flex h-11 w-[114px] items-center justify-center rounded-[10px] bg-[#FF4851] text-[var(--color-white)] disabled:opacity-40"
                        >
                          {isProcessing ? '처리 중' : '내보내기'}
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProjectInviteModal;
