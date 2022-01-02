import { DateTime } from 'luxon';
import pluralize = require('pluralize');
import getWeek from './utils/getWeek';
import getVotes from './utils/getVotes';
import saveStats from './utils/saveStats';
import getProfiles from './utils/getProfiles';
import getSlackNames from './utils/getSlackNames';
import sendMessageToSlack from './utils/sendMessageToSlack';
import getSlackGoatWebhook from './utils/getSlackGoatWebhook';

export default async function publishAnnualStats(): Promise<void> {
  console.log('Publishing annual stats to Slack channel');

  const { previousYear } = getWeek();
  const profiles = await getProfiles();
  const weeks = DateTime.local(previousYear).weeksInWeekYear;
  const allVotes = Object.values(
    await Promise.all(
      Array.from({ length: weeks }, (_, week) =>
        getVotes(previousYear, week + 1)
      )
    )
  ).flat();

  const profileWithStats = profiles.map((profile) => {
    const profileVotes = allVotes.filter(({ id }) => id === profile.id);
    const profileVoted = allVotes.filter(({ votes }) =>
      votes?.includes(profile.id)
    );

    return {
      ...profile,
      totalVotes: profileVotes.length,
      totalVoted: profileVoted.length,
    };
  });

  const totalParticipation = profileWithStats.filter(
    ({ totalVotes }) => totalVotes > 0
  ).length;

  const highestVoted = profileWithStats.reduce(
    (highest, { totalVoted }) => (totalVoted > highest ? totalVoted : highest),
    0
  );

  const mostVoted = profileWithStats.filter(
    ({ totalVoted }) => totalVoted === highestVoted
  );

  const highestVotes = profileWithStats.reduce(
    (highest, { totalVotes }) => (totalVotes > highest ? totalVotes : highest),
    0
  );

  const mostVotes = profileWithStats.filter(
    ({ totalVotes }) => totalVotes === highestVotes
  );

  const totalVoted = allVotes.reduce(
    (total, { votes }) => total + (votes?.length || 0),
    0
  );

  const totalVotes = allVotes.length;

  const stats = {
    highestVoted,
    highestVotes,
    mostVoted,
    mostVotes,
    totalParticipation,
    totalVoted,
    totalVotes,
  };

  await saveStats(previousYear, stats);

  await sendMessageToSlack(
    [
      `Here's the stats for the year *${previousYear}*:`,
      [
        `In total, *${totalParticipation}*`,
        pluralize('person', totalParticipation),
        'participated in the voting throughout the year.',
        `They voted *${totalVotes}* times, for a total of *${totalVoted}* votes.`,
      ].join(' '),
      [
        'The most voted',
        pluralize('person', mostVoted.length),
        pluralize('was', mostVoted.length),
        await getSlackNames(mostVoted),
        `with *${highestVoted}* votes.`,
      ].join(' '),
      [
        'On the other hand, the',
        pluralize('person', mostVotes.length),
        'that voted the most',
        pluralize('was', mostVotes.length),
        await getSlackNames(mostVotes),
        `with *${highestVotes}* votes.`,
      ].join(' '),
      `<https://goatpicker.web.app/stats?year=${previousYear}|View stats>*`,
    ],
    getSlackGoatWebhook()
  );

  console.log('Published annual stats to Slack channel');
}
