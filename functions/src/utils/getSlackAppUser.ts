import { firestore } from 'firebase-admin';

export default async function getSlackAppUser(
  userId: string
): Promise<firestore.DocumentData | undefined> {
  return (
    await firestore()
      .collection('profiles')
      .where('slackId', '==', userId)
      .get()
  ).docs[0];
}
