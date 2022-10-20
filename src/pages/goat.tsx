import React from 'react';
import { Ballot as BallotIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import pluralize from 'pluralize';
import { getLayout } from 'components/Layout';
import Ranking from 'components/Ranking';
import WeekNavigation from 'components/WeekNavigation';
import WeekRangeLabel from 'components/WeekRangeLabel';
import useWeek from 'hooks/useWeek';
import useWeeklyStats from 'hooks/useWeeklyStats';

export default function GoatPage() {
  const { currentWeek, currentYear, getPrevWeek } = useWeek();
  const prevWeek = getPrevWeek(currentYear, currentWeek);
  const {
    query: { week: weekParam = prevWeek.week, year: yearParam = prevWeek.year },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

  const isCurrentWeek = week === currentWeek;

  const stats = useWeeklyStats(year, week);

  return (
    <div className="flex flex-col gap-8 pb-12 sm:pb-0">
      <WeekNavigation
        defaultWeek={week}
        defaultYear={year}
        hideNextWeek={week > currentWeek - 1 && year === currentYear}
      />

      <div>
        <WeekRangeLabel year={year} week={week} />

        <h1 className="flex gap-2 items-center justify-between font-light text-5xl">
          <span>
            <strong className="font-bold">GOAT</strong>s
          </span>
          {isCurrentWeek ? (
            <Link href="/vote" passHref>
              <IconButton
                color="primary"
                title="Vote"
                className="outline outline-offset-0 focus:outline-2"
              >
                <BallotIcon className="!text-3xl" />
              </IconButton>
            </Link>
          ) : null}
        </h1>

        <p className="font-thin text-sm mt-1">
          {stats?.totalParticipation
            ? `Voted by ${pluralize('person', stats.totalParticipation, true)}`
            : 'No votes'}
        </p>
      </div>

      <Ranking profiles={stats?.profileWithStats} />

      {!isCurrentWeek ? (
        <Link href={{ pathname: '/stats', query: { year } }}>
          <a className="font-light italic text-gray-300 dark:text-gray-700 text-sm">
            view stats
          </a>
        </Link>
      ) : null}
    </div>
  );
}

GoatPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'GOATs' },
};
