import { getFirestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Profile } from '../types/profile';

const PROFILES = 'profiles';

export default async function getProfiles(): Promise<Profile[]> {
  const profiles: Profile[] = [];

  (await getFirestore().collection(PROFILES).get()).forEach(
    (doc: QueryDocumentSnapshot) =>
      profiles.push({ id: doc.id, ...doc.data() } as Profile)
  );

  return profiles;
}
