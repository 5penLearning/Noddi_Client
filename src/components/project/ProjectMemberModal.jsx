import OutlineButton from '../common/OutlineButton';

import closeXIcon from '../../assets/icons/project-create/modal-close-x.svg';
import defaultMemberAvatar from '../../assets/icons/project-create/modal-member-avatar.svg';
import searchIcon from '../../assets/icons/project-create/search.svg';
import ProfileAvatar from '../common/ProfileAvatar';

function ProjectMemberModal({ data, onClose, onInvite, onEditMembers }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <section className="h-[562px] w-[647px] overflow-hidden rounded-[10px] bg-[var(--color-white)] px-[17px] pt-[23px]">
        <header className="flex h-[48px] items-start border-b border-[var(--color-gray-300)] px-2">
          <h2 className="subhead-1 text-[var(--color-black)]">
            [{data.projectName}]에 멤버 초대하기
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="relative ml-auto flex size-6 items-center justify-center"
          >
            <span className="absolute top-0.5 left-0.5 size-5 rounded-[5px] border-[1.5px] border-[#2B3F6C]" />
            <img src={closeXIcon} className="size-[6px]" />
          </button>
        </header>

        <div className="mt-6 flex items-center gap-[15px]">
          <div className="flex h-11 w-[484px] items-center overflow-hidden rounded-[10px] border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] px-2">
            {data.selectedMembers.map((member) => (
              <span
                key={member.id}
                className="body-3 relative mr-2 flex h-8 items-center rounded-[10px] bg-[var(--color-white)] px-5"
              >
                {member.name}
                <span className="absolute top-0.5 -right-0.5 size-2 rounded-full bg-[var(--color-black)]" />
              </span>
            ))}
            <img src={searchIcon} className="ml-auto size-6 shrink-0" />
          </div>
          <OutlineButton onClick={onInvite} className="h-11 w-[114px] !px-0 !py-0">
            초대장 보내기
          </OutlineButton>
        </div>

        <div className="mt-6 flex items-center px-[11px]">
          <h3 className="subhead-1">현재 팀 멤버</h3>
          <span className="subhead-2 ml-[19px] text-[var(--color-gray-500)]">
            {data.totalCount}명
          </span>
          <button type="button" onClick={onEditMembers} className="body-3 ml-auto">
            멤버 수정하기
          </button>
        </div>

        <ul className="mt-[25px] space-y-[19px] px-4">
          {data.members.map((member) => (
            <li key={member.id} className="flex h-11 items-center">
              <ProfileAvatar
                userId={member.userId ?? member.id}
                profileImageUrl={member.profileImageUrl ?? member.avatarUrl}
                name={member.name}
                fallbackSrc={defaultMemberAvatar}
                className="size-11"
              />
              <span className="subhead-2 ml-[21px]">{member.name}</span>
              <span className="body-3 ml-[19px] text-[var(--color-gray-500)]">
                {member.position}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default ProjectMemberModal;
