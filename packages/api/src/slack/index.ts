import { App, ExpressReceiver } from '@slack/bolt';

import voteModalSubmission from './handler/voteModalSubmission';
import openVoteModal from './handler/openVoteModal';
import openResultModal from './handler/openResultModal';

export const slackReceiver = new ExpressReceiver({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  endpoints: '/',
});

const appOptions = process.env.SLACK_SOCKET_MODE
  ? {
      socketMode: true,
      appToken: process.env.SLACK_APP_TOKEN,
    }
  : {
      receiver: slackReceiver,
    };

export const slackApp = new App({
  token: process.env.SLACK_BOT_OAUTH_TOKEN,
  ...appOptions,
});

slackApp.action('button-link', ({ ack }) => ack());
slackApp.action('button-link-2', ({ ack }) => ack());
slackApp.action('open-vote-modal', openVoteModal);
slackApp.action('open-result-modal', openResultModal);
slackApp.view('vote-modal-submission', voteModalSubmission);

(async () => {
  if (process.env.SLACK_SOCKET_MODE) {
    await slackApp.start();
    console.log('⚡️ Bolt app started');
  }
})();
