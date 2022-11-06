import Axios from 'axios';
import { KnownBlock } from '@slack/bolt';

export default function sendMessageToSlack(
  blocks: KnownBlock[]
): Promise<void> {
  if (!process.env.SLACK_WEBHOOK_URL) {
    throw new Error('SLACK_WEBHOOK_URL is not defined');
  }

  return Axios.create().post(process.env.SLACK_WEBHOOK_URL, { blocks });
}
