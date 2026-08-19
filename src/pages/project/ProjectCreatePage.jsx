import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import OutlineButton from '../../components/common/OutlineButton';
import { getApiErrorMessage } from '../../api/axios';
import { createProject } from '../../api/projects';

import chevronIcon from '../../assets/icons/profile/chevron.svg';
import clearXIcon from '../../assets/icons/project-create/clear-x.svg';

const formatDatePart = (value) => String(value).padStart(2, '0');

function ProjectCreatePage() {
  const navigate = useNavigate();
  const [startDate] = useState(() => new Date());
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [endYear, setEndYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const startDay = startDate.getDate();
  const yearOptions = Array.from({ length: 11 }, (_, index) => startYear + index);
  const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);
  const daysInEndMonth =
    endYear && endMonth ? new Date(Number(endYear), Number(endMonth), 0).getDate() : 31;
  const dayOptions = Array.from({ length: daysInEndMonth }, (_, index) => index + 1);
  const endDate =
    endYear && endMonth && endDay
      ? new Date(Number(endYear), Number(endMonth) - 1, Number(endDay))
      : null;
  const startDateAtMidnight = new Date(startYear, startMonth - 1, startDay);
  const totalDays =
    endDate && endDate >= startDateAtMidnight
      ? Math.floor((endDate - startDateAtMidnight) / 86400000) + 1
      : null;

  const handleEndYearChange = (event) => {
    setEndYear(event.target.value);
    setEndMonth('');
    setEndDay('');
  };

  const handleEndMonthChange = (event) => {
    setEndMonth(event.target.value);
    setEndDay('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = projectName.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      setErrorMessage('프로젝트명과 프로젝트 설명을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const createdProject = await createProject({
        name: trimmedName,
        description: trimmedDescription,
      });

      navigate(`/projects/${createdProject.projectId}`, { replace: true });
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '프로젝트를 생성하지 못했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="h-full [scrollbar-width:none] overflow-y-auto rounded-[10px] bg-[var(--color-white)] [&::-webkit-scrollbar]:hidden">
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid min-h-[970px] w-full max-w-[887px] justify-items-center px-[46px] pt-[79px] pb-[44px]"
      >
        <div className="w-full">
          <label className="body-4 tracking-[-0.16px]">
            프로젝트명 <span className="text-[#ff4851]">*</span>
          </label>
          <div className="mt-[13px] flex h-[47px] items-center rounded-[10px] bg-[var(--color-gray-50)] px-5">
            <input
              type="text"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              placeholder="프로젝트 명"
              className="body-4 min-w-0 flex-1 bg-transparent tracking-[-0.16px] text-[var(--color-black)] outline-none placeholder:text-[var(--color-gray-500)]"
            />
            <button
              type="button"
              onClick={() => setProjectName('')}
              className="relative flex size-6 shrink-0 items-center justify-center"
            >
              <span className="absolute top-0.5 left-0.5 size-5 rounded-[5px] border-[1.5px] border-[var(--color-gray-400)]" />
              <img src={clearXIcon} className="size-[6px]" />
            </button>
          </div>

          <label className="body-4 mt-[32px] block tracking-[-0.16px]">
            프로젝트 설명 <span className="text-[#ff4851]">*</span>
          </label>
          <div className="relative mt-[13px] h-[113px] rounded-[10px] bg-[var(--color-gray-50)]">
            <textarea
              value={description}
              maxLength={100}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="프로젝트에 대한 간단한 설명과 목표를 작성해주세요"
              className="body-4 absolute inset-0 h-full w-full resize-none overflow-hidden bg-transparent px-5 py-[45px] pr-[165px] tracking-[-0.16px] text-[var(--color-black)] outline-none placeholder:text-[var(--color-gray-500)]"
            />
            <button
              type="button"
              onClick={() => setDescription('')}
              className="absolute top-[10px] right-5 flex size-6 items-center justify-center"
            >
              <span className="absolute top-0.5 left-0.5 size-5 rounded-[5px] border-[1.5px] border-[var(--color-gray-400)]" />
              <img src={clearXIcon} className="size-[6px]" />
            </button>
            <span className="body-4 absolute top-1/2 right-[64px] -translate-y-1/2 tracking-[-0.16px] text-[var(--color-gray-500)]">
              ({description.length}/100)
            </span>
          </div>

          <h2 className="body-4 mt-[46px] tracking-[-0.16px]">프로젝트 기간</h2>
          <div className="mt-[13px] flex items-center">
            <div className="body-4 flex h-[47px] w-[215px] items-center justify-between rounded-[10px] border border-[var(--color-gray-200)] px-5 text-[var(--color-gray-500)]">
              <span>{startYear} 년도</span>
              <span>{formatDatePart(startMonth)} 월</span>
              <span>{formatDatePart(startDay)} 일</span>
            </div>
            <span className="body-4 mx-5">~</span>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={endYear}
                  onChange={handleEndYearChange}
                  className="body-4 h-[47px] w-[188px] appearance-none rounded-[10px] border border-[var(--color-gray-200)] bg-[var(--color-white)] px-5 text-[var(--color-gray-500)] outline-none"
                >
                  <option value="">년도</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year} 년도
                    </option>
                  ))}
                </select>
                <img
                  src={chevronIcon}
                  className="pointer-events-none absolute top-1/2 right-5 h-[7px] w-[15px] -translate-y-1/2"
                />
              </div>
              <div className="relative">
                <select
                  value={endMonth}
                  onChange={handleEndMonthChange}
                  disabled={!endYear}
                  className="body-4 h-[47px] w-[132px] appearance-none rounded-[10px] border border-[var(--color-gray-200)] bg-[var(--color-white)] px-5 text-[var(--color-gray-500)] outline-none disabled:cursor-not-allowed"
                >
                  <option value="">월</option>
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>
                      {month} 월
                    </option>
                  ))}
                </select>
                <img
                  src={chevronIcon}
                  className="pointer-events-none absolute top-1/2 right-5 h-[7px] w-[15px] -translate-y-1/2"
                />
              </div>
              <div className="relative">
                <select
                  value={endDay}
                  onChange={(event) => setEndDay(event.target.value)}
                  disabled={!endMonth}
                  className="body-4 h-[47px] w-[132px] appearance-none rounded-[10px] border border-[var(--color-gray-200)] bg-[var(--color-white)] px-5 text-[var(--color-gray-500)] outline-none disabled:cursor-not-allowed"
                >
                  <option value="">일</option>
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>
                      {day} 일
                    </option>
                  ))}
                </select>
                <img
                  src={chevronIcon}
                  className="pointer-events-none absolute top-1/2 right-5 h-[7px] w-[15px] -translate-y-1/2"
                />
              </div>
            </div>
            <span className="body-4 ml-auto">{totalDays ? `총 ${totalDays}일` : '총 0일'}</span>
          </div>

          <div className="mt-[44px] flex justify-center">
            <OutlineButton
              type="submit"
              variant="dark"
              disabled={isSubmitting}
              className="h-[45px] w-[255px]"
            >
              {isSubmitting ? '프로젝트 생성 중' : '프로젝트 만들기'}
            </OutlineButton>
          </div>
          {errorMessage && (
            <p className="body-5 mt-3 text-center text-[var(--color-red)]">{errorMessage}</p>
          )}
        </div>
      </form>
    </main>
  );
}

export default ProjectCreatePage;
