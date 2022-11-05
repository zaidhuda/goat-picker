import { useCallback } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import { DateTime } from 'luxon';
import { Profile } from 'types/profile';
import useFirebase from './useFirebase';

const ATTENDANCES = 'attendances';

export default function useAttendances() {
  const { db, user } = useFirebase();

  const addAttendance = (date: DateTime, resolve?: (value: void) => void) => {
    if (db && user) {
      setDoc(
        doc(db, `${ATTENDANCES}/${date.toISODate()}/attendances/${user.id}`),
        {
          id: user.id,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }
      )
        .then(resolve)
        .catch(console.error);
    }
  };

  const removeAttendance = (
    date: DateTime,
    resolve?: (value: void) => void
  ) => {
    if (db && user) {
      deleteDoc(
        doc(db, `${ATTENDANCES}/${date.toISODate()}/attendances/${user.id}`)
      )
        .then(resolve)
        .catch(console.error);
    }
  };

  const getAttendances = useCallback(
    (date: DateTime, resolve: (value: Profile[]) => void) => {
      if (db && user) {
        return onSnapshot(
          collection(db, `${ATTENDANCES}/${date.toISODate()}/attendances`),
          (querySnapshot) => {
            const data: Profile[] = [];
            querySnapshot.forEach((doc) => {
              data.push(doc.data() as Profile);
            });
            resolve(data);
          }
        );
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
