import { createContext } from 'react';
import { Firestore } from 'firebase/firestore';
import { Config } from 'types/config';
import { Profile } from 'types/profile';

const FirebaseContext = createContext<{
  ready?: boolean;
  db?: Firestore;
  user?: Profile | null;
  signInWithPopup: () => void;
  signOut: () => void;
  getConfig: <T = void>(config: Config, defaultValue: T) => T;
}>({
  signInWithPopup: () => void 0,
  signOut: () => void 0,
  getConfig: <T,>(config: Config, defaultValue: T) =>
    (config || defaultValue) as T,
});

export default FirebaseContext;
