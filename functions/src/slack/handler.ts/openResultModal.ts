import {
  AllMiddlewareArgs,
  BlockButtonAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt';
import slackResultModal from '../blocks/resultModal';

export default async function openResultModal({
  ack,
  client,
  body: { trigger_id, actions },
}: SlackActionMiddlewareArgs<BlockButtonAction> &
  AllMiddlewareArgs): Promise<void> {
  await ack();

  const { year, week } = actions
    .flatMap(({ value }) => value.split(',').map((a) => a.split(':')))
    .reduce<{ [key in string]?: number }>(
      (acc, [key, value]) => ({ ...acc, [key]: Number(value) }),
      {}
    );

  if (year && week) {
    await client.views.open({
      trigger_id,
      view: await slackResultModal({ year, week }),
    });
  }
}
