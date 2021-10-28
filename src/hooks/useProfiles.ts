import { useState, useEffect } from 'react';
import { Profile } from 'types/profile';
import useFirebase from './useFirebase';

const PROFILES = 'profiles';

export default function useProfiles() {
  const { db, user } = useFirebase();

  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (db && user) {
      return db.collection(PROFILES).onSnapshot((querySnapshot) => {
        const data: Profile[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Profile);
        });
        setProfiles(data);
      });
    }
  }, [db, user]);

  return profiles;
}
