import React from 'react';
import Link from 'next/link';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import { useRouter } from 'next/router';
import useWeek from 'hooks/useWeek';

export default function WeekNavigation() {
  const { getPrevWeek, getNextWeek } = useWeek();
  const {
    query: { week: weekParam, year: yearParam },
  } = useRouter();
  const week = Number(weekParam);
  const year = Number(yearParam);

  const prevWeekPath = () => {
    const { week: prevWeek, year: prevYear } = getPrevWeek(year, week);
    return `/attendances?year=${prevYear}&week=${prevWeek}`;
  };

  const nextWeekPath = () => {
    const { week: nextWeek, year: nextYear } = getNextWeek(year, week);
    return `/attendances?year=${nextYear}&week=${nextWeek}`;
  };

  return (
    <div className="flex justify-between">
      {prevWeekPath && (
        <Link href={prevWeekPath()}>
          <a className="flex items-center">
            <NavigateBefore fontSize="large" />
            <span className="text-sm sm:text-lg w-14 sm:w-32">
              Previous Week
            </span>
          </a>
        </Link>
      )}
      <h1 className="font-medium text-lg sm:text-5xl">Week {week}</h1>
      {nextWeekPath && (
        <Link href={nextWeekPath()}>
          <a className="flex items-center">
            <span className="text-sm sm:text-lg w-14 sm:w-32 text-right">
              Next Week
            </span>
            <NavigateNext fontSize="large" />
          </a>
        </Link>
      )}
    </div>
  );
}
