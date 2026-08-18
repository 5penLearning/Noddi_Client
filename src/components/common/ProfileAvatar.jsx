import { useEffect, useState } from 'react';

import { getUserProfileImage } from '../../api/mypageApi';

function ProfileAvatar({
  userId,
  profileImageUrl,
  name = '사용자',
  fallbackSrc,
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

  if (imageUrl || fallbackSrc) {
    return (
      <img
        src={imageUrl || fallbackSrc}
        alt={`${name} 프로필`}
        className={`rounded-full object-cover ${className}`}
      />
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
