import { ContextBlock, ImageElement, KnownBlock, ModalView } from '@slack/bolt';
import { DateTime } from 'luxon';
import pluralize from 'pluralize';
import { Stats } from '../../types/vote';
import { weekRef } from '../../utils/firestorePaths';
import { buildButtonLinkElement } from './builders';

export default async function slackResultModal({
  year,
  week,
}: {
  year: number;
  week: number;
}): Promise<ModalView> {
  const { profileWithStats, highestVoted, totalParticipation, totalVotes } = (
    await weekRef(year, week).get()
  ).data() as Stats;
  const blocks: KnownBlock[] = [];

  const dateTime = DateTime.fromObject({ weekYear: year, weekNumber: week });
  const startDate = dateTime.startOf('week').toFormat('dd');
  const endDate = dateTime.endOf('week').toFormat('dd LLLL');

  const highestVotedProfiles = profileWithStats.filter(
    (profile) => highestVoted > 1 && profile.totalVoted === highestVoted
  );

  const otherProfiles = profileWithStats.filter(
    (profile) =>
      highestVoted < 2 ||
      (profile.totalVoted !== highestVoted && profile.totalVoted > 0)
  );

  blocks.push(
    ...highestVotedProfiles
      .sort(
        (a, b) =>
          b.totalVoted - a.totalVoted ||
          a.displayName.localeCompare(b.displayName)
      )
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
          {
            type: 'plain_text',
            text: '🏆',
            emoji: true,
          },
        ],
      }))
  );

  blocks.push(
    ...Array.from({ length: Math.max(highestVoted - 1, 1) })
      .map<ContextBlock>((_, index) => {
        const profiles = otherProfiles
          .filter(({ totalVoted }) => index + 1 === totalVoted)
          .sort((a, b) => a.displayName.localeCompare(b.displayName));
        const more = profiles.length > 5 && {
          type: 'plain_text',
          text: `+${profiles.length - 5} more`,
          emoji: true,
        };

        return {
          type: 'context',
          elements: [
            ...profiles
              .map<ImageElement>((profile) => ({
                type: 'image',
                image_url: profile.photoURL,
                alt_text: profile.displayName,
              }))
              .slice(0, 5),
            more,
            {
              type: 'plain_text',
              text: pluralize('vote', index + 1, true),
              emoji: true,
            },
          ].filter(Boolean) as ContextBlock['elements'],
        };
      })
      .filter((block) => block.elements.length > 1)
      .reverse()
  );

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
      {
        type: 'context',
        elements: [
          {
            type: 'plain_text',
            text: `${pluralize('vote', totalVotes, true)} from ${pluralize(
              'person',
              totalParticipation,
              true
            )}`,
            emoji: true,
          },
        ],
      },
    ],
  };
}
