import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import pluralize from 'pluralize';
import { IconButton, LinearProgress } from '@mui/material';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumberedRtl';
import VoteButton from 'components/VoteButton';
import { getLayout } from 'components/Layout';
import useWeek from 'hooks/useWeek';
import useVotes from 'hooks/useVotes';
import useFirebase from 'hooks/useFirebase';
import useProfiles from 'hooks/useProfiles';
import { UserVote } from 'types/vote';

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
      <div>
        <h1 className="flex gap-2 items-baseline sm:items-center justify-between font-light text-5xl">
          <span>
            Vote the <span className="font-bold">GOAT</span>s
          </span>

          <Link
            href={{
              pathname: '/goat',
              query: { week: currentWeek, year: currentYear },
            }}
            passHref
          >
            <IconButton
              color="primary"
              title="Standings"
              className="outline outline-offset-0 focus:outline-2"
            >
              <FormatListNumberedIcon className="!text-3xl" />
            </IconButton>
          </Link>
        </h1>

        <p className="font-thin text-sm mt-1">
          {availableVotes > 0
            ? `You have ${pluralize('vote', availableVotes, true)} left`
            : 'You have used all your votes'}
        </p>
      </div>

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
