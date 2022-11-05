import { initializeApp } from 'firebase-admin/app';
import { Settings } from 'luxon';
import { https } from 'firebase-functions/v1';

Settings.defaultZone = 'Asia/Kuala_Lumpur';
initializeApp();

import auth from './utils/authentiateRequest';
import updateStats from './requests/updateStats';
import publishAnnualStats from './requests/publishAnnualStats';
import publishWeeklyResults from './requests/publishWeeklyResults';
import updateLnlSchedules from './requests/updateLnlSchedules';

exports.updateStats = https.onRequest(auth(updateStats));
exports.publishAnnualStats = https.onRequest(auth(publishAnnualStats));
exports.publishWeeklyResults = https.onRequest(auth(publishWeeklyResults));
exports.updateLnlSchedules = https.onRequest(auth(updateLnlSchedules));
