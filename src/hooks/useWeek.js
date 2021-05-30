import { DateTime } from "luxon";

const useWeek = () => {
  const now = DateTime.now();
  const currentYear = now.year;
  const currentWeek = now.weekNumber;

  const getPreviousWeek = (year = currentYear, week = currentWeek) => {
    const firstWeek = week === 1;
    const previousYear = year - 1;
    const previousWeek = firstWeek
      ? DateTime.local(previousYear).weeksInWeekYear
      : week - 1;

    return { week: previousWeek, year: firstWeek ? previousYear : year };
  };

  const getNextWeek = (year = currentYear, week = currentYear) => {
    const lastWeek = week === DateTime.local(year).weeksInWeekYear;
    const nextYear = year + 1;
    const nextWeek = lastWeek ? 1 : week + 1;

    return { week: nextWeek, year: lastWeek ? nextYear : year };
  };

  return {
    getPreviousWeek,
    getNextWeek,
    currentWeek,
    currentYear,
  };
};

export default useWeek;
