import { DocumentSnapshot } from 'firebase-admin/firestore';
import { profilesCollectionRef } from './firestorePaths';

export default async function getSlackAppUser(
  userId: string
): Promise<DocumentSnapshot | undefined> {
  return (
    await profilesCollectionRef().where('slackId', '==', userId).limit(1).get()
  ).docs[0];
}
