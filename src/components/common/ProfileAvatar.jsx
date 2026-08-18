import {
  useEffect,
  useState,
} from 'react';

import {
  getUserProfileImage,
} from '../../api/mypageApi';

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
  const [
    imageUrl,
    setImageUrl,
  ] = useState(profileImageUrl ?? '');

  const [
    globalRefreshKey,
    setGlobalRefreshKey,
  ] = useState(0);

  useEffect(() => {
    const refreshProfileImage = () => {
      setGlobalRefreshKey(
        (currentKey) => currentKey + 1,
      );
    };

    window.addEventListener(
      'profile-updated',
      refreshProfileImage,
    );

    return () => {
      window.removeEventListener(
        'profile-updated',
        refreshProfileImage,
      );
    };
  }, []);

  useEffect(() => {
    let isCurrentRequest = true;
    let objectUrl = '';

    setImageUrl(profileImageUrl ?? '');

    if (
      !userId ||
      profileImageUrl === null
    ) {
      return () => {
        isCurrentRequest = false;
      };
    }

    const loadProfileImage = async () => {
      try {
        const imageBlob =
          await getUserProfileImage(userId);

        if (
          !isCurrentRequest ||
          !imageBlob?.size
        ) {
          return;
        }

        objectUrl =
          URL.createObjectURL(imageBlob);

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
  }, [
    globalRefreshKey,
    profileImageUrl,
    refreshKey,
    userId,
  ]);

  if (
    imageUrl ||
    (fallbackSrc && !showBrandFallback)
  ) {
    return (
      <img
        src={imageUrl || fallbackSrc}
        alt={`${name} 프로필`}
        className={`rounded-full bg-[#EFFFF7] object-cover ${className}`}
      />
    );
  }

  if (showBrandFallback) {
    return (
      <span
        role="img"
        aria-label={`${name} 프로필`}
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-full border border-[#CDEEDD] bg-[#EFFFF7] ${className}`}
      >
        <img
          src={profileEmptyLogo}
          alt=""
          className="h-[56%] w-[44%]"
        />
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={`${name} 프로필`}
      className={`inline-flex items-center justify-center rounded-full bg-[#DFFFF0] font-semibold text-[#176C4B] ${className}`}
    >
      {name.trim().charAt(0) || '사'}
    </span>
  );
}

export default ProfileAvatar;
