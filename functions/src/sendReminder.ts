import sendMessageToSlack from './utils/sendMessageToSlack';
import getSlackGoatWebhook from './utils/getSlackGoatWebhook';

export default async function sendReminderEveryFridayAtFive() {
  console.log('Sending weekly reminder');

  await sendMessageToSlack(
    "Don't forget to vote for the *GOAT* if you haven't already!\n*<https://goatpicker.web.app/vote|Vote now>*",
    getSlackGoatWebhook()
  );

  console.log('Sent weekly reminder');
}
