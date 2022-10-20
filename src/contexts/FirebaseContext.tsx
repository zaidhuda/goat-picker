import { createContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Config } from 'types/config';
import { Firestore } from 'firebase/firestore';
import { User } from 'firebase/auth';

const FirebaseContext = createContext<{
  ready?: boolean;
  app?: FirebaseApp;
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
