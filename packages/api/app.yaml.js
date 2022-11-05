// Script to generate the app.yaml file for GCP App Engine deployment.

require('dotenv').config();
const yaml = require('yaml');
const fs = require('fs');

fs.writeFileSync(
  './app.yaml',
  yaml.stringify({
    runtime: 'nodejs16',
    env: 'standard',
    instance_class: 'F1',
    env_variables: {
      BOT_OAUTH_TOKEN: process.env.BOT_OAUTH_TOKEN,
      SIGNING_SECRET: process.env.SIGNING_SECRET,
    },
  })
);
