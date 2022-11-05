import { initializeApp } from 'firebase-admin';
import { Settings } from 'luxon';
import { App } from '@slack/bolt';
import voteModalSubmission from './handler.ts/voteModalSubmission';
import openVoteModal from './handler.ts/openVoteModal';
import openResultModal from './handler.ts/openResultModal';

Settings.defaultZone = 'Asia/Kuala_Lumpur';
initializeApp();

const app = new App({
  appToken: process.env.APP_TOKEN,
  socketMode: !!process.env.APP_TOKEN,
  token: process.env.BOT_OAUTH_TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  port: Number(process.env.PORT || 8080),
  endpoints: '/events',
});

app.action('button-link', ({ ack }) => ack());
app.action('button-link-2', ({ ack }) => ack());
app.action('open-vote-modal', openVoteModal);
app.action('open-result-modal', openResultModal);
app.view('vote-modal-submission', voteModalSubmission);

(async () => {
  await app.start();
})();
