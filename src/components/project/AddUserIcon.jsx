import addUserBodyIcon from '../../assets/icons/team/add-user-body.svg';
import addUserBodyWhiteIcon from '../../assets/icons/team/add-user-body-white.svg';
import addUserHeadIcon from '../../assets/icons/team/add-user-head.svg';
import addUserHeadWhiteIcon from '../../assets/icons/team/add-user-head-white.svg';
import addUserHorizontalIcon from '../../assets/icons/team/add-user-horizontal.svg';
import addUserHorizontalWhiteIcon from '../../assets/icons/team/add-user-horizontal-white.svg';
import addUserVerticalIcon from '../../assets/icons/team/add-user-vertical.svg';
import addUserVerticalWhiteIcon from '../../assets/icons/team/add-user-vertical-white.svg';

function AddUserIcon({ variant = 'default' }) {
  const isWhite = variant === 'white';

  return (
    <span className="relative block size-6">
      <img
        src={isWhite ? addUserHeadWhiteIcon : addUserHeadIcon}
        className="absolute top-[3px] left-[6px] size-2"
      />
      <img
        src={isWhite ? addUserBodyWhiteIcon : addUserBodyIcon}
        className="absolute top-[13px] left-[3px] h-[7.5px] w-3.5"
      />
      <img
        src={isWhite ? addUserHorizontalWhiteIcon : addUserHorizontalIcon}
        className="absolute top-[10.25px] left-[17px] h-[1.5px] w-1"
      />
      <img
        src={isWhite ? addUserVerticalWhiteIcon : addUserVerticalIcon}
        className="absolute top-[9px] left-[18.25px] h-1 w-[1.5px]"
      />
    </span>
  );
}

export default AddUserIcon;
