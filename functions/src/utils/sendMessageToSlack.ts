import * as https from 'https';

export default function sendMessageToSlack(
  message: string,
  webhook: URL
): Promise<void> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message,
          },
        },
      ],
    });

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
