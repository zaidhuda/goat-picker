import React from 'react';
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

  const { votedOptions } = useOptions(year, week);

  return (
    <div className="space-y-8">
      <WeekNavigation
        hideNextWeek={week > currentWeek - 1 && year === currentYear}
      />

      <h1 className="font-light text-5xl">
        <strong className="font-bold">GOAT</strong>s
        {isCurrentWeek ? null : <> of week {week}</>}
      </h1>

      <Ranking options={votedOptions} />
    </div>
  );
}

GoatPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'GOATs' },
};
