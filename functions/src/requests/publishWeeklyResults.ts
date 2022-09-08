import getWeek from '../utils/getWeek';
import getStats from '../utils/getStats';
import getSlackNames from '../utils/getSlackNames';
import sendMessageToSlack from '../utils/sendMessageToSlack';
import getSlackGoatWebhook from '../utils/getSlackGoatWebhook';
import { Request, Response } from 'firebase-functions/v1';

export default async function publishWeeklyResults(
  req: Request,
  res: Response
): Promise<void> {
  console.log('Publishing results to Slack channel');

  const { previousYear, previousWeek } = getWeek();
  const { profileWithStats, highestVotes } = await getStats({
    year: previousYear,
    week: previousWeek,
  });

  let message = "Bummer, we couldn't find the *GOAT* :sadpepe:";

  if (highestVotes > 1) {
    const mostVotedProfiles = profileWithStats.filter(
      ({ totalVotes }) => totalVotes === highestVotes
    );
    const mostVotedNames = getSlackNames(mostVotedProfiles);

    if (mostVotedProfiles.length === 1) {
      message = `We've found the *GOAT*! Congratulations, ${mostVotedNames}!`;
    } else {
      message = `Congratulations ${mostVotedNames}! Keep up the good work!`;
    }
  }

  try {
    await sendMessageToSlack(
      `${message}\n*<https://goatpicker.web.app/goat?year=${previousYear}&week=${previousWeek}|View result>*`,
      getSlackGoatWebhook()
    );

    console.log('Published results to Slack channel');
    res.status(200).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send((error as Error).message);
  }

  return;
}
