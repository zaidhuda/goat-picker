import { BlockAction, ModalView } from '@slack/bolt';
import { buildButtonLinkElement } from './builders';
import slackVoteBlocks from './vote';

export default async function slackVoteModal({
  user,
}: {
  user: BlockAction['user'];
}): Promise<ModalView> {
  const blocks = await slackVoteBlocks({ user });

  return {
    type: 'modal',
    callback_id: 'vote-modal-submission',
    title: {
      type: 'plain_text',
      text: 'Vote the GOAT',
    },
    submit: {
      type: 'plain_text',
      text: 'Submit',
      emoji: true,
    },
    blocks: [
      {
        type: 'actions',
        elements: [buildButtonLinkElement({})],
      },
      { type: 'divider' },
      ...blocks,
    ],
  };
}
