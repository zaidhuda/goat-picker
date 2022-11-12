import { AllMiddlewareArgs, AnyMiddlewareArgs } from '@slack/bolt';
import { Timestamp } from 'firebase-admin/firestore';
import { profileRef } from '../../utils/firestorePaths';
import getSlackAppUser from '../../utils/getSlackAppUser';

export default async function trackUserLastSeenOnSlack(
  args: AllMiddlewareArgs & Partial<AnyMiddlewareArgs>
) {
  if (args?.body?.user?.id) {
    const appUser = await getSlackAppUser(args.body.user.id);
    if (appUser) {
      await profileRef(appUser.id).set(
        { lastSeenOnSlackAt: Timestamp.now() },
        { merge: true }
      );
    }
  }

  await args.next();
}
