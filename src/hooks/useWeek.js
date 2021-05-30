import { DateTime } from "luxon";

const useWeek = () => {
  const now = DateTime.now();
  const year = now.year;
  const week = now.weekNumber;
  const firstWeek = week === 1;

  const getLastWeek = () => {
    const lastYear = year - 1;
    const lastWeek = firstWeek
      ? DateTime.local(lastYear).weeksInWeekYear
      : week - 1;

    return { week: lastWeek, year: firstWeek ? lastYear : year };
  };

  return {
    getLastWeek,
    week,
    year,
  };
};

export default useWeek;
