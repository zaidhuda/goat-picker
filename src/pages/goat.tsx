import React from 'react';
import pluralize from 'pluralize';
import { useRouter } from 'next/router';

import useWeek from 'hooks/useWeek';
import useOptions from 'hooks/useOptions';
import Ranking from 'components/Ranking';
import { getLayout } from 'components/Layout';
import WeekNavigation from 'components/WeekNavigation';
import { DateTime } from 'luxon';

export default function GoatPage() {
  const { currentWeek, currentYear } = useWeek();
  const {
    query: { week: weekParam = currentWeek, year: yearParam = currentYear },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

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
    <div className="space-y-8">
      <WeekNavigation
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

        <h1 className="font-light text-5xl">
          <strong className="font-bold">GOAT</strong>s
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
