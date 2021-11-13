const functions = require('firebase-functions');
const https = require('https');
const admin = require('firebase-admin');
const { DateTime } = require('luxon');
const { URL } = require('url');
admin.initializeApp();

const VOTES = 'votes';
const PROFILES = 'profiles';

exports.sendReminderEveryFridayAtFive = functions.pubsub
  .schedule('every friday 17:00')
  .timeZone('Asia/Kuala_Lumpur')
  .onRun(async () => {
    console.log('Sending weekly reminder');

    await sendMessageToSlack(
      "Don't forget to vote for the *GOAT* if you haven't already!\n*<https://goatpicker.web.app/vote|Vote now>*",
      getSlackGoatWebhook()
    );

    console.log('Sent weekly reminder');
  });

exports.publishResultEveryMondayAtTen = functions.pubsub
  .schedule('every monday 10:00')
  .timeZone('Asia/Kuala_Lumpur')
  .onRun(async () => {
    console.log('Publishing results to Slack channel');

    const now = DateTime.now();
    const year = now.year;
    const week = now.weekNumber;
    const firstWeek = week === 1;
    const previousYear = firstWeek ? year - 1 : year;
    const previousWeek = firstWeek
      ? DateTime.local(previousYear, 2).weeksInWeekYear
      : week - 1;

    const votes = [];
    (
      await admin
        .firestore()
        .collection(`${VOTES}/${previousYear}/${previousWeek}`)
        .get()
    ).forEach((doc) =>
      votes.push({
        id: doc.id,
        ...doc.data(),
      })
    );

    const votedWithCount = votes
      .map(({ votes }) => votes)
      .flat(1)
      .reduce((acc, id) => ({ ...acc, [id]: (acc[id] || 0) + 1 }), {});

    const highestVote = Object.values(votedWithCount).reduce(
      (max, votes) => Math.max(max, votes),
      0
    );

    const mostVotedIds = Object.entries(votedWithCount)
      .filter(([, votes]) => votes >= highestVote)
      .map(([id]) => id);

    const profiles = [];
    (await admin.firestore().collection(PROFILES).get()).forEach((doc) =>
      profiles.push({ id: doc.id, ...doc.data() })
    );

    const mostVotedProfiles = profiles.filter(({ id }) =>
      mostVotedIds.includes(id)
    );

    let message = "Bummer, we couldn't find the *GOAT* :sadpepe:";

    if (highestVote > 1 && mostVotedProfiles.length > 1) {
      const mostVotedNames = new Intl.ListFormat('en').format(
        mostVotedProfiles.map(({ displayName }) => displayName)
      );

      if (mostVotedProfiles.length === 1) {
        message = `We've found the GOAT! Congratulations, *${mostVotedNames}*!`;
      } else {
        message = `Congratulations ${mostVotedNames}! Keep up the good work!`;
      }
    }

    await sendMessageToSlack(
      `${message}\n*<https://goatpicker.web.app/goat?year=${previousYear}&week=${previousWeek}|View result>*`,
      getSlackGoatWebhook()
    );

    console.log('Published results to Slack channel');
  });

const getSlackGoatWebhook = () => {
  const slackWebhook = functions.config().slack?.goat_webhook;
  if (!slackWebhook) {
    throw new Error(
      'Slack GOAT Webhook (slack.goat_webhook) is not configured!'
    );
  }

  return new URL(slackWebhook);
};

const sendMessageToSlack = (message, webhook) =>
  new Promise((resolve, reject) => {
    const data = JSON.stringify({
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message,
          },
        },
      ],
    });

    const req = https.request({
      hostname: webhook.hostname,
      port: webhook.port,
      path: webhook.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    });

    req.on('error', reject);
    req.write(data);
    req.end(resolve);
  });
