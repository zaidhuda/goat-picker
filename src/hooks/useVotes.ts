import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import useWeek from './useWeek';
import { UserVote } from 'types/vote';
import useFirebase from './useFirebase';
import { useCallback } from 'react';

const VOTES = 'votes';

export default function useVotes() {
  const { db, user } = useFirebase();
  const { currentWeek, currentYear } = useWeek();

  const addVote = (id: string, resolve?: (value: void) => void) => {
    if (db && user) {
      if (user.uid === id) return;

      db.collection(VOTES)
        .doc(`${currentYear}/${currentWeek}/${user.uid}`)
        .set(
          {
            votes: firebase.firestore.FieldValue.arrayUnion(id),
          },
          { merge: true }
        )
        .then(resolve)
        .catch(console.error);
    }
  };

  const removeVote = (id: string, resolve?: (value: void) => void) => {
    if (db && user) {
      db.collection(VOTES)
        .doc(`${currentYear}/${currentWeek}/${user.uid}`)
        .update({
          votes: firebase.firestore.FieldValue.arrayRemove(id),
        })
        .then(resolve)
        .catch(console.error);
    }
  };

  const getVotes = useCallback(
    (year: number, week: number, resolve: (value: UserVote[]) => void) => {
      if (db && user) {
        return db
          .collection(`${VOTES}/${year}/${week}`)
          .onSnapshot((querySnapshot) => {
            const data: UserVote[] = [];
            querySnapshot.forEach((doc) => {
              data.push({
                id: doc.id,
                ...doc.data(),
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
