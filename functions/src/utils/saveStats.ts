import { firestore } from 'firebase-admin';
import { AnnualStats } from '../types/vote';

const VOTES = 'votes';

export default async function saveStats(
  year: number,
  stats: AnnualStats
): Promise<void> {
  await firestore()
    .collection(VOTES)
    .doc(`${year}`)
    .set(stats, { merge: true });
}
