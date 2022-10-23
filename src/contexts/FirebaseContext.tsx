import { createContext } from 'react';
import { Firestore } from 'firebase/firestore';
import { Configurations, GetConfigFn } from 'types/config';
import { Profile } from 'types/profile';

const FirebaseContext = createContext<{
  ready?: boolean;
  db?: Firestore;
  user?: Profile | null;
  configs?: Configurations;
  signInWithPopup: () => void;
  signOut: () => void;
  getConfig: GetConfigFn;
}>({
  signInWithPopup: () => void 0,
  signOut: () => void 0,
  getConfig: <T extends keyof Configurations>(
    config: T,
    defaultValue: NonNullable<Configurations[T]>
  ) => defaultValue,
});

export default FirebaseContext;
