import * as pluralize from 'pluralize';
import getWeek from '../utils/getWeek';
import getSlackNames from '../utils/getSlackNames';
import sendMessageToSlack from '../utils/sendMessageToSlack';
import getSlackGoatWebhook from '../utils/getSlackGoatWebhook';
import { firestore } from 'firebase-admin';
import { Stats } from '../types/vote';
import { Request, Response } from 'firebase-functions/v1';

export default async function publishStats(
  req: Request,
  res: Response
): Promise<void> {
  console.log('Publishing annual stats to Slack channel');

  const { previousYear } = getWeek();

  const stats = await firestore().doc(`years/${previousYear}`).get();
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

  const message = [
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
    `*<https://goatpicker.web.app/stats?year=${previousYear}|View stats>*`,
  ];

  try {
    await sendMessageToSlack(message, getSlackGoatWebhook());

    console.log('Published annual stats to Slack channel');
    res.status(200).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send((error as Error).message);
  }

  return;
}
