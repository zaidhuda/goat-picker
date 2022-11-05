import { Request, Response } from 'firebase-functions/v1';
import getWeek from '../utils/getWeek';
import getStats from '../utils/getStats';
import getSlackNames from '../utils/getSlackNames';
import sendMessageToSlack from '../utils/sendMessageToSlack';
import {
  buildButtonLinkElement,
  buildButtonLinkSection,
} from '../slack/blocks/builders';

export default async function publishWeeklyResults(
  req: Request,
  res: Response
): Promise<void> {
  console.log('Publishing results to Slack channel');

  const { previousYear, previousWeek } = getWeek();
  const { profileWithStats, highestVoted } = await getStats({
    year: previousYear,
    week: previousWeek,
  });

  let message = "Bummer, we couldn't find the *GOAT* :sadpepe:";

  if (highestVoted > 1) {
    const mostVotedProfiles = profileWithStats.filter(
      ({ totalVoted }) => totalVoted === highestVoted
    );
    const mostVotedNames = getSlackNames(mostVotedProfiles);

    if (mostVotedProfiles.length === 1) {
      message = `We've found the *GOAT*! Congratulations, ${mostVotedNames}!`;
    } else {
      message = `Congratulations ${mostVotedNames}! Keep up the good work!`;
    }
  }

  const blocks = [
    buildButtonLinkSection(
      message,
      buildButtonLinkElement({
        url: undefined,
        text: 'View results',
        action_id: 'open-result-modal',
        value: `year:${previousYear},week:${previousWeek}`,
      })
    ),
  ];

  try {
    await sendMessageToSlack(blocks);

    console.log('Published results to Slack channel');
    res.status(200).send(blocks);
  } catch (error) {
    console.error(error);
    res.status(500).send((error as Error).message);
  }

  return;
}
