import { createContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Config } from 'types/config';

const FirebaseContext = createContext<{
  ready?: boolean;
  app?: firebase.app.App;
  db?: firebase.firestore.Firestore;
  functions?: firebase.functions.Functions;
  user?: firebase.User | null;
  signInWithPopup: () => void;
  signOut: () => void;
  getConfig: <T = void>(config: Config, defaultValue: T) => T;
}>({
  signInWithPopup: () => void 0,
  signOut: () => void 0,
  getConfig: <T,>(config: Config, defaultValue: T) => defaultValue as T,
});

export default FirebaseContext;
