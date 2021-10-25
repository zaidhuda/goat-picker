import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useFirebase from '../hooks/useFirebase';
import useWeek from '../hooks/useWeek';
import useOptions from '../hooks/useOptions';

import Ranking from '../components/Ranking';
import WeekNavigation from '../components/Attendance/WeekNavigation';
import { getLayout } from '../components/Layout';

export default function GoatPage() {
  const { currentWeek, currentYear, getPrevWeek, getNextWeek } = useWeek();
  const { options, getVotes } = useFirebase();
  const {
    query: { week: weekParam, year: yearParam },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

  const [votes, setVotes] = useState([]);

  const { votedOptions } = useOptions(options, votes);

  const prevWeekPath = () => {
    const { week: prevWeek, year: prevYear } = getPrevWeek(year, week);
    return `/goat?year=${prevYear}&week=${prevWeek}`;
  };

  const nextWeekPath = () => {
    const { week: nextWeek, year: nextYear } = getNextWeek(year, week);
    return `/goat?year=${nextYear}&week=${nextWeek}`;
  };

  useEffect(() => {
    setVotes([]);
    getVotes(year, week, setVotes);
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
