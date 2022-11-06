import { App, ExpressReceiver } from '@slack/bolt';

import voteModalSubmission from './handler/voteModalSubmission';
import openVoteModal from './handler/openVoteModal';
import openResultModal from './handler/openResultModal';

const receiver = new ExpressReceiver({
  signingSecret: `${process.env.SLACK_SIGNING_SECRET}`,
  endpoints: '/',
});

const app = new App({
  token: process.env.SLACK_BOT_OAUTH_TOKEN,
  receiver,
});

app.action('button-link', ({ ack }) => ack());
app.action('button-link-2', ({ ack }) => ack());
app.action('open-vote-modal', openVoteModal);
app.action('open-result-modal', openResultModal);
app.view('vote-modal-submission', voteModalSubmission);

export default receiver;
