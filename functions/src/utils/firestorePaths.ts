import { firestore } from 'firebase-admin';

export function profilesCollectionRef(): firestore.CollectionReference {
  return firestore().collection('profiles');
}

export function profileRef(id: string): firestore.DocumentReference {
  return profilesCollectionRef().doc(id);
}

export function yearRef(year: number): firestore.DocumentReference {
  return firestore().doc(`years/${year}`);
}

export function weekRef(
  year: number,
  week: number
): firestore.DocumentReference {
  return yearRef(year)
    .collection('weeks')
    .doc(week < 10 ? `0${week}` : `${week}`);
}

export function votesCollectionRef(
  year: number,
  week: number
): firestore.CollectionReference {
  return weekRef(year, week).collection('votes');
}
