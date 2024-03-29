import { useCallback } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  QueryConstraint,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { UserVote } from 'types/vote';
import useFirebase from './useFirebase';
import useWeek from './useWeek';

const collectionPath = (year: number, week: number) =>
  `years/${year}/weeks/${week < 10 ? `0${week}` : week}/votes`;
const docPath = (voter: string, voted: string) => `${voter}:${voted}`;

export default function useVotes() {
  const { db, user } = useFirebase();
  const { currentWeek, currentYear } = useWeek();

  const addVote = (id: string, resolve?: () => void) => {
    if (db && user) {
      if (user.id === id) return;

      setDoc(
        doc(db, collectionPath(currentYear, currentWeek), docPath(user.id, id)),
        {
          voter: doc(db, `profiles/${user.id}`),
          voted: doc(db, `profiles/${id}`),
          year: currentYear,
          week: currentWeek,
          timestamp: serverTimestamp(),
        }
      )
        .then(resolve)
        .catch(console.error);
    }
  };

  const removeVote = (id: string, resolve?: () => void) => {
    if (db && user) {
      deleteDoc(
        doc(db, collectionPath(currentYear, currentWeek), docPath(user.id, id))
      )
        .then(resolve)
        .catch(console.error);
    }
  };

  const getVotes = useCallback(
    (
      year: number,
      week: number,
      resolve: (value: UserVote[]) => void,
      ...queryConstraints: QueryConstraint[]
    ) => {
      if (db) {
        return onSnapshot(
          query(
            collection(db, collectionPath(year, week)),
            ...queryConstraints
          ),
          (querySnapshot) => {
            const data: UserVote[] = [];
            querySnapshot.forEach((doc) => {
              data.push({
                id: doc.id,
                ...(doc.data() as Omit<UserVote, 'id'>),
              });
            });
            resolve(data);
          }
        );
      }
    },
    [db]
  );

  const getUserVotes = useCallback(
    (year: number, week: number, resolve: (value: UserVote[]) => void) => {
      if (db && user) {
        return getVotes(
          year,
          week,
          resolve,
          where('voter', '==', doc(db, `profiles/${user?.id}`))
        );
      }
    },
    [db, user, getVotes]
  );

  return {
    addVote,
    removeVote,
    getVotes,
    getUserVotes,
  };
}
