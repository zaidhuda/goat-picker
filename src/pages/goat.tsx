import React from 'react';
import pluralize from 'pluralize';
import { useRouter } from 'next/router';

import useWeek from 'hooks/useWeek';
import useOptions from 'hooks/useOptions';
import Ranking from 'components/Ranking';
import { getLayout } from 'components/Layout';
import WeekNavigation from 'components/WeekNavigation';

export default function GoatPage() {
  const { currentWeek, currentYear } = useWeek();
  const {
    query: { week: weekParam = currentWeek, year: yearParam = currentYear },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);
  const isCurrentWeek = year === currentYear && week === currentWeek;

  const { profileWithVotes, votedOptions } = useOptions(year, week);

  const participants = profileWithVotes.filter(({ voted }) => voted);

  return (
    <div className="space-y-8">
      <WeekNavigation
        hideNextWeek={week > currentWeek - 1 && year === currentYear}
      />

      <h1 className="font-light text-5xl">
        <strong className="font-bold">GOAT</strong>s
        {isCurrentWeek ? null : <> of week {week}</>}
      </h1>

      <p className="font-thin text-sm !mt-2">
        {participants.length > 0
          ? `Voted by ${pluralize('person', participants.length, true)}`
          : 'No votes'}
      </p>

      <Ranking options={votedOptions} />
    </div>
  );
}

GoatPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'GOATs' },
};
