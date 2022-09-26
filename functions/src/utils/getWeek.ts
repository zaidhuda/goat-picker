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

  const lastWeek = now.minus({ weeks: 1 });
  const previousYear = lastWeek.weekYear;
  const previousWeek = lastWeek.weekNumber;

  return {
    year,
    week,
    previousYear,
    previousWeek,
  };
}
