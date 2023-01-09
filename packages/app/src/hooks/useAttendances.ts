import { useCallback } from 'react';
import {
  collectionGroup,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { DateTime } from 'luxon';
import { Attendance } from 'types/attendance';
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
          date: date.toISODate(),
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
    (year: number, week: number, resolve: (value: Attendance[]) => void) => {
      if (db && user) {
        const date = DateTime.fromObject({
          weekYear: year,
          weekNumber: week,
        }).startOf('week');

        return onSnapshot(
          query(
            collectionGroup(db, 'attendances'),
            where('date', '>=', date.toISODate()),
            where('date', '<=', date.endOf('week').toISODate())
          ),
          (querySnapshot) => {
            const data: Attendance[] = [];
            querySnapshot.forEach((doc) => {
              data.push(doc.data() as Attendance);
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
