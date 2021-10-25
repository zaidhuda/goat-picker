import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';

import useFirebase from '../hooks/useFirebase';
import useWeek from '../hooks/useWeek';
import useOptions from '../hooks/useOptions';

import Ranking from '../components/Ranking';
import { getLayout } from '../components/Layout';

const WeekNavigation = ({ prevWeekPath, nextWeekPath }) => (
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

WeekNavigation.propTypes = {
  prevWeekPath: PropTypes.func,
  nextWeekPath: PropTypes.func,
};

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
