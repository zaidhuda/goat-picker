import { useState, useEffect, useCallback, useContext } from 'react';
import FirebaseContext from 'contexts/FirebaseContext';
import { Config } from 'types/config';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  doc,
  Firestore,
  getFirestore,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup as firebaseSignInWithPopup,
  User,
} from 'firebase/auth';

const PROFILES = 'profiles';
const CONFIGS = 'configs';

export function useFirebaseProvider() {
  const [app, setApp] = useState<FirebaseApp>();
  const [auth, setAuth] = useState<Auth>();
  const [user, setUser] = useState<User | null>();
  const [db, setDatabase] = useState<Firestore>();
  const [configs, setConfigs] = useState<{ [key in Config]?: unknown }>({});

  const signInWithPopup = () => {
    if (auth) {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      firebaseSignInWithPopup(auth, provider).catch(console.error);
    }
  };

  const signOut = useCallback(() => {
    if (auth && user) {
      auth.signOut().catch(console.error);
    }
  }, [auth, user]);

  const getConfig = useCallback(
    <T>(config: Config, defaultValue: T) =>
      (configs[config] || defaultValue) as T,
    [configs]
  );

  // Initialize Firebase app
  useEffect(() => {
    fetch('/__/firebase/init.json').then(async (response) => {
      setApp(initializeApp(await response.json()));
    });

    return () => setApp(undefined);
  }, []);

  // Set up auth
  useEffect(() => {
    if (app) {
      setAuth(getAuth(app));
    }

    return () => setAuth(undefined);
  }, [app]);

  // Set up firestore
  useEffect(() => {
    if (app) {
      setDatabase(getFirestore(app));
    }

    return () => setDatabase(undefined);
  }, [app]);

  // Reset state on auth state change
  useEffect(() => {
    const EMAIL_DOMAIN = getConfig<string>('EMAIL_DOMAIN', '');
    if (auth && EMAIL_DOMAIN) {
      return auth?.onAuthStateChanged((newUser) => {
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
  }, [auth, getConfig, signOut]);

  // Add user to options
  useEffect(() => {
    if (db && user) {
      const { displayName, uid, photoURL } = user;
      setDoc(
        doc(db, PROFILES, uid),
        { id: uid, displayName, photoURL },
        { merge: true }
      );
    }
  }, [db, user]);

  useEffect(() => {
    if (app && app.options.appId && db) {
      return onSnapshot(doc(db, CONFIGS, app.options.appId), (doc) =>
        setConfigs(doc.data() as { [key in Config]?: unknown })
      );
    }
  }, [app, db]);

  return {
    ready: !!app && !!db,
    app,
    db,
    user,
    signInWithPopup,
    signOut,
    getConfig,
  };
}

export default function useFirebase() {
  return useContext(FirebaseContext);
}
