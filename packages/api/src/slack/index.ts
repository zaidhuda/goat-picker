import * as dotenv from 'dotenv';
dotenv.config();

import { initializeApp } from 'firebase-admin/app';
import { Settings } from 'luxon';
import { App } from '@slack/bolt';

Settings.defaultZone = 'Asia/Kuala_Lumpur';
initializeApp();

import voteModalSubmission from './handler/voteModalSubmission';
import openVoteModal from './handler/openVoteModal';
import openResultModal from './handler/openResultModal';

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
