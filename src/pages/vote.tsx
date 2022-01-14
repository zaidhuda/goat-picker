import React, { useEffect, useState } from 'react';
import pluralize from 'pluralize';
import VoteButton from 'components/VoteButton';
import { getLayout } from 'components/Layout';
import useWeek from 'hooks/useWeek';
import useVotes from 'hooks/useVotes';
import useFirebase from 'hooks/useFirebase';
import useProfiles from 'hooks/useProfiles';
import { UserVote } from 'types/vote';
import { LinearProgress } from '@mui/material';

export default function VotePage() {
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState<UserVote[]>([]);
  const { user, getConfig } = useFirebase();
  const MAX_VOTES_PER_USER = getConfig<number>('MAX_VOTES_PER_USER', 5);
  const profiles = useProfiles();
  const { getVotes } = useVotes();
  const { currentWeek, currentYear } = useWeek();

  const userVotes = votes.find(({ id }) => id === user?.uid)?.votes || [];

  const optionsWithoutUser = profiles
    .filter(({ hidden }) => !hidden)
    .filter(({ id }) => id !== user?.uid);

  const availableVotes = Math.max(MAX_VOTES_PER_USER - userVotes.length);

  const sortedOptions = optionsWithoutUser.sort((a, b) =>
    a.displayName.localeCompare(b.displayName)
  );

  const optionsWithVoted = sortedOptions.map((option) => ({
    ...option,
    voted: userVotes.some((votedId) => votedId === option.id),
  }));

  useEffect(() => {
    setLoading(true);
    return getVotes(currentYear, currentWeek, (votes) => {
      setVotes(votes);
      setLoading(false);
    });
  }, [getVotes, currentYear, currentWeek]);

  return (
    <div className="space-y-12">
      <h1 className="font-light text-4xl">
        Decide the next <span className="font-bold">GOAT</span>s
      </h1>

      <p className="font-thin text-sm !mt-2">
        {availableVotes > 0
          ? `You have ${pluralize('vote', availableVotes, true)} left`
          : 'You have used all your votes'}
      </p>

      {loading ? (
        <LinearProgress />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {optionsWithVoted.map((option) => (
            <VoteButton
              key={option.id}
              {...option}
              disabled={availableVotes < 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

VotePage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Vote for GOATs' },
};
