import { firestore } from 'firebase-admin';
import { Profile } from '../types/profile';

const PROFILES = 'profiles';

export default async function getProfiles(): Promise<Profile[]> {
  const profiles: Profile[] = [];

  (await firestore().collection(PROFILES).get()).forEach(
    (doc: firestore.QueryDocumentSnapshot) =>
      profiles.push({ id: doc.id, ...doc.data() } as Profile)
  );

  return profiles;
}
