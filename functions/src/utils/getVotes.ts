import { firestore } from 'firebase-admin';
import { UserVote } from '../types/vote';

const VOTES = 'votes';

export default async function getVotes(
  year: number,
  week: number
): Promise<UserVote[]> {
  const votes: UserVote[] = [];

  (await firestore().collection(`${VOTES}/${year}/${week}`).get()).forEach(
    (doc: firestore.QueryDocumentSnapshot) =>
      votes.push({
        id: doc.id,
        ...doc.data(),
      })
  );

  return votes;
}
