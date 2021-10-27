import React, { useEffect, useState } from 'react';

import VoteButton from 'components/VoteButton';
import { getLayout } from 'components/Layout';
import useVotes from 'hooks/useVotes';
import useFirebase from 'hooks/useFirebase';
import useProfiles from 'hooks/useProfiles';
import useWeek from 'hooks/useWeek';
import { UserVote } from 'types/vote';

export default function VotePage() {
  const [votes, setVotes] = useState<UserVote[]>([]);
  const { user } = useFirebase();
  const profiles = useProfiles();
  const { getVotes } = useVotes();
  const { currentWeek, currentYear } = useWeek();

  const userVotes = votes.find(({ id }) => id === user?.uid)?.votes || [];

  const optionsWithoutUser = profiles.filter(({ id }) => id !== user?.uid);

  const sortedOptions = optionsWithoutUser.sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  );

  const optionsWithVoted = sortedOptions.map((option) => ({
    ...option,
    voted: userVotes.some((votedId) => votedId === option.id),
  }));

  useEffect(() => {
    return getVotes(currentYear, currentWeek, setVotes);
  }, [getVotes, currentYear, currentWeek]);

  return (
    <div className="space-y-12">
      <h1 className="font-light text-4xl">
        Decide the next <span className="font-bold">GOAT</span>s
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {optionsWithVoted.map((option) => (
          <VoteButton key={option.id} {...option} />
        ))}
      </div>
    </div>
  );
}

VotePage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Vote for GOATs' },
};
