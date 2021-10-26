import React, { useEffect, useState } from 'react';

import Ranking from 'components/Ranking';
import { getLayout } from 'components/Layout';
import useVotes from 'hooks/useVotes';
import useProfiles from 'hooks/useProfiles';
import useOptions from 'hooks/useOptions';
import { UserVote } from 'types/vote';
import useWeek from 'hooks/useWeek';

export default function UpcomingPage() {
  const [votes, setVotes] = useState<UserVote[]>([]);
  const profiles = useProfiles();
  const { getVotes } = useVotes();
  const { votedOptions } = useOptions(profiles, votes);

  const { currentWeek, currentYear } = useWeek();

  useEffect(() => {
    return getVotes(currentYear, currentWeek, setVotes);
  }, [getVotes, currentYear, currentWeek]);

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
