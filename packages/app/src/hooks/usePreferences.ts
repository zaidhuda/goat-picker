import { useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Preferences } from 'types/preferences';
import useFirebase from './useFirebase';

const PREFERENCES = 'preferences';
const DEFAULT_PREFERENCES: Preferences = {
  THEME: 'auto',
};

export default function usePreferences() {
  const { db, user } = useFirebase();
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (db && user) {
      return onSnapshot(doc(db, PREFERENCES, user.id), (doc) => {
        setPreferences((state) => ({
          ...state,
          ...(doc.data() as Preferences),
        }));
      });
    }
  }, [db, user]);

  const setPreference = (
    key: keyof Preferences,
    value: Preferences[typeof key]
  ) => {
    if (db && user) {
      setDoc(doc(db, PREFERENCES, user.id), { [key]: value }, { merge: true });
    }
  };

  return { preferences, setPreference };
}
