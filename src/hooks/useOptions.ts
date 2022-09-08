import { useEffect, useMemo, useState } from 'react';
import { Profile } from 'types/profile';
import { UserVote } from 'types/vote';
import useProfiles from './useProfiles';
import useVotes from './useVotes';

const useOptions = (year: number, week: number) => {
  const profiles = useProfiles();
  const { getVotes } = useVotes();
  const [votes, setVotes] = useState<UserVote[]>([]);

  const participants = useMemo(() => {
    const groupedVotes = votes.reduce<{ [key in string]: number }>(
      (res, vote) => ({
        ...res,
        [vote.voter.id]: (res[vote.voter.id] || 0) + 1,
      }),
      {}
    );

    return Object.keys(groupedVotes).map((id) => ({
      ...profiles.find((profile) => profile.id === id),
      votes: groupedVotes[id],
    }));
  }, [votes, profiles]);

  const votedOptions = useMemo(() => {
    const groupedVotes = votes.reduce<{ [key in string]: number }>(
      (res, vote) => ({
        ...res,
        [vote.voted.id]: (res[vote.voted.id] || 0) + 1,
      }),
      {}
    );

    return Object.keys(groupedVotes).map((id) => ({
      ...(profiles.find((profile) => profile.id === id) as Profile),
      votes: groupedVotes[id],
    }));
  }, [votes, profiles]);

  useEffect(() => {
    return getVotes(year, week, setVotes);
  }, [getVotes, week, year]);

  return {
    participants,
    votedOptions,
  };
};;

export default useOptions;
