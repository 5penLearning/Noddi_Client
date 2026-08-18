import { useEffect, useState } from 'react';

import closeIcon from '../../assets/icons/project-create/modal-close-x.svg';
import searchIcon from '../../assets/icons/project-create/search.svg';
import teamLogo from '../../assets/icons/my-team-logo.svg';
import ProfileAvatar from '../common/ProfileAvatar';

function MemberProfile({ member, selected, onClick }) {
  const content = (
    <>
      <ProfileAvatar
        userId={member.userId}
        profileImageUrl={member.profileImageUrl}
        name={member.name}
        className="size-6"
      />
      <span className="min-w-0 truncate text-[16px] leading-[1.3] font-medium">
        {member.name}
      </span>
      <span className="min-w-0 truncate text-[14px] text-[#8E9592]">
        {member.department || member.position || member.email}
      </span>
    </>
  );

  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[34px] min-w-0 items-center gap-2 rounded-[30px] py-1 pr-[10px] pl-1 text-left ${selected ? 'border border-[var(--color-action-primary)] bg-[#EFFFF8]' : ''}`}
    >
      {content}
    </button>
  ) : (
    <div className="flex min-w-0 flex-1 items-center gap-2">{content}</div>
  );
}

export default function ProjectInviteModal({
  isOpen,
  projectName,
  members,
  projectMembers,
  currentUserId,
  keyword,
  page,
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
  const [isManaging, setIsManaging] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const selectedUserIds = selectedMembers.map((member) => member.userId);

  useEffect(() => {
    if (!isOpen) {
      setIsManaging(false);
      setSelectedMembers([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInvite = async () => {
    if (await onInvite(selectedUserIds)) {
      setSelectedMembers([]);
      onKeywordChange('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <section
        className="box-border h-[583px] shrink-0 overflow-hidden rounded-[30px] bg-[linear-gradient(196deg,#FFFFFF_49%,#BAFFE1_121%)] px-11 py-12 shadow-[0_81px_48px_rgba(0,0,0,0.05),0_36px_36px_rgba(0,0,0,0.09),0_9px_20px_rgba(0,0,0,0.10)]"
        style={{ width: 672, minWidth: 672, maxWidth: 672 }}
      >
        <header className="flex items-start justify-between">
          <h2 className="text-[24px] leading-[1.3] font-medium text-black">
            [{projectName}]에 멤버 초대하기
          </h2>
          <button type="button" onClick={onClose} disabled={isSubmitting} className="size-6">
            <img src={closeIcon} alt="닫기" className="m-auto size-[6px]" />
          </button>
        </header>

        <div className="mt-10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[20px] leading-[1.3] font-medium">현재 프로젝트 멤버</h3>
              <span className="text-[16px] font-medium text-[#A9B0AD]">
                {projectMembers.length}명
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsManaging((current) => !current)}
              className="text-[16px] text-[#8E9592] underline"
            >
              멤버 수정하기
            </button>
          </div>

          <div className="mt-3 grid h-[96px] min-w-0 [scrollbar-width:none] grid-cols-2 content-start gap-3 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {isProjectMembersLoading ? (
              <p className="text-[14px] text-[#8E9592]">멤버를 불러오는 중입니다.</p>
            ) : (
              projectMembers.map((member) => {
                const isMe = String(member.userId) === String(currentUserId);
                const isProcessing = String(memberActionUserId) === String(member.userId);

                return (
                  <div
                    key={member.userId}
                    className="flex w-full min-w-0 max-w-full items-center gap-2 overflow-hidden"
                  >
                    <MemberProfile member={member} />
                    {isManaging && !isMe && (
                      <>
                        <select
                          value={member.role}
                          onChange={(event) => onRoleChange(member.userId, event.target.value)}
                          disabled={isProcessing}
                          className="h-7 w-[68px] shrink-0 rounded border border-[#D7DEDB] bg-white text-[12px]"
                        >
                          <option value="MEMBER">MEMBER</option>
                          <option value="LEADER">LEADER</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => onRemoveMember(member)}
                          disabled={isProcessing}
                          className="w-[48px] shrink-0 whitespace-nowrap text-[12px] text-[#FF4851] underline disabled:opacity-40"
                        >
                          내보내기
                        </button>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-[20px] leading-[1.3] font-medium">인원 추가</h3>
          <p className="text-[16px] text-[#707673]">
            현재 조직에 소속된 사람을 프로젝트에 초대할 수 있어요.
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div className="relative w-[428px]">
              <label className="flex h-11 items-center rounded-[10px] border border-[#D7DEDB] bg-white px-3">
                <input
                  value={keyword}
                  onChange={(event) => onKeywordChange(event.target.value)}
                  placeholder="초대하려는 인원을 검색해보세요"
                  className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[#8E9592]"
                />
                <img src={searchIcon} alt="" className="size-6 opacity-50" />
              </label>

              {keyword.trim() && (
                <div className="absolute top-12 z-10 flex max-h-[150px] w-full [scrollbar-width:none] flex-col gap-2 overflow-y-auto rounded-[10px] bg-white p-2 shadow-md [&::-webkit-scrollbar]:hidden">
                  {isLoading ? (
                    <p className="px-2 text-[14px] text-[#8E9592]">검색 중입니다.</p>
                  ) : members.length ? (
                    members
                      .filter((member) => !selectedUserIds.includes(member.userId))
                      .map((member) => (
                        <MemberProfile
                          key={member.userId}
                          member={member}
                          onClick={() => {
                            setSelectedMembers((current) => [...current, member]);
                            onKeywordChange('');
                          }}
                        />
                      ))
                  ) : (
                    <p className="px-2 text-[14px] text-[#8E9592]">검색 결과가 없습니다.</p>
                  )}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-4 text-[12px]">
                      <button
                        type="button"
                        disabled={page === 0}
                        onClick={() => onPageChange(page - 1)}
                      >
                        이전
                      </button>
                      <span>{page + 1} / {totalPages}</span>
                      <button
                        type="button"
                        disabled={page + 1 >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                      >
                        다음
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <img src={teamLogo} alt="" className="h-[26px] w-[31px]" />
            <button
              type="button"
              onClick={handleInvite}
              disabled={isSubmitting || selectedUserIds.length === 0}
              className="h-11 w-[110px] rounded-[10px] bg-[var(--color-action-primary)] text-[16px] font-semibold disabled:opacity-40"
            >
              {isSubmitting ? '초대 중' : '초대하기'}
            </button>
          </div>

          <div className="mt-6 flex h-[118px] [scrollbar-width:none] flex-wrap content-start gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {selectedMembers.map((member) => (
              <MemberProfile
                key={member.userId}
                member={member}
                selected
                onClick={() =>
                  setSelectedMembers((current) =>
                    current.filter((selectedMember) => selectedMember.userId !== member.userId),
                  )
                }
              />
            ))}
          </div>

          {errorMessage && <p className="-mt-5 text-[14px] text-[#FF4851]">{errorMessage}</p>}
          {resultMessage && <p className="-mt-5 text-[14px] text-[#707673]">{resultMessage}</p>}
        </div>
      </section>
    </div>
  );
}
