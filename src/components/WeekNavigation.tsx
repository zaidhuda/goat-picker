import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import useWeek from 'hooks/useWeek';
import { Button } from '@mui/material';

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
          <a>
            <Button
              color="inherit"
              className="!normal-case"
              startIcon={<ArrowBackIosNew />}
            >
              <span>
                Prev<span className="hidden sm:inline"> Week</span>
              </span>
            </Button>
          </a>
        </Link>
      )}
      {children}
      {hideNextWeek ? null : (
        <Link href={nextWeekPath()}>
          <a className="flex items-center">
            <Button
              color="inherit"
              className="!normal-case"
              endIcon={<ArrowForwardIos />}
            >
              <span>
                Next<span className="hidden sm:inline"> Week</span>
              </span>
            </Button>
          </a>
        </Link>
      )}
    </div>
  );
}
