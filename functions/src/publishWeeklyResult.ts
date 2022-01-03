import getWeek from './utils/getWeek';
import getVotes from './utils/getVotes';
import getProfiles from './utils/getProfiles';
import getSlackNames from './utils/getSlackNames';
import sendMessageToSlack from './utils/sendMessageToSlack';
import getSlackGoatWebhook from './utils/getSlackGoatWebhook';

export default async function publishWeeklyResult(): Promise<void> {
  console.log('Publishing results to Slack channel');

  const { previousYear, previousWeek } = getWeek();
  const votes = await getVotes(previousYear, previousWeek);
  const profiles = await getProfiles();
  let message = "Bummer, we couldn't find the *GOAT* :sadpepe:";

  const votedUserIdsWithCount = votes
    .map(({ votes }) => votes)
    .flat(1)
    .filter(Boolean)
    .reduce<{ [key in string]: number }>(
      (acc, id) => (id ? { ...acc, [id]: (acc[id] || 0) + 1 } : acc),
      {}
    );

  const highestVote = Math.max(0, ...Object.values(votedUserIdsWithCount));

  if (highestVote > 1) {
    const mostVotedUserIds = Object.entries(votedUserIdsWithCount)
      .filter(([, votes]) => votes === highestVote)
      .map(([id]) => id);
    const mostVotedProfiles = profiles.filter(({ id }) =>
      mostVotedUserIds.includes(id)
    );
    const mostVotedNames = getSlackNames(mostVotedProfiles);

    if (mostVotedProfiles.length === 1) {
      message = `We've found the *GOAT*! Congratulations, ${mostVotedNames}!`;
    } else {
      message = `Congratulations ${mostVotedNames}! Keep up the good work!`;
    }
  }

  await sendMessageToSlack(
    `${message}\n*<https://goatpicker.web.app/goat?year=${previousYear}&week=${previousWeek}|View result>*`,
    getSlackGoatWebhook()
  );

  console.log('Published results to Slack channel');
}
