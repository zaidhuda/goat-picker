// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv-flow').config();

import express from 'express';
import { initializeApp } from 'firebase-admin/app';
import { Settings } from 'luxon';

Settings.defaultZone = 'Asia/Kuala_Lumpur';
initializeApp();

import auth from './utils/authenticateRequest';
import updateStats from './requests/updateStats';
import publishAnnualStats from './requests/publishAnnualStats';
import publishWeeklyResults from './requests/publishWeeklyResults';
import updateLnlSchedules from './requests/updateLnlSchedules';
import slackApp from './slack';

const app = express();
const port = process.env.PORT || 8080;

app.get('/update-stats', auth, updateStats);
app.get('/publish-annual-stats', auth, publishAnnualStats);
app.get('/publish-weekly-results', auth, publishWeeklyResults);
app.get('/update-lnl-schedules', auth, updateLnlSchedules);
app.use('/slack', slackApp.router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);

  if (process.env.NODE_ENV !== 'production') {
    const url = `http://localhost:${port}`;
    console.log(`Ready at ${url}`);
    console.log(`${url}/update-stats`);
    console.log(`${url}/publish-annual-stats`);
    console.log(`${url}/publish-weekly-results`);
    console.log(`${url}/update-lnl-schedules`);
  }
});
