import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Profile } from 'types/profile';
import useFirebase from './useFirebase';

const PROFILES = 'profiles';

export default function useProfiles() {
  const { db, user } = useFirebase();

  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (db && user) {
      return onSnapshot(collection(db, PROFILES), (querySnapshot) => {
        const data: Profile[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Profile);
        });
        setProfiles(
          data.sort((a, b) => (a.displayName > b.displayName ? 1 : -1))
        );
      });
    }
  }, [db, user]);

  return profiles;
}
