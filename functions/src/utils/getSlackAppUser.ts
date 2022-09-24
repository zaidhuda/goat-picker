import { firestore } from 'firebase-admin';
import { profilesCollectionRef } from './firestorePaths';

export default async function getSlackAppUser(
  userId: string
): Promise<firestore.DocumentSnapshot | undefined> {
  return (
    await profilesCollectionRef().where('slackId', '==', userId).limit(1).get()
  ).docs[0];
}
