import { useEffect, useMemo, useState } from 'react';
import { UserVote } from 'types/vote';
import useProfiles from './useProfiles';
import useVotes from './useVotes';

const useOptions = (year: number, week: number) => {
  const profiles = useProfiles();
  const { getVotes } = useVotes();
  const [votes, setVotes] = useState<UserVote[]>([]);

  const groupedVotes = useMemo(
    () =>
      votes
        .flatMap(({ votes = [] }) => votes)
        .reduce<{ [key in string]: number }>(
          (res, vote) => ({ ...res, [vote]: (res[vote] || 0) + 1 }),
          {}
        ),
    [votes]
  );

  const profileWithVotes = useMemo(
    () =>
      profiles.map((option) => ({
        ...option,
        votes: groupedVotes[option.id],
        voted: !!votes.find(({ id }) => id === option.id)?.votes,
      })),
    [profiles, groupedVotes]
  );

  const votedOptions = useMemo(
    () => profileWithVotes.filter(({ votes }) => votes),
    [profileWithVotes]
  );

  useEffect(() => {
    return getVotes(year, week, setVotes);
  }, [getVotes, week, year]);

  return {
    profileWithVotes,
    votedOptions,
  };
};

export default useOptions;
