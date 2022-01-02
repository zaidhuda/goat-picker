import { pubsub } from 'firebase-functions';
import { initializeApp } from 'firebase-admin';

initializeApp();

import sendWeeklyReminder from './sendWeeklyReminder';
import publishAnnualStats from './publishAnnualStats';
import publishWeeklyResult from './publishWeeklyResult';

exports.sendReminderEveryFridayAtFive = pubsub
  .schedule('every friday 17:00')
  .timeZone('Asia/Kuala_Lumpur')
  .onRun(sendWeeklyReminder);

exports.publishResultEveryMondayAtTen = pubsub
  .schedule('every monday 10:00')
  .timeZone('Asia/Kuala_Lumpur')
  .onRun(publishWeeklyResult);

exports.publishAnnualStats = pubsub
  .schedule('every 3 jan 10:00')
  .timeZone('Asia/Kuala_Lumpur')
  .onRun(publishAnnualStats);
