import { useState, useEffect } from 'react';
import { collection, Firestore, onSnapshot } from 'firebase/firestore';
import { Profile } from 'types/profile';

const PROFILES = 'profiles';

export default function useProfiles(db?: Firestore, user?: Profile | null) {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (db && user) {
      const projectId = db?.app.options.projectId;
      const appFirestore = `https://console.firebase.google.com/u/0/project/${projectId}/firestore`;

      return onSnapshot(collection(db, PROFILES), (querySnapshot) => {
        const data: Profile[] = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            docUrl: `${appFirestore}/data/~2F${PROFILES}~2F${doc.id}`,
            ...doc.data(),
          } as Profile);
        });
        setProfiles(
          data.sort(
            (
              { displayName: a, hidden: a2 },
              { displayName: b, hidden: b2 }
            ) => {
              if (!!a2 === !!b2) {
                return a.localeCompare(b);
              }

              return a2 ? 1 : -1;
            }
          )
        );
      });
    }
  }, [db, user]);

  return profiles;
}
