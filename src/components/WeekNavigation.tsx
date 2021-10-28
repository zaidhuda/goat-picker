import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NavigateNext from '@mui/icons-material/NavigateNext';
import NavigateBefore from '@mui/icons-material/NavigateBefore';
import useWeek from 'hooks/useWeek';

interface Props {
  children?: ReactNode;
  hidePrevWeek?: boolean;
  hideNextWeek?: boolean;
}

export default function WeekNavigation({
  children,
  hidePrevWeek,
  hideNextWeek,
}: Props) {
  const { currentWeek, currentYear, getPrevWeek, getNextWeek } = useWeek();
  const {
    query: { week: weekParam = currentWeek, year: yearParam = currentYear },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

  const prevWeekPath = () => ({ query: getPrevWeek(year, week) });
  const nextWeekPath = () => ({ query: getNextWeek(year, week) });

  return (
    <div className="flex items-center justify-between gap-4 sm:gap-8">
      {hidePrevWeek ? null : (
        <Link href={prevWeekPath()}>
          <a className="flex items-center">
            <NavigateBefore fontSize="large" />
            <span className="text-sm sm:text-lg">
              Previous<span className="hidden sm:inline"> Week</span>
            </span>
          </a>
        </Link>
      )}
      {children}
      {hideNextWeek ? null : (
        <Link href={nextWeekPath()}>
          <a className="flex items-center">
            <span className="text-sm sm:text-lg text-right">
              Next<span className="hidden sm:inline"> Week</span>
            </span>
            <NavigateNext fontSize="large" />
          </a>
        </Link>
      )}
    </div>
  );
}
