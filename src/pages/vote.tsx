import React, { useEffect, useState } from 'react';
import { Poll as PollIcon } from '@mui/icons-material';
import { IconButton, LinearProgress } from '@mui/material';
import Link from 'next/link';
import pluralize from 'pluralize';
import { getLayout } from 'components/Layout';
import VoteButton from 'components/VoteButton';
import WeekNavigation from 'components/WeekNavigation';
import WeekRangeLabel from 'components/WeekRangeLabel';
import useFirebase from 'hooks/useFirebase';
import useProfiles from 'hooks/useProfiles';
import useVotes from 'hooks/useVotes';
import useWeek from 'hooks/useWeek';
import { UserVote } from 'types/vote';

export default function VotePage() {
  const [loading, setLoading] = useState(false);
  const [votes, setVotes] = useState<UserVote[]>([]);
  const { user, getConfig } = useFirebase();
  const MAX_VOTES_PER_USER = getConfig<number>('MAX_VOTES_PER_USER', 5);
  const profiles = useProfiles();
  const { getVotes } = useVotes();
  const { currentWeek, currentYear } = useWeek();

  const userVotes = votes
    .filter(({ voter }) => voter.id === user?.uid)
    .map(({ voted }) => voted.id);

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
    <div className="flex flex-col gap-8">
      <div className="hidden sm:block">
        <WeekNavigation hidePrevWeek hideNextWeek />
      </div>

      <div>
        <WeekRangeLabel year={currentYear} week={currentWeek} />

        <h1 className="flex gap-2 items-center justify-between font-light text-5xl">
          <span>
            Vote
            <span className="hidden sm:inline">
              {' '}
              the <span className="font-bold">GOAT</span>s
            </span>
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
              <PollIcon className="!text-3xl" />
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
