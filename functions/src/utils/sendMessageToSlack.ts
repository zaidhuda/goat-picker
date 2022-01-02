import * as https from 'https';

export default function sendMessageToSlack(
  message: string | string[],
  webhook: URL
): Promise<void> {
  const buildSection = (text: string) => ({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text,
    },
  });

  const data = JSON.stringify({
    blocks: Array.isArray(message)
      ? message.map((msg) => buildSection(msg))
      : [buildSection(message)],
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: webhook.hostname,
      port: webhook.port,
      path: webhook.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    });

    req.on('error', reject);
    req.write(data);
    req.end(resolve);
  });
}
