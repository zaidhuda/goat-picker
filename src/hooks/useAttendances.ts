import { DateTime } from 'luxon';
import { useCallback } from 'react';
import { Profile } from 'types/profile';
import useFirebase from './useFirebase';

const ATTENDANCES = 'attendances';

export default function useAttendances() {
  const { db, user } = useFirebase();

  const addAttendance = (date: DateTime, resolve?: (value: void) => void) => {
    if (db && user) {
      db.collection(`${ATTENDANCES}/${date.toISODate()}/attendances`)
        .doc(user.uid)
        .set({
          id: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        })
        .then(resolve)
        .catch(console.error);
    }
  };

  const removeAttendance = (
    date: DateTime,
    resolve?: (value: void) => void
  ) => {
    if (db && user) {
      db.collection(`${ATTENDANCES}/${date.toISODate()}/attendances`)
        .doc(user.uid)
        .delete()
        .then(resolve)
        .catch(console.error);
    }
  };

  const getAttendances = useCallback(
    (date: DateTime, resolve: (value: Profile[]) => void) => {
      if (db && user) {
        return db
          .collection(`${ATTENDANCES}/${date.toISODate()}/attendances`)
          .onSnapshot((querySnapshot) => {
            const data: Profile[] = [];
            querySnapshot.forEach((doc) => {
              data.push(doc.data() as Profile);
            });
            resolve(data);
          });
      }
    },
    [db, user]
  );

  return {
    addAttendance,
    removeAttendance,
    getAttendances,
  };
}
