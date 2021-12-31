import * as functions from 'firebase-functions';

export default function getSlackGoatWebhook(): URL {
  const slackWebhook = functions.config().slack?.goat_webhook;
  if (!slackWebhook) {
    throw new Error(
      'Slack GOAT Webhook (slack.goat_webhook) is not configured!'
    );
  }

  return new URL(slackWebhook);
}
