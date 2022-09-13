import {
  AllMiddlewareArgs,
  SlackViewMiddlewareArgs,
  ViewSubmitAction,
} from '@slack/bolt';
import { firestore } from 'firebase-admin';
import votesPath from '../../utils/firestorePaths';
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
      const { week, year } = getWeek();

      const existingVotes = await firestore()
        .collection(votesPath(year, week))
        .where('voter', '==', firestore().doc(`profiles/${appUser.id}`))
        .get();

      await existingVotes.forEach((doc) => doc.ref.delete());

      for await (const id of selected_users) {
        const selectedUser = await getSlackAppUser(id);

        if (selectedUser) {
          await firestore()
            .collection(votesPath(year, week))
            .doc(`${appUser.id}:${selectedUser.id}`)
            .set({
              voter: firestore().doc(`profiles/${appUser.id}`),
              voted: firestore().doc(`profiles/${selectedUser.id}`),
              week,
              year,
              timestamp: firestore.FieldValue.serverTimestamp(),
            });
        }
      }
    }
  }
}
