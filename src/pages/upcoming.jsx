import React from 'react';

import useFirebase from '../hooks/useFirebase';
import useOptions from '../hooks/useOptions';

import Ranking from '../components/Ranking';
import { getLayout } from '../components/Layout';

export default function UpcomingPage() {
  const { options, currentWeekVotes } = useFirebase();
  const { votedOptions } = useOptions(options, currentWeekVotes);

  return (
    <div className="space-y-12">
      <h1 className="font-light text-4xl">
        Upcoming <span className="font-bold">GOAT</span>s
      </h1>

      <Ranking options={votedOptions} />
    </div>
  );
}

UpcomingPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Upcoming GOATs' },
};
