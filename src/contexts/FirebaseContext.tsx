import { createContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const FirebaseContext = createContext<{
  ready?: boolean;
  app?: firebase.app.App;
  db?: firebase.firestore.Firestore;
  user?: firebase.User | null;
  signInWithPopup: () => void;
  signOut: () => void;
}>({
  signInWithPopup: () => void 0,
  signOut: () => void 0,
});

export default FirebaseContext;
