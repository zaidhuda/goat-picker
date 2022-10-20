import React from 'react';
import { Button } from '@mui/material';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import pluralize from 'pluralize';
import { getLayout } from 'components/Layout';
import Ranking from 'components/Ranking';
import useStats from 'hooks/useStats';

export default function GoatPage() {
  const {
    query: { year: yearParam = new Date().getFullYear() },
  } = useRouter();
  const [showMostVotes, setShowMostVotes] = React.useState(true);
  const [showMostVoted, setShowMostVoted] = React.useState(true);

  const year = Number(yearParam);
  const weeks = DateTime.local(year).weeksInWeekYear;
  const {
    busiestWeek = [0, 0],
    highestVoted,
    highestVotes,
    profileWithStats = [],
    totalParticipation = 0,
    totalVoted = 0,
    totalVotes = 0,
  } = useStats(year) || {};

  const mostVotes = profileWithStats.filter(
    ({ totalVotes }) => totalVotes === highestVotes
  );
  const mostVoted = profileWithStats.filter(
    ({ totalVoted }) => totalVoted === highestVoted
  );

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-bold text-5xl">A year in {year}</h1>

      <p className="text-xl">
        In total, <strong>{totalParticipation}</strong>{' '}
        {pluralize('person', totalParticipation)} participated in the voting
        throughout the year. They voted <strong>{totalVoted}</strong> times, for
        a total of <strong>{totalVotes}</strong> votes. On average,{' '}
        <strong>{Math.round(totalVotes / weeks)}</strong>{' '}
        {pluralize('person', Math.round(totalVotes / weeks))} voted every week.
        The busiest week was{' '}
        <Link
          href={{
            pathname: '/goat',
            query: { year: yearParam, week: busiestWeek[0] },
          }}
        >
          <a className="underline">
            week <strong>{busiestWeek[0]}</strong>
          </a>
        </Link>{' '}
        with <strong>{busiestWeek[1]}</strong>{' '}
        {pluralize('vote', busiestWeek[1])}.
      </p>

      <h2 className="font-semibold text-xl">
        The most voted {pluralize('person', mostVoted.length)}{' '}
        {pluralize('was', mostVoted.length)}:
        <Button
          className="!p-0 ml-2"
          onClick={() => setShowMostVoted((current) => !current)}
        >
          {showMostVoted ? 'All' : 'MVPs'}
        </Button>
      </h2>

      <Ranking
        profiles={profileWithStats
          .map((profile) => ({
            ...profile,
            votes: profile.totalVoted,
          }))
          .filter(({ totalVoted }) => totalVoted > 0)
          .filter(({ votes }) =>
            showMostVoted ? votes === highestVoted : true
          )}
      />

      <h2 className="font-semibold text-xl">
        The {pluralize('person', mostVotes.length)} that voted the most{' '}
        {pluralize('was', mostVotes.length)}:
        <Button
          className="!p-0 ml-2"
          onClick={() => setShowMostVotes((current) => !current)}
        >
          {showMostVotes ? 'All' : 'MVPs'}
        </Button>
      </h2>

      <Ranking
        profiles={profileWithStats
          .map((profile) => ({
            ...profile,
            votes: profile.totalVotes,
          }))
          .filter(({ hidden, totalVotes }) => !hidden || totalVotes > 0)
          .filter(({ votes }) =>
            showMostVotes ? votes === highestVotes : true
          )}
      />
    </div>
  );
}

GoatPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Stats' },
};
