import firebase from 'firebase/app';
import 'firebase/firestore';
import useWeek from './useWeek';
import { UserVote } from 'types/vote';
import useFirebase from './useFirebase';
import { useCallback } from 'react';

const collectionPath = (year: number, week: number) =>
  `years/${year}/weeks/${week < 10 ? `0${week}` : week}/votes`;
const docPath = (voter: string, voted: string) => `${voter}:${voted}`;

export default function useVotes() {
  const { db, user } = useFirebase();
  const { currentWeek, currentYear } = useWeek();

  const addVote = (id: string, resolve?: () => void) => {
    if (db && user) {
      if (user.uid === id) return;

      db.collection(collectionPath(currentYear, currentWeek))
        .doc(docPath(user.uid, id))
        .set({
          voter: db.doc(`profiles/${user.uid}`),
          voted: db.doc(`profiles/${id}`),
          year: currentYear,
          week: currentWeek,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(resolve)
        .catch(console.error);
    }
  };

  const removeVote = (id: string, resolve?: () => void) => {
    if (db && user) {
      db.collection(collectionPath(currentYear, currentWeek))
        .doc(docPath(user.uid, id))
        .delete()
        .then(resolve)
        .catch(console.error);
    }
  };

  const getVotes = useCallback(
    (year: number, week: number, resolve: (value: UserVote[]) => void) => {
      if (db && user) {
        return db
          .collection(collectionPath(year, week))
          .onSnapshot((querySnapshot) => {
            const data: UserVote[] = [];
            querySnapshot.forEach((doc) => {
              data.push({
                id: doc.id,
                ...(doc.data() as Omit<UserVote, 'id'>),
              });
            });
            resolve(data);
          });
      }
    },
    [db, user]
  );

  return {
    addVote,
    removeVote,
    getVotes,
  };
}
