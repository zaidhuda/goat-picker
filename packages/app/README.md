# GOAT Picker

## Stack

1. Firebase
2. Next.js with TypeScript
3. Tailwind CSS
4. Material UI

## Scripts

- lint
- lint:fix
- dev
- build
- start
- export

## Firebase

Start by creating a Firebase project and add an application

To run the app locally, paste app config into `public/__/firebase/init.json`

## Configurations

Configurations can be set by creating a document on Firestore at `/configs/{APP_ID}`

### EMAIL_DOMAIN (string, default `''`)

Block authentications for emails that dont end with this string

### MAX_VOTES_PER_USER (number, default `5`)

Maximum number of votes users get each week

### MAX_ATTENDEES (number default `10`)

Maximum number of attendees per day
