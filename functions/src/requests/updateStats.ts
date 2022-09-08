import { firestore } from 'firebase-admin';
import { Request, Response } from 'firebase-functions/v1';
import getStats from '../utils/getStats';
import getWeek from '../utils/getWeek';

export default async function updateStats(
  req: Request,
  res: Response
): Promise<void> {
  const { year: currentYear } = getWeek();
  const { year = currentYear } = req.query;

  const stats = await getStats({ year: Number(year) });
  await firestore().doc(`years/${year}`).set(stats, { merge: true });

  res.status(200).end();
  return;
}
