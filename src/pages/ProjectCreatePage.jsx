import { useState } from 'react';

import OutlineButton from '../components/common/OutlineButton';
import ProjectMemberModal from '../components/common/ProjectMemberModal';
import ProjectTeamSetupCard from '../components/common/ProjectTeamSetupCard';
import {
  projectCreateTeamsMockData,
  projectMemberModalMockData,
} from '../mocks/projectPageData';

import chevronIcon from '../assets/icons/profile/chevron.svg';
import clearXIcon from '../assets/icons/project-create/clear-x.svg';
import addHorizontalIcon from '../assets/icons/project-create/add-horizontal.svg';
import addVerticalIcon from '../assets/icons/project-create/add-vertical.svg';

const projectColors = Array.from({ length: 12 }, (_, index) => ({
  id: `project-color-${index + 1}`,
  color: '#d9d9d9',
}));

const formatDatePart = (value) => String(value).padStart(2, '0');

function ProjectCreatePage() {
  const [startDate] = useState(() => new Date());
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [teams, setTeams] = useState(projectCreateTeamsMockData);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [endYear, setEndYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const startDay = startDate.getDate();
  const yearOptions = Array.from(
    { length: 11 },
    (_, index) => startYear + index,
  );
  const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1);
  const daysInEndMonth = endYear && endMonth
    ? new Date(Number(endYear), Number(endMonth), 0).getDate()
    : 31;
  const dayOptions = Array.from(
    { length: daysInEndMonth },
    (_, index) => index + 1,
  );
  const endDate = endYear && endMonth && endDay
    ? new Date(Number(endYear), Number(endMonth) - 1, Number(endDay))
    : null;
  const startDateAtMidnight = new Date(startYear, startMonth - 1, startDay);
  const totalDays = endDate && endDate >= startDateAtMidnight
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

  const handleRemoveTeam = (teamId) => {
    setTeams((currentTeams) => (
      currentTeams.filter((team) => team.id !== teamId)
    ));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="h-full overflow-y-auto rounded-[10px] bg-[var(--color-white)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid min-h-[970px] w-full max-w-[1347px] grid-cols-[283px_887px] gap-x-[46px] px-[46px] pb-[44px] pt-[79px]"
      >
        <section>
          <h2 className="body-4 tracking-[-0.16px]">대표 컬러 선정</h2>
          <div className="mx-auto mt-[34px] size-[117px] rounded-full bg-[#d9d9d9]" />
          <div className="mt-[29px] grid grid-cols-6 gap-x-3 gap-y-[15px] px-[9px]">
            {projectColors.map((projectColor) => (
              <button
                key={projectColor.id}
                type="button"
                style={{ backgroundColor: projectColor.color }}
                className="size-[26px] rounded-full"
              />
            ))}
          </div>
        </section>

        <div>
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
              <span className="absolute left-0.5 top-0.5 size-5 rounded-[5px] border-[1.5px] border-[var(--color-gray-400)]" />
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
              className="absolute right-5 top-[10px] flex size-6 items-center justify-center"
            >
              <span className="absolute left-0.5 top-0.5 size-5 rounded-[5px] border-[1.5px] border-[var(--color-gray-400)]" />
              <img src={clearXIcon} className="size-[6px]" />
            </button>
            <span className="body-4 absolute right-[64px] top-1/2 -translate-y-1/2 tracking-[-0.16px] text-[var(--color-gray-500)]">
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
                    <option key={year} value={year}>{year} 년도</option>
                  ))}
                </select>
                <img src={chevronIcon} className="pointer-events-none absolute right-5 top-1/2 h-[7px] w-[15px] -translate-y-1/2" />
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
                    <option key={month} value={month}>{month} 월</option>
                  ))}
                </select>
                <img src={chevronIcon} className="pointer-events-none absolute right-5 top-1/2 h-[7px] w-[15px] -translate-y-1/2" />
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
                    <option key={day} value={day}>{day} 일</option>
                  ))}
                </select>
                <img src={chevronIcon} className="pointer-events-none absolute right-5 top-1/2 h-[7px] w-[15px] -translate-y-1/2" />
              </div>
            </div>
            <span className="body-4 ml-auto">
              {totalDays ? `총 ${totalDays}일` : '총 0일'}
            </span>
          </div>

          <h2 className="body-4 mt-[47px] tracking-[-0.16px]">팀/팀장 설정</h2>
          <div className="mt-[12px] flex flex-wrap items-center gap-3">
            {teams.map((team) => (
              <ProjectTeamSetupCard
                key={team.id}
                team={team}
                onRemove={handleRemoveTeam}
              />
            ))}
            <button
              type="button"
              onClick={() => setIsMemberModalOpen(true)}
              className="relative ml-[-1px] flex size-9 items-center justify-center rounded-full bg-[var(--color-gray-200)]"
            >
              <span className="relative size-6">
                <img
                  src={addHorizontalIcon}
                  className="absolute left-1/2 top-1/2 h-[1.5px] w-[7.5px] -translate-x-1/2 -translate-y-1/2 brightness-0 invert"
                />
                <img
                  src={addVerticalIcon}
                  className="absolute left-1/2 top-1/2 h-[1.5px] w-[7.5px] -translate-x-1/2 -translate-y-1/2 rotate-90 brightness-0 invert"
                />
              </span>
            </button>
          </div>

          <div className="mt-[44px] flex justify-center">
            <OutlineButton
              type="submit"
              variant="dark"
              className="h-[45px] w-[255px]"
            >
              프로젝트 만들기
            </OutlineButton>
          </div>
        </div>
      </form>
      {isMemberModalOpen && (
        <ProjectMemberModal
          data={projectMemberModalMockData}
          onClose={() => setIsMemberModalOpen(false)}
        />
      )}
    </main>
  );
}

export default ProjectCreatePage;
