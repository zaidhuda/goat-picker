import useFirebase from './useFirebase';
import { useEffect, useState } from 'react';
import { AnnualStats } from 'types/vote';

const VOTES = 'votes';

export default function useStats(year: number) {
  const [stats, setStats] = useState<AnnualStats>();
  const { db } = useFirebase();

  useEffect(() => {
    if (db) {
      return db
        .collection(VOTES)
        .doc(`${year}`)
        .onSnapshot((doc) => {
          setStats(doc.data() as AnnualStats);
        });
    }
  }, [db, year]);

  return stats;
}
