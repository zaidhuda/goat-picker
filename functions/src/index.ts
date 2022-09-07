import { https, pubsub } from 'firebase-functions';
import { initializeApp } from 'firebase-admin';

initializeApp();

import sendWeeklyReminder from './sendWeeklyReminder';
import publishAnnualStats from './publishAnnualStats';
import publishWeeklyResult from './publishWeeklyResult';
import getLnlSchedules from './getLnlSchedules';

exports.sendReminderEveryFridayAtFive = pubsub
  .schedule('every friday 17:00')
  .timeZone('Asia/Kuala_Lumpur')
  .onRun(sendWeeklyReminder);

exports.publishResultEveryMondayAtTen = pubsub
  .schedule('every monday 10:00')
  .timeZone('Asia/Kuala_Lumpur')
  .onRun(publishWeeklyResult);

exports.publishAnnualStats = pubsub
  .schedule('0 10 3 1 *')
  .timeZone('Asia/Kuala_Lumpur')
  .onRun(publishAnnualStats);

exports.lnlSchedules = https.onCall(getLnlSchedules);
