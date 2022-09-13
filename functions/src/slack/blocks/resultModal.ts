import { ContextBlock, KnownBlock, ModalView } from '@slack/bolt';
import { DateTime } from 'luxon';
import pluralize from 'pluralize';
import getStats from '../../utils/getStats';
import { buildButtonLinkElement } from './builders';

export default async function slackResultModal({
  year,
  week,
}: {
  year: number;
  week: number;
}): Promise<ModalView> {
  const { profileWithStats, highestVoted } = await getStats({ year, week });
  const blocks: KnownBlock[] = [];

  const dateTime = DateTime.fromObject({ weekYear: year, weekNumber: week });
  const startDate = dateTime.startOf('week').toFormat('dd');
  const endDate = dateTime.endOf('week').toFormat('dd LLLL');

  if (highestVoted > 0) {
    blocks.push(
      ...profileWithStats
        .sort(
          (a, b) =>
            a.displayName.localeCompare(b.displayName) ||
            a.totalVoted - b.totalVoted
        )
        .filter(({ totalVoted }) => totalVoted > 0)
        .map<ContextBlock>((profile) => ({
          type: 'context',
          elements: [
            {
              type: 'image',
              image_url: profile.photoURL,
              alt_text: profile.displayName,
            },
            {
              type: 'plain_text',
              text: profile.displayName,
              emoji: true,
            },
            {
              type: 'plain_text',
              text: pluralize('vote', profile.totalVoted, true),
              emoji: true,
            },
          ],
        }))
    );
  }

  if (blocks.length === 0) {
    blocks.push({
      type: 'section',
      text: {
        type: 'plain_text',
        text: "Bummer, we couldn't find the *GOAT* :sadpepe:",
        emoji: true,
      },
    });
  }

  return {
    type: 'modal',
    title: {
      type: 'plain_text',
      text: `${startDate} - ${endDate} GOAT`,
    },
    blocks: [
      {
        type: 'actions',
        elements: [
          buildButtonLinkElement({}),
          buildButtonLinkElement({
            action_id: 'button-link-2',
            path: `/goat?year=${year}&week=${week}`,
            text: 'View Results',
          }),
        ],
      },
      { type: 'divider' },
      ...blocks,
    ],
  };
}
