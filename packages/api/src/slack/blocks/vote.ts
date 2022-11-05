import { Block, BlockAction, KnownBlock } from '@slack/bolt';
import { getFirestore } from 'firebase-admin/firestore';
import { profileRef, votesCollectionRef } from '../../utils/firestorePaths';
import getSlackAppUser from '../../utils/getSlackAppUser';
import getWeek from '../../utils/getWeek';

export default async function slackVoteBlocks({
  user,
}: {
  user: BlockAction['user'];
}): Promise<Block[]> {
  const maxVotes = (await getFirestore().doc(`configs/slackbot`).get()).get(
    'MAX_VOTES_PER_USER'
  );

  const blocks: KnownBlock[] = [];
  const votedUserIds: string[] = [];
  const appUser = await getSlackAppUser(user.id);

  if (appUser) {
    const { week, year } = getWeek();
    const querySnapshot = await votesCollectionRef(year, week)
      .where('voter', '==', profileRef(appUser.id))
      .get();

    votedUserIds.push(
      ...(await Promise.all(
        querySnapshot.docs.map(async (doc) =>
          (await doc.get('voted').get()).get('slackId')
        )
      ))
    );

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
