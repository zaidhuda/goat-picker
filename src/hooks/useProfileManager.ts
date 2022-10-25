import { doc, setDoc } from 'firebase/firestore';
import { Profile } from 'types/profile';
import useFirebase from './useFirebase';

const PROFILES = 'profiles';

export default function useProfileManager() {
  const { db, user } = useFirebase();

  const updateUser = (
    id: string,
    data: Pick<Profile, 'hidden' | 'isAdmin' | 'slackId'>
  ) => {
    if (db && user?.isAdmin) {
      setDoc(doc(db, PROFILES, id), data, { merge: true });
    }
  };

  return {
    updateUser,
  };
}
