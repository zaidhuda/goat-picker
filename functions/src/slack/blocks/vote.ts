import { Block, BlockAction, KnownBlock } from '@slack/bolt';
import { firestore } from 'firebase-admin';
import { Profile } from '../../types/profile';
import votesPath from '../../utils/firestorePaths';
import getSlackAppUser from '../../utils/getSlackAppUser';
import getWeek from '../../utils/getWeek';

export default async function slackVoteBlocks({
  user,
}: {
  user: BlockAction['user'];
}): Promise<Block[]> {
  const maxVotes = (await firestore().doc(`configs/slackbot`).get()).get(
    'MAX_VOTES_PER_USER'
  );

  const blocks: KnownBlock[] = [];
  const votedUserIds = [];
  const appUser = await getSlackAppUser(user.id);

  if (appUser) {
    const { week, year } = getWeek();
    const voteDocs = await firestore()
      .collection(votesPath(year, week))
      .where('voter', '==', firestore().doc(`profiles/${appUser.id}`))
      .get();

    for await (const doc of voteDocs.docs) {
      const { slackId } = (await doc.get('voted').get()).data() as Profile;

      if (slackId) {
        votedUserIds.push(slackId);
      }
    }

    blocks.push({
      type: 'input',
      block_id: 'vote-input',
      dispatch_action: false,
      optional: true,
      element: {
        type: 'multi_users_select',
        action_id: 'select',
        max_selected_items: maxVotes,
        initial_users: votedUserIds,
      },
      label: {
        type: 'plain_text',
        text: 'Who have been most helpful to you recently?',
        emoji: true,
      },
    });
  }

  return blocks;
}
