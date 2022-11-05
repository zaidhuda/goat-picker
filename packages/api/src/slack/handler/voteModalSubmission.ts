import {
  AllMiddlewareArgs,
  SlackViewMiddlewareArgs,
  ViewSubmitAction,
} from '@slack/bolt';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { profileRef, votesCollectionRef } from '../../utils/firestorePaths';
import getSlackAppUser from '../../utils/getSlackAppUser';
import getWeek from '../../utils/getWeek';

export default async function voteModalSubmission({
  ack,
  body: {
    user,
    view: {
      state: { values },
    },
  },
}: SlackViewMiddlewareArgs<ViewSubmitAction> &
  AllMiddlewareArgs): Promise<void> {
  const selected_users = values?.['vote-input']?.select?.selected_users || [];

  if (selected_users.includes(user.id)) {
    await ack({
      response_action: 'errors',
      errors: {
        'vote-input': 'You cannot vote for yourself',
      },
    });
  } else {
    await ack();

    const appUser = await getSlackAppUser(user.id);

    if (appUser) {
      const bulk = getFirestore().bulkWriter();
      const { week, year } = getWeek();

      await votesCollectionRef(year, week)
        .where('voter', '==', profileRef(appUser.id))
        .get()
        .then(({ docs }) => docs.forEach((doc) => bulk.delete(doc.ref)));

      await Promise.all(
        selected_users.map(async (id) => {
          const selectedUser = await getSlackAppUser(id);

          if (selectedUser) {
            bulk.set(
              votesCollectionRef(year, week).doc(
                `${appUser.id}:${selectedUser.id}`
              ),
              {
                voter: profileRef(appUser.id),
                voted: profileRef(selectedUser.id),
                week,
                year,
                timestamp: FieldValue.serverTimestamp(),
              }
            );
          }
        })
      );

      await bulk.close();
    }
  }
}
