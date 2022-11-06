// Script to generate the app.yaml file for GCP App Engine deployment.

require('dotenv-flow').config();
const yaml = require('yaml');
const fs = require('fs');

fs.writeFileSync(
  './app.yaml',
  yaml.stringify({
    runtime: 'nodejs16',
    env: 'standard',
    instance_class: 'F1',
    env_variables: {
      API_SECRET: process.env.API_SECRET,
      SLACK_BOT_OAUTH_TOKEN: process.env.SLACK_BOT_OAUTH_TOKEN,
      SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
      SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
      TRELLO_KEY: process.env.TRELLO_KEY,
      TRELLO_LNL_CARD_ID: process.env.TRELLO_LNL_CARD_ID,
      TRELLO_TOKEN: process.env.TRELLO_TOKEN,
    },
  })
);
