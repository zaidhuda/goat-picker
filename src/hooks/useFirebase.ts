import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useState, useEffect, useCallback, Context, useContext } from 'react';
import FirebaseContext from 'contexts/FirebaseContext';

const EMAIL_DOMAIN = '@surialabs.com';
const PROFILES = 'profiles';

export function useFirebaseProvider() {
  const [app, setApp] = useState<firebase.app.App>();
  const [db, setDatabase] = useState<firebase.firestore.Firestore>();
  const [user, setUser] = useState<firebase.User | null>();

  // *** Auth API ***

  const signInWithPopup = () => {
    if (app) {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      app.auth().signInWithPopup(provider).catch(console.error);
    }
  };

  const signOut = useCallback(() => {
    if (app && user) {
      app.auth().signOut().catch(console.error);
    }
  }, [app, user]);

  // Initialize Firebase app
  useEffect(() => {
    if (firebase.apps.length === 0) {
      fetch('/__/firebase/init.json').then(async (response) => {
        setApp(firebase.initializeApp(await response.json()));
      });
    } else {
      setApp(firebase.apps[0]);
    }

    return () => setApp(undefined);
  }, []);

  // Set up firestore
  useEffect(() => {
    if (app) {
      setDatabase(app.firestore());
    }

    return () => setDatabase(undefined);
  }, [app]);

  // Reset state on auth state change
  useEffect(() => {
    if (app) {
      return app.auth().onAuthStateChanged((newUser) => {
        if (newUser?.email?.endsWith(EMAIL_DOMAIN)) {
          setUser(newUser);
        } else if (newUser?.email) {
          alert(`${EMAIL_DOMAIN} email only`);
          signOut();
        } else {
          setUser(newUser);
        }
      });
    }
  }, [app, signOut]);

  useEffect(() => signOut, [signOut]);

  // Add user to options
  useEffect(() => {
    if (db && user) {
      const { displayName, uid, photoURL } = user;
      db.collection(PROFILES)
        .doc(uid)
        .set({ id: uid, displayName, photoURL })
        .catch(console.error);
    }
  }, [db, user]);

  return {
    ready: !!app && !!db,
    app,
    db,
    user,
    signInWithPopup,
    signOut,
  };
}

export default function useFirebase() {
  return useContext(FirebaseContext);
}
