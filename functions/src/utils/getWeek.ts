import { DateTime } from 'luxon';

export default function getWeek(): {
  year: number;
  week: number;
  previousYear: number;
  previousWeek: number;
} {
  const now = DateTime.now();
  const year = now.weekYear;
  const week = now.weekNumber;
  const firstWeek = week === 1;
  const previousYear = firstWeek ? year - 1 : year;
  const previousWeek = firstWeek
    ? DateTime.local(previousYear, 2).weeksInWeekYear
    : week - 1;

  return {
    year,
    week,
    previousYear,
    previousWeek,
  };
}
