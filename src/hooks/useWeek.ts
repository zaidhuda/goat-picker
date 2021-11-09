import { DateTime } from 'luxon';

const useWeek = () => {
  const now = DateTime.now();
  const currentYear = now.year;
  const currentWeek = now.weekNumber;

  const getPrevWeek = (year = currentYear, week = currentWeek) => {
    const firstWeek = week === 1;
    const previousYear = firstWeek ? year - 1 : year;
    const previousWeek = firstWeek
      ? DateTime.local(previousYear, 2).weeksInWeekYear
      : week - 1;

    return { year: previousYear, week: previousWeek };
  };

  const getNextWeek = (year = currentYear, week = currentWeek) => {
    const lastWeek = week === DateTime.local(year, 2).weeksInWeekYear;
    const nextYear = lastWeek ? year + 1 : year;
    const nextWeek = lastWeek ? 1 : week + 1;

    return { year: nextYear, week: nextWeek };
  };

  return {
    getPrevWeek,
    getNextWeek,
    currentWeek,
    currentYear,
  };
};

export default useWeek;
