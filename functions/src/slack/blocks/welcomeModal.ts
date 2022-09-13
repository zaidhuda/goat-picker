import { BlockAction, ModalView } from '@slack/bolt';
import { buildButtonLinkElement } from './builders';

export default function slackWelcomeModal({
  user,
}: {
  user: BlockAction['user'];
}): ModalView {
  return {
    type: 'modal',
    title: {
      type: 'plain_text',
      text: 'Vote the GOAT',
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hello, <@${user.id}>! Welcome to GOAT Picker! It looks like you haven't set up your profile yet. Sign up to start voting.`,
        },
      },
      {
        type: 'actions',
        elements: [
          buildButtonLinkElement({
            style: 'primary',
            value: 'signup',
            text: 'Sign up on GOAT Picker',
          }),
        ],
      },
    ],
  };
}
