import { pubsub } from 'firebase-functions';
import { initializeApp } from 'firebase-admin';

initializeApp();

import sendReminder from './sendReminder';
import publishResults from './publishResults';

exports.sendReminderEveryFridayAtFive = pubsub
  .schedule('every friday 17:00')
  .timeZone('Asia/Kuala_Lumpur')
  .onRun(sendReminder);

exports.publishResultEveryMondayAtTen = pubsub
  .schedule('every monday 10:00')
  .timeZone('Asia/Kuala_Lumpur')
  .onRun(publishResults);
