import React from 'react';
import { useRouter } from 'next/router';

import { getLayout } from 'components/Layout';
import useStats from 'hooks/useStats';
import pluralize from 'pluralize';
import Ranking from 'components/Ranking';
import { DateTime } from 'luxon';

export default function GoatPage() {
  const {
    query: { year: yearParam = new Date().getFullYear() },
  } = useRouter();

  const year = Number(yearParam);
  const weeks = DateTime.local(year).weeksInWeekYear;
  const {
    totalParticipation = 0,
    totalVotes = 0,
    totalVoted = 0,
    mostVoted = [],
    mostVotes = [],
  } = useStats(year) || {};

  return (
    <div className="space-y-8">
      <h1 className="font-bold text-5xl">A year in {year}</h1>

      <p className="text-xl">
        In total, <strong>{totalParticipation}</strong>{' '}
        {pluralize('person', totalParticipation)} participated in the voting
        throughout the year. They voted <strong>{totalVotes}</strong> times, for
        a total of <strong>{totalVoted}</strong> votes. On average,{' '}
        <strong>{Math.round(totalVoted / weeks)}</strong>{' '}
        {pluralize('person', Math.round(totalVoted / weeks))} voted every week.
      </p>

      <h2 className="font-semibold text-xl">
        The most voted {pluralize('person', mostVoted.length)}{' '}
        {pluralize('was', mostVoted.length)}:
      </h2>

      <Ranking
        options={mostVoted.map((profile) => ({
          ...profile,
          votes: profile.totalVoted,
        }))}
      />

      <h2 className="font-semibold text-xl">
        The {pluralize('person', mostVotes.length)} that voted the most{' '}
        {pluralize('was', mostVotes.length)}:
      </h2>

      <Ranking
        options={mostVotes.map((profile) => ({
          ...profile,
          votes: profile.totalVotes,
        }))}
      />
    </div>
  );
}

GoatPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Stats' },
};
