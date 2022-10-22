import { createContext } from 'react';
import { User } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { Config } from 'types/config';

const FirebaseContext = createContext<{
  ready?: boolean;
  db?: Firestore;
  user?: User | null;
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
