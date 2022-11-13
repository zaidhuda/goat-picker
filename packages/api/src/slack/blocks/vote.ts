import { Block, BlockAction, ContextBlock, KnownBlock } from '@slack/bolt';
import { getFirestore } from 'firebase-admin/firestore';
import { Profile } from '../../types/profile';
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
  const votedUsers: Profile[] = [];
  const appUser = await getSlackAppUser(user.id);

  if (appUser) {
    const { week, year } = getWeek();
    const querySnapshot = await votesCollectionRef(year, week)
      .where('voter', '==', profileRef(appUser.id))
      .get();

    votedUsers.push(
      ...(await Promise.all(
        querySnapshot.docs.map(async (doc) =>
          (await doc.get('voted').get()).data()
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
        initial_users: votedUsers
          .map(({ slackId }) => slackId)
          .filter(Boolean) as string[],
      },
      label: {
        type: 'plain_text',
        text: 'Who have been most helpful to you recently?',
        emoji: true,
      },
    });
  }

  if (votedUsers.length) {
    blocks.push({
      type: 'section',
      text: {
        type: 'plain_text',
        text: 'Current votes:',
        emoji: true,
      },
    });

    blocks.push(
      ...votedUsers
        .sort((a, b) => a.displayName.localeCompare(b.displayName))
        .map<ContextBlock>((profile) => ({
          type: 'context',
          elements: [
            {
              type: 'image',
              image_url: profile.photoURL,
              alt_text: profile.displayName,
            },
            {
              type: 'plain_text',
              text: profile.displayName,
              emoji: true,
            },
          ],
        }))
    );
  }

  return blocks;
}
