import React, { ReactNode } from 'react';
import Link from 'next/link';
import NavigateNext from '@mui/icons-material/NavigateNext';
import NavigateBefore from '@mui/icons-material/NavigateBefore';

interface Props {
  children?: ReactNode;
  prevWeekPath?: () => string;
  nextWeekPath?: () => string;
}

export default function WeekNavigation({
  children,
  prevWeekPath,
  nextWeekPath,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 sm:gap-8">
      {prevWeekPath && (
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
      {nextWeekPath && (
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
