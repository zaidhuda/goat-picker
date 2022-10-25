import { useEffect } from 'react';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { DateTime } from 'luxon';
import useFirebase from './useFirebase';

const UPDATE_FREQUENCY = 15; // Update every 15 seconds at most

export default function useUserTracker({
  db,
  user,
}: ReturnType<typeof useFirebase>) {
  useEffect(() => {
    if (db && user) {
      const updateLastSeen = () => {
        if (
          !!user.lastSeenAt &&
          DateTime.fromJSDate(user.lastSeenAt.toDate())
            .diffNow()
            .as('seconds') > -UPDATE_FREQUENCY
        ) {
          return;
        }

        setDoc(
          doc(db, 'profiles', user.id),
          { lastSeenAt: Timestamp.now() },
          { merge: true }
        );
      };

      document.addEventListener('click', updateLastSeen);

      return () => {
        document.removeEventListener('click', updateLastSeen);
      };
    }
  }, [db, user]);
}
