import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { AnnualStats } from 'types/vote';
import useFirebase from './useFirebase';
import useProfiles from './useProfiles';

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
