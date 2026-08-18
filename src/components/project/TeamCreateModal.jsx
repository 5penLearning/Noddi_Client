import { useEffect, useMemo, useState } from 'react';

import defaultMemberAvatar from '../../assets/icons/my-team-avatar.svg';
import ProfileAvatar from '../common/ProfileAvatar';
import teamLogo from '../../assets/icons/my-team-logo.svg';
import closeIcon from '../../assets/icons/project-create/modal-close-x.svg';
import searchIcon from '../../assets/icons/project-create/search.svg';

const highlightKeyword = (text, keyword) => {
  if (!keyword) return text;

  const matchIndex = text.toLowerCase().indexOf(keyword.toLowerCase());

  if (matchIndex < 0) return text;

  return (
    <>
      {text.slice(0, matchIndex)}
      <span className="font-semibold text-[var(--color-action-primary)]">
        {text.slice(matchIndex, matchIndex + keyword.length)}
      </span>
      {text.slice(matchIndex + keyword.length)}
    </>
  );
};

function TeamCreateModal({
  isOpen,
  mode = 'create',
  initialTeam,
  members = [],
  currentUserId,
  isLoadingMembers = false,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    setName(mode === 'edit' ? (initialTeam?.name ?? '') : '');
    setDescription(mode === 'edit' ? (initialTeam?.description ?? '') : '');
    setKeyword('');
    setSelectedUserIds([]);
  }, [initialTeam, isOpen, mode]);

  const selectableMembers = useMemo(
    () => members.filter((member) => String(member.userId) !== String(currentUserId)),
    [currentUserId, members],
  );

  const filteredMembers = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) return [];

    return selectableMembers
      .filter(
        (member) =>
          !selectedUserIds.includes(member.userId) &&
          [member.name, member.email, member.department, member.position]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedKeyword)),
      )
      .slice(0, 4);
  }, [keyword, selectableMembers, selectedUserIds]);

  const selectedMembers = selectableMembers.filter((member) =>
    selectedUserIds.includes(member.userId),
  );

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) return;

    onSubmit({
      name: trimmedName,
      description: description.trim(),
      selectedUserIds,
    });
  };

  const handleSelectMember = (userId) => {
    setSelectedUserIds((currentUserIds) => [...currentUserIds, userId]);
    setKeyword('');
  };

  const handleRemoveMember = (userId) => {
    setSelectedUserIds((currentUserIds) =>
      currentUserIds.filter((currentUserId) => currentUserId !== userId),
    );
  };

  const isSearching = mode === 'create' && Boolean(keyword.trim());
  const hasSelectedMembers = mode === 'create' && selectedMembers.length > 0;
  const modalHeight = isSearching ? 'h-[611px]' : hasSelectedMembers ? 'h-[585px]' : 'h-[480px]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#E9EFED]/80"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose?.();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className={`flex w-[516px] flex-col justify-between overflow-hidden rounded-[30px] bg-[linear-gradient(201deg,#FFFFFF_49%,#BAFFE1_121%)] px-11 py-12 shadow-[0_81px_48px_rgba(0,0,0,0.05),0_36px_36px_rgba(0,0,0,0.09),0_9px_20px_rgba(0,0,0,0.10)] transition-[height] ${modalHeight}`}
      >
        <div className="flex flex-col gap-10">
          <header className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[24px] leading-[1.3] font-semibold tracking-[0.24px] text-[#101211]">
                {mode === 'edit' ? '팀 정보 수정하기' : '팀 생성하기'}
              </h2>
              <img src={teamLogo} alt="" className="h-[26px] w-[31px]" />
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex size-6 items-center justify-center"
            >
              <img src={closeIcon} alt="" className="size-[6px]" />
            </button>
          </header>

          <div className="flex flex-col gap-8">
            <label className="flex flex-col gap-2 text-[16px] leading-[1.3] font-medium text-[#0C0D0D]">
              <span>
                팀명 <span className="text-[#FF4851]">*</span>
              </span>
              <span className="flex items-center gap-[11px]">
                <span className="flex h-11 min-w-0 flex-1 items-center rounded-[10px] bg-[#F2F7F4] px-3 py-[10px]">
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    disabled={isSubmitting}
                    placeholder="팀명을 입력해주세요"
                    className="min-w-0 flex-1 bg-transparent text-[16px] leading-[1.4] font-normal tracking-[-0.16px] text-[#343836] outline-none placeholder:text-[#8E9592]"
                  />
                  {name && (
                    <button
                      type="button"
                      onClick={() => setName('')}
                      className="flex size-6 shrink-0 items-center justify-center"
                    >
                      <img src={closeIcon} alt="" className="size-[6px] opacity-40" />
                    </button>
                  )}
                </span>
                <span className="font-normal tracking-[-0.16px] text-[#525654]">팀</span>
              </span>
            </label>

            {mode === 'edit' ? (
              <label className="flex flex-col gap-2 text-[16px] leading-[1.3] font-medium text-[#0C0D0D]">
                팀 설명
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={isSubmitting}
                  placeholder="팀에 대한 설명을 입력해주세요"
                  className="h-24 resize-none rounded-[10px] bg-[#F2F7F4] p-3 text-[16px] leading-[1.4] font-normal outline-none"
                />
              </label>
            ) : (
              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="text-[16px] leading-[1.3] font-medium text-black">인원 추가</h3>
                  <p className="text-[16px] leading-[1.4] tracking-[-0.16px] text-[#707673]">
                    현재 해당 프로젝트에 초대된 사람만 팀에 추가할 수 있어요.
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <label
                    className={`flex h-11 items-center justify-between rounded-[10px] border bg-white px-3 py-[10px] ${isSearching ? 'border-[#707673]' : 'border-[#D7DEDB]'}`}
                  >
                    <input
                      type="text"
                      value={keyword}
                      onChange={(event) => setKeyword(event.target.value)}
                      disabled={isSubmitting}
                      placeholder="추가하려는 인원을 검색해보세요"
                      className="min-w-0 flex-1 bg-transparent text-[16px] leading-[1.4] tracking-[-0.16px] text-[#343836] outline-none placeholder:text-[#8E9592]"
                    />
                    <img src={searchIcon} alt="" className="size-6 shrink-0 opacity-50" />
                  </label>

                  {isSearching && (
                    <div className="flex max-h-[144px] [scrollbar-width:none] flex-col gap-3 overflow-y-auto rounded-[10px] bg-white px-3 py-2 [&::-webkit-scrollbar]:hidden">
                      {isLoadingMembers ? (
                        <p className="text-[14px] text-[#8E9592]">멤버를 불러오는 중입니다.</p>
                      ) : filteredMembers.length > 0 ? (
                        filteredMembers.map((member) => (
                          <button
                            key={member.userId}
                            type="button"
                            onClick={() => handleSelectMember(member.userId)}
                            className="flex items-center gap-2 text-left"
                          >
                            <ProfileAvatar
                              userId={member.userId ?? member.id}
                              profileImageUrl={member.profileImageUrl}
                              name={member.name}
                              fallbackSrc={defaultMemberAvatar}
                              className="size-6 rounded-full object-cover"
                            />
                            <span className="flex items-end gap-[6px] whitespace-nowrap">
                              <span className="text-[16px] leading-[1.3] font-medium text-black">
                                {highlightKeyword(member.name, keyword.trim())}
                              </span>
                              <span className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#8E9592]">
                                {member.department || member.position || member.email}
                              </span>
                            </span>
                          </button>
                        ))
                      ) : (
                        <p className="text-[14px] text-[#8E9592]">검색 결과가 없습니다.</p>
                      )}
                    </div>
                  )}

                  {!isSearching && hasSelectedMembers && (
                    <div className="flex max-h-[126px] [scrollbar-width:none] flex-wrap content-start gap-2 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                      {selectedMembers.map((member) => (
                        <button
                          key={member.userId}
                          type="button"
                          onClick={() => handleRemoveMember(member.userId)}
                          className="flex h-[34px] items-center gap-2 rounded-[30px] border border-[var(--color-action-primary)] bg-[#EFFFF8] py-1 pr-[10px] pl-1"
                        >
                          <ProfileAvatar
                            userId={member.userId ?? member.id}
                            profileImageUrl={member.profileImageUrl}
                            name={member.name}
                            fallbackSrc={defaultMemberAvatar}
                            className="size-6 rounded-full object-cover"
                          />
                          <span className="flex items-end gap-[6px] whitespace-nowrap">
                            <span className="text-[16px] leading-[1.3] font-medium text-[#101211]">
                              {member.name}
                            </span>
                            <span className="text-[16px] leading-[1.4] font-medium tracking-[-0.16px] text-[#8E9592]">
                              {member.department || member.position || member.email}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          {errorMessage && (
            <p className="mb-2 text-[14px] leading-[1.4] text-[#FF4851]">{errorMessage}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="flex h-11 w-full items-center justify-center rounded-[10px] bg-[var(--color-action-primary)] px-5 py-[10px] text-[16px] leading-[1.3] font-semibold text-[#101211] disabled:opacity-40"
          >
            {isSubmitting
              ? mode === 'edit'
                ? '수정하는 중입니다.'
                : '팀을 만드는 중입니다.'
              : mode === 'edit'
                ? '수정하기'
                : '팀 생성하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TeamCreateModal;
