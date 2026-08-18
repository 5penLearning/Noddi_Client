import { useEffect, useState } from 'react';

import { getUserProfileImage } from '../../api/mypageApi';
import profileEmptyLogo from '../../assets/icons/profile/profile-empty-logo.svg';

function ProfileAvatar({
  userId,
  profileImageUrl,
  name = '사용자',
  fallbackSrc,
  showBrandFallback = true,
  refreshKey,
  className = '',
}) {
  const [imageUrl, setImageUrl] = useState(profileImageUrl ?? '');
  const [globalRefreshKey, setGlobalRefreshKey] = useState(0);

  useEffect(() => {
    const refreshProfileImage = () => {
      setGlobalRefreshKey((currentKey) => currentKey + 1);
    };

    window.addEventListener('profile-updated', refreshProfileImage);

    return () => {
      window.removeEventListener('profile-updated', refreshProfileImage);
    };
  }, []);

  useEffect(() => {
    let isCurrentRequest = true;
    let objectUrl = '';

    setImageUrl(profileImageUrl ?? '');

    if (!userId || profileImageUrl === null) {
      return () => {
        isCurrentRequest = false;
      };
    }

    const loadProfileImage = async () => {
      try {
        const imageBlob = await getUserProfileImage(userId);

        if (!isCurrentRequest || !imageBlob?.size) return;

        objectUrl = URL.createObjectURL(imageBlob);
        setImageUrl(objectUrl);
      } catch {
        if (isCurrentRequest) {
          setImageUrl(profileImageUrl ?? '');
        }
      }
    };

    loadProfileImage();

    return () => {
      isCurrentRequest = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [globalRefreshKey, profileImageUrl, refreshKey, userId]);

  if (imageUrl || (fallbackSrc && !showBrandFallback)) {
    return (
      <img
        src={imageUrl || fallbackSrc}
        alt={`${name} 프로필`}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  if (showBrandFallback) {
    return (
      <span
        role="img"
        aria-label={`${name} 프로필`}
        className={`relative inline-flex items-center justify-center rounded-full border border-[#D7DEDB] bg-[#E9EFED] ${className}`}
      >
        <img
          src={profileEmptyLogo}
          alt=""
          className="h-[58.33%] w-[45.83%]"
        />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={`${name} 프로필`}
      className={`inline-flex items-center justify-center rounded-full bg-[#EFFFF7] font-semibold text-[#101211] ${className}`}
    >
      {name.trim().charAt(0) || '사'}
    </span>
  );
}

export default ProfileAvatar;
