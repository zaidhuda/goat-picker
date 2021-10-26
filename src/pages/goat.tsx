import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';

import useWeek from 'hooks/useWeek';

import Ranking from 'components/Ranking';
import { getLayout } from 'components/Layout';
import useVotes from 'hooks/useVotes';
import useProfiles from 'hooks/useProfiles';
import useOptions from 'hooks/useOptions';
import { UserVote } from 'types/vote';

const WeekNavigation = ({
  prevWeekPath,
  nextWeekPath,
}: {
  prevWeekPath?: () => string;
  nextWeekPath?: () => string;
}) => (
  <div className="flex gap-8">
    {prevWeekPath ? (
      <Link href={prevWeekPath()}>
        <a className="flex items-center">
          <NavigateBefore fontSize="large" />
          <span>Previous Week</span>
        </a>
      </Link>
    ) : null}
    {nextWeekPath ? (
      <Link href={nextWeekPath()}>
        <a className="flex items-center">
          <span>Next Week</span>
          <NavigateNext fontSize="large" />
        </a>
      </Link>
    ) : null}
  </div>
);

export default function GoatPage() {
  const { currentWeek, currentYear, getPrevWeek, getNextWeek } = useWeek();
  const profiles = useProfiles();
  const { getVotes } = useVotes();
  const {
    query: { week: weekParam, year: yearParam },
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

  useEffect(() => {
    return getVotes(year, week, setVotes);
  }, [getVotes, week, year]);

  return (
    <div className="space-y-8">
      <WeekNavigation
        prevWeekPath={prevWeekPath}
        nextWeekPath={
          !(week > currentWeek - 2 && year === currentYear)
            ? nextWeekPath
            : undefined
        }
      />

      <h1 className="font-light text-5xl">
        <span className="font-bold">GOAT</span>s of week {week}
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
