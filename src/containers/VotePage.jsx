import React from 'react';

import useFirebase from '../hooks/useFirebase';

import withUser from '../components/withUser';
import VoteButton from '../components/VoteButton';

const VotePage = () => {
  const {
    user: { uid: userId },
    options,
    currentWeekVotes,
  } = useFirebase();

  const userVotes =
    currentWeekVotes.find(({ id }) => id === userId)?.votes || [];

  const optionsWithoutUser = options.filter(({ id }) => id !== userId);

  const sortedOptions = optionsWithoutUser.sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  );

  const optionsWithVoted = sortedOptions.map((option) => ({
    ...option,
    voted: userVotes.some((votedId) => votedId === option.id),
  }));

  return (
    <div className="space-y-12">
      <h1 className="font-light text-4xl">
        Decide the next <span className="font-bold">GOAT</span>s
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {optionsWithVoted.map((option) => (
          <VoteButton key={option.id} {...option} />
        ))}
      </div>
    </div>
  );
};

export default withUser(VotePage);
