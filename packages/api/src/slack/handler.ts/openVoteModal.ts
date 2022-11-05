import {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt';
import getSlackAppUser from '../../utils/getSlackAppUser';
import slackVoteModal from '../blocks/voteModal';
import slackWelcomeModal from '../blocks/welcomeModal';

export default async function openVoteModal({
  ack,
  client,
  body: { trigger_id, user },
}: SlackActionMiddlewareArgs<BlockAction> & AllMiddlewareArgs): Promise<void> {
  await ack();

  const appUser = await getSlackAppUser(user.id);

  const view = !appUser
    ? slackWelcomeModal({ user })
    : await slackVoteModal({ user });

  await client.views.open({
    trigger_id,
    view,
  });
}
