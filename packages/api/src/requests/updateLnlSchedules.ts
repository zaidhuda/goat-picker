import { getFirestore } from 'firebase-admin/firestore';
import { Request, Response } from 'firebase-functions/v1';
import getLnlSchedules from '../utils/getLnlSchedules';

export default async function updateLnlSchedules(
  req: Request,
  res: Response
): Promise<void> {
  const schedules = await getLnlSchedules();
  await getFirestore().doc(`lnl/upcoming`).set({ schedules });

  res.status(200).end();
  return;
}
