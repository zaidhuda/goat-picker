import pluralize from 'pluralize';
import getWeek from '../utils/getWeek';
import getSlackNames from '../utils/getSlackNames';
import sendMessageToSlack from '../utils/sendMessageToSlack';
import { Stats } from '../types/vote';
import {
  buildButtonLinkElement,
  buildPlainTextSections,
} from '../slack/blocks/builders';
import { ActionsBlock } from '@slack/bolt';
import { yearRef } from '../utils/firestorePaths';
import { Request, Response } from 'express';

export default async function publishStats(
  req: Request,
  res: Response
): Promise<void> {
  console.log('Publishing annual stats to Slack channel');

  const { previousYear } = getWeek();

  const stats = await yearRef(previousYear).get();
  const {
    highestVoted,
    highestVotes,
    profileWithStats,
    totalParticipation,
    totalVoted,
    totalVotes,
  } = stats.data() as Stats;

  const mostVoted = profileWithStats.filter(
    ({ totalVoted }) => totalVoted === highestVoted
  );

  const mostVotes = profileWithStats.filter(
    ({ totalVotes }) => totalVotes === highestVotes
  );

  const mostVotesNames = getSlackNames(mostVotes);
  const mostVotedNames = getSlackNames(mostVoted);

  const textSections = buildPlainTextSections([
    `Here's the stats for the year *${previousYear}*:`,
    [
      `In total, *${totalParticipation}*`,
      pluralize('person', totalParticipation),
      'participated in the voting throughout the year.',
      `They voted *${totalVoted}* times, for a total of *${totalVotes}* votes.`,
    ].join(' '),
    [
      'The most voted',
      pluralize('person', mostVotes.length),
      pluralize('was', mostVotes.length),
      mostVotesNames,
      `with *${highestVoted}* votes.`,
    ].join(' '),
    mostVotesNames === mostVotedNames
      ? [
          'They were also the person that voted the most',
          `with *${highestVotes}* votes.`,
        ].join(' ')
      : [
          'On the other hand, the',
          pluralize('person', mostVoted.length),
          'that voted the most',
          pluralize('was', mostVoted.length),
          mostVotedNames,
          `with *${highestVotes}* votes.`,
        ].join(' '),
  ]);

  const blocks = [
    ...textSections,
    {
      type: 'actions',
      elements: [
        buildButtonLinkElement({
          text: 'View stats',
          path: `/stats?year=${previousYear}`,
        }),
      ],
    } as ActionsBlock,
  ];

  try {
    await sendMessageToSlack(blocks);

    console.log('Published annual stats to Slack channel');
    res.status(200).send(blocks);
  } catch (error) {
    console.error(error);
    res.status(500).send((error as Error).message);
  }

  return;
}
