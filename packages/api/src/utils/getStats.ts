import getProfiles from './getProfiles';
import { Stats, UserVote } from '../types/vote';
import { getFirestore } from 'firebase-admin/firestore';

export default async function getStats({
  year,
  week,
}: {
  year: number;
  week?: number;
}): Promise<Stats> {
  const profiles = await getProfiles();
  let query = getFirestore().collectionGroup('votes').where('year', '==', year);

  if (week) {
    query = query.where('week', '==', week);
  }

  const votes = await query.get();

  const allVotes = votes.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<UserVote, 'id'>),
  }));

  const busiestWeek = Object.entries(
    allVotes.reduce<Record<number, number>>(
      (acc, { week }) => ({ ...acc, [week]: acc[week] ? acc[week] + 1 : 1 }),
      {}
    )
  ).reduce(
    ([highestWeek, highest], [week, votes]) =>
      votes > highest ? [Number(week), votes] : [highestWeek, highest],
    [0, 0]
  ) as [number, number];

  const profileWithStats = profiles
    .map((profile) => ({
      ...profile,
      totalVotes: allVotes.filter(({ voter }) => voter.id === profile.id)
        .length,
      totalVoted: allVotes.filter(({ voted }) => voted.id === profile.id)
        .length,
    }))
    .filter(({ totalVotes, totalVoted }) => totalVotes || totalVoted);

  const highestVoted = profileWithStats.reduce(
    (highest, { totalVoted }) => (totalVoted > highest ? totalVoted : highest),
    0
  );

  const highestVotes = profileWithStats.reduce(
    (highest, { totalVotes }) => (totalVotes > highest ? totalVotes : highest),
    0
  );

  const totalParticipation = profileWithStats.filter(
    ({ totalVotes }) => totalVotes > 0
  ).length;

  const totalVoted = Object.entries(
    allVotes.reduce(
      (acc, { week, voter }) => ({ ...acc, [`${week}:${voter.id}`]: true }),
      {}
    )
  ).length;

  const totalVotes = allVotes.length;

  return {
    busiestWeek,
    highestVoted,
    highestVotes,
    profileWithStats,
    totalParticipation,
    totalVoted,
    totalVotes,
  };
}
