import { DateTime } from 'luxon';

const useWeek = () => {
  const now = DateTime.now();
  const currentYear = now.weekYear;
  const currentWeek = now.weekNumber;

  const getPrevWeek = (
    year: number = currentYear,
    week: number = currentWeek
  ) => {
    const date = DateTime.fromObject({
      weekYear: year,
      weekNumber: week,
    }).minus({ weeks: 1 });

    return { year: date.weekYear, week: date.weekNumber };
  };

  const getNextWeek = (
    year: number = currentYear,
    week: number = currentWeek
  ) => {
    const date = DateTime.fromObject({
      weekYear: year,
      weekNumber: week,
    }).plus({ weeks: 1 });

    return { year: date.weekYear, week: date.weekNumber };
  };

  return {
    getPrevWeek,
    getNextWeek,
    currentWeek,
    currentYear,
  };
};

export default useWeek;
