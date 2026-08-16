import { useState } from 'react';

import ProjectCreateButton from './ProjectCreateButton';

import chevronIcon from '../../assets/icons/profile/chevron.svg';

function ProjectNotice({
  notices,
  isLoading = false,
  errorMessage = '',
  onCreateClick,
  onDetailClick,
  className = '',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentNotice = notices[currentIndex];

  const moveNotice = (direction) => {
    setCurrentIndex((current) => (current + direction + notices.length) % notices.length);
  };

  return (
    <section className={className}>
      <div className="flex items-center gap-3">
        <h2 className="subhead-1 text-[var(--color-black)]">전체 공지</h2>
        <ProjectCreateButton
          onClick={onCreateClick}
          className="!size-9 border border-[var(--color-gray-200)]"
        />
      </div>

      {isLoading && (
        <p className="body-4 mt-[17px] py-[23px] text-[var(--color-gray-500)]">
          공지를 불러오는 중입니다.
        </p>
      )}

      {!isLoading && errorMessage && (
        <p className="body-4 mt-[17px] py-[23px] text-[var(--color-red)]">{errorMessage}</p>
      )}

      {!isLoading && !errorMessage && !currentNotice && (
        <p className="body-4 mt-[17px] py-[23px] text-[var(--color-gray-500)]">
          등록된 공지가 없습니다.
        </p>
      )}

      {!isLoading && !errorMessage && currentNotice && (
        <div className="mt-[17px] flex h-[68px] items-start pt-[6px]">
          <button
            type="button"
            onClick={() => moveNotice(-1)}
            className="mt-[20px] flex size-6 shrink-0 items-center justify-center"
          >
            <img src={chevronIcon} alt="" className="h-[7px] w-[15px] -rotate-90" />
          </button>

          <span className="ml-[43px] flex h-8 shrink-0 items-center border border-[var(--color-gray-200)] px-[10px] text-base leading-[1.3] font-medium text-[var(--color-gray-600)]">
            {currentNotice.teamName}
          </span>

          <div className="mt-[3px] ml-5 min-w-0 flex-1">
            <h3 className="subhead-3 text-[var(--color-gray-700)]">{currentNotice.title}</h3>
            <p className="mt-[10px] truncate text-base leading-[1.3] font-medium text-[var(--color-gray-500)]">
              {currentNotice.content}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onDetailClick?.(currentNotice.id)}
            className="mt-[20px] ml-5 shrink-0 text-base leading-[1.3] font-medium text-[var(--color-gray-500)]"
          >
            자세히 보기
          </button>

          <button
            type="button"
            onClick={() => moveNotice(1)}
            className="mt-[20px] ml-[25px] flex size-6 shrink-0 items-center justify-center"
          >
            <img src={chevronIcon} alt="" className="h-[7px] w-[15px] rotate-90" />
          </button>
        </div>
      )}
    </section>
  );
}

export default ProjectNotice;
