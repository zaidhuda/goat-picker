import useFirebase from './useFirebase';
import { useEffect, useState } from 'react';
import { AnnualStats } from 'types/vote';
import useProfiles from './useProfiles';
import { doc, onSnapshot } from 'firebase/firestore';

export default function useStats(year: number) {
  const [stats, setStats] = useState<AnnualStats>();
  const profiles = useProfiles();
  const { db } = useFirebase();

  useEffect(() => {
    if (db) {
      return onSnapshot(doc(db, `years/${year}`), (doc) => {
        setStats(doc.data() as AnnualStats);
      });
    }
  }, [year, db, profiles]);

  return stats;
}
