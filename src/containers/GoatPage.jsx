import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useFirebase from '../hooks/useFirebase';
import useWeek from '../hooks/useWeek';
import useOptions from '../hooks/useOptions';

import withUser from '../components/withUser';
import Ranking from '../components/Ranking';
import WeekNavigation from '../components/WeekNavigation';

const GoatPage = () => {
  const { currentWeek, currentYear, getPrevWeek, getNextWeek } = useWeek();
  const { options, getVotes } = useFirebase();
  const { week: weekParam, year: yearParam } = useParams();

  const week = Number(weekParam);
  const year = Number(yearParam);

  let [votes, setVotes] = useState([]);

  const { votedOptions } = useOptions(options, votes);

  const prevWeekPath = () => {
    const { week: prevWeek, year: prevYear } = getPrevWeek(year, week);
    return `/goat/${prevYear}/${prevWeek}`;
  };

  const nextWeekPath = () => {
    const { week: nextWeek, year: nextYear } = getNextWeek(year, week);
    return `/goat/${nextYear}/${nextWeek}`;
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
};

export default withUser(GoatPage);
