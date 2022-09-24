import { firestore } from 'firebase-admin';
import { Request, Response } from 'firebase-functions/v1';
import { weekRef, yearRef } from '../utils/firestorePaths';
import getStats from '../utils/getStats';
import getWeek from '../utils/getWeek';

export default async function updateStats(
  req: Request,
  res: Response
): Promise<void> {
  const { year: currentYear, week: currentWeek } = getWeek();
  const { year = currentYear, week = currentWeek } = req.query;

  const bulk = firestore().bulkWriter();

  bulk.set(yearRef(Number(year)), await getStats({ year: Number(year) }), {
    merge: true,
  });

  bulk.set(
    weekRef(Number(year), Number(week)),
    await getStats({ year: Number(year), week: Number(week) }),
    { merge: true }
  );

  await bulk.close();

  res.status(200).end();
  return;
}
