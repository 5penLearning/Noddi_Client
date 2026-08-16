import addUserBodyIcon from '../../assets/icons/team/add-user-body.svg';
import addUserHeadIcon from '../../assets/icons/team/add-user-head.svg';
import addUserHorizontalIcon from '../../assets/icons/team/add-user-horizontal.svg';
import addUserVerticalIcon from '../../assets/icons/team/add-user-vertical.svg';

function AddUserIcon() {
  return (
    <span className="relative block size-6">
      <img src={addUserHeadIcon} className="absolute top-[3px] left-[6px] size-2" />
      <img src={addUserBodyIcon} className="absolute top-[13px] left-[3px] h-[7.5px] w-3.5" />
      <img
        src={addUserHorizontalIcon}
        className="absolute top-[10.25px] left-[17px] h-[1.5px] w-1"
      />
      <img src={addUserVerticalIcon} className="absolute top-[9px] left-[18.25px] h-1 w-[1.5px]" />
    </span>
  );
}

export default AddUserIcon;
