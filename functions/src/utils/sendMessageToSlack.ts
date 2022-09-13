import { config } from 'firebase-functions/v1';
import Axios from 'axios';
import { KnownBlock } from '@slack/bolt';

export default function sendMessageToSlack(
  blocks: KnownBlock[]
): Promise<void> {
  return Axios.create().post(config().slack?.webhook_url, { blocks });
}
