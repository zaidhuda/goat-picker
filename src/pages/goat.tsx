import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useWeek from 'hooks/useWeek';

import Ranking from 'components/Ranking';
import { getLayout } from 'components/Layout';
import useVotes from 'hooks/useVotes';
import useProfiles from 'hooks/useProfiles';
import useOptions from 'hooks/useOptions';
import { UserVote } from 'types/vote';
import WeekNavigation from 'components/WeekNavigation';

export default function GoatPage() {
  const { currentWeek, currentYear, getPrevWeek, getNextWeek } = useWeek();
  const profiles = useProfiles();
  const { getVotes } = useVotes();
  const {
    query: { week: weekParam = currentWeek, year: yearParam = currentYear },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

  const [votes, setVotes] = useState<UserVote[]>([]);

  const { votedOptions } = useOptions(profiles, votes);

  const prevWeekPath = () => {
    const { week: prevWeek, year: prevYear } = getPrevWeek(year, week);
    return `/goat?year=${prevYear}&week=${prevWeek}`;
  };

  const nextWeekPath = () => {
    const { week: nextWeek, year: nextYear } = getNextWeek(year, week);
    return `/goat?year=${nextYear}&week=${nextWeek}`;
  };

  const isCurrentWeek = year === currentYear && week === currentWeek;

  useEffect(() => {
    return getVotes(year, week, setVotes);
  }, [getVotes, week, year]);

  return (
    <div className="space-y-8">
      <WeekNavigation
        prevWeekPath={prevWeekPath}
        nextWeekPath={
          !(week > currentWeek - 1 && year <= currentYear)
            ? nextWeekPath
            : undefined
        }
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
