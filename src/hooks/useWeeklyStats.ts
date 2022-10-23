import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { AnnualStats, UserVote } from 'types/vote';
import useFirebase from './useFirebase';
import useVotes from './useVotes';
import useWeek from './useWeek';

export default function useWeeklyStats(year: number, week: number) {
  const [stats, setStats] =
    useState<Pick<AnnualStats, 'profileWithStats' | 'totalParticipation'>>();
  const { db, profiles } = useFirebase();
  const { currentWeek } = useWeek();
  const { getVotes } = useVotes();

  useEffect(() => {
    if (db && currentWeek !== week) {
      return onSnapshot(
        doc(db, `years/${year}/weeks/${week < 10 ? `0${week}` : `${week}`}`),
        (doc) => {
          setStats(doc.data() as AnnualStats);
        }
      );
    }

    return getVotes(year, week, (votes: UserVote[]) => {
      const groupedVotes = votes.reduce<
        Record<'voted' | 'votes', { [key in string]: number }>
      >(
        ({ votes, voted }, vote) => ({
          votes: {
            ...votes,
            [vote.voter.id]: (votes[vote.voter.id] || 0) + 1,
          },
          voted: {
            ...voted,
            [vote.voted.id]: (voted[vote.voted.id] || 0) + 1,
          },
        }),
        { votes: {}, voted: {} }
      );

      const profileWithStats =
        profiles
          ?.map((profile) => ({
            ...profile,
            totalVotes: groupedVotes.votes[profile.id] || 0,
            totalVoted: groupedVotes.voted[profile.id] || 0,
          }))
          .filter(({ totalVoted, totalVotes }) => totalVoted || totalVotes) ||
        [];

      setStats({
        totalParticipation: Object.keys(groupedVotes.votes).length,
        profileWithStats,
      });
    });
  }, [getVotes, db, profiles, currentWeek, week, year]);

  return stats;
}
