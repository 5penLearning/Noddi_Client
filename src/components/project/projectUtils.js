const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const getDateAtMidnight = (dateValue) => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return null;

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getProjectDayLabel = (project) => {
  const today = getDateAtMidnight(new Date());
  const deadline = getDateAtMidnight(project.endDate ?? project.deadline ?? project.dueDate);

  if (deadline) {
    const remainingDays = Math.max(0, Math.ceil((deadline - today) / MILLISECONDS_PER_DAY));

    return `D-${remainingDays}`;
  }

  const createdAt = getDateAtMidnight(project.createdAt);

  if (!createdAt) return 'D+0';

  const elapsedDays = Math.max(0, Math.floor((today - createdAt) / MILLISECONDS_PER_DAY));

  return `D+${elapsedDays}`;
};
