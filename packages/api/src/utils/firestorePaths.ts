import {
  CollectionReference,
  DocumentReference,
  getFirestore,
} from 'firebase-admin/firestore';

export function profilesCollectionRef(): CollectionReference {
  return getFirestore().collection('profiles');
}

export function profileRef(id: string): DocumentReference {
  return profilesCollectionRef().doc(id);
}

export function yearRef(year: number): DocumentReference {
  return getFirestore().doc(`years/${year}`);
}

export function weekRef(year: number, week: number): DocumentReference {
  return yearRef(year)
    .collection('weeks')
    .doc(week < 10 ? `0${week}` : `${week}`);
}

export function votesCollectionRef(
  year: number,
  week: number
): CollectionReference {
  return weekRef(year, week).collection('votes');
}
