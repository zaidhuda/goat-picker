import React from 'react';
import Link from 'next/link';
import pluralize from 'pluralize';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

import useWeek from 'hooks/useWeek';
import useOptions from 'hooks/useOptions';
import Ranking from 'components/Ranking';
import { getLayout } from 'components/Layout';
import WeekNavigation from 'components/WeekNavigation';
import { IconButton } from '@mui/material';

export default function GoatPage() {
  const { currentWeek, currentYear, getPrevWeek } = useWeek();
  const prevWeek = getPrevWeek(currentYear, currentWeek);
  const {
    query: { week: weekParam = prevWeek.week, year: yearParam = prevWeek.year },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

  const isCurrentWeek = week === currentWeek;

  const { profileWithVotes, votedOptions } = useOptions(year, week);

  const participants = profileWithVotes.filter(({ voted }) => voted);

  const fromDate = DateTime.fromObject({
    weekYear: year,
    weekNumber: week,
    weekday: 1,
  });

  const toDate = DateTime.fromObject({
    weekYear: year,
    weekNumber: week,
    weekday: 7,
  });

  return (
    <div className="flex flex-col gap-8 pb-12 sm:pb-0">
      <WeekNavigation
        defaultWeek={week}
        defaultYear={year}
        hideNextWeek={week > currentWeek - 1 && year === currentYear}
      />

      <div>
        <p>
          {fromDate.toLocaleString({ day: 'numeric', month: 'short' })} -{' '}
          {toDate.toLocaleString({
            day: 'numeric',
            month: 'short',
            year: '2-digit',
          })}
        </p>

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
                <PlaylistAddCheckIcon className="!text-3xl" />
              </IconButton>
            </Link>
          ) : null}
        </h1>

        <p className="font-thin text-sm mt-1">
          {participants.length > 0
            ? `Voted by ${pluralize('person', participants.length, true)}`
            : 'No votes'}
        </p>
      </div>

      <Ranking options={votedOptions} />
    </div>
  );
}

GoatPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'GOATs' },
};
