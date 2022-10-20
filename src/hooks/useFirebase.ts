import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';
import { useState, useEffect, useCallback, useContext } from 'react';
import FirebaseContext from 'contexts/FirebaseContext';
import { Config } from 'types/config';

const PROFILES = 'profiles';
const CONFIGS = 'configs';

export function useFirebaseProvider() {
  const [app, setApp] = useState<firebase.app.App>();
  const [db, setDatabase] = useState<firebase.firestore.Firestore>();
  const [functions, setFunctions] = useState<firebase.functions.Functions>();
  const [user, setUser] = useState<firebase.User | null>();
  const [configs, setConfigs] = useState<{ [key in Config]?: unknown }>({});

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

  const getConfig = useCallback(
    <T>(config: Config, defaultValue: T) =>
      (configs[config] || defaultValue) as T,
    [configs]
  );

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

  // Set up functions
  useEffect(() => {
    if (app) {
      setFunctions(app.functions());
    }

    return () => setFunctions(undefined);
  }, [app]);

  // Reset state on auth state change
  useEffect(() => {
    const EMAIL_DOMAIN = getConfig<string>('EMAIL_DOMAIN', '');
    if (app && EMAIL_DOMAIN) {
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
  }, [app, getConfig, signOut]);

  useEffect(() => signOut, [signOut]);

  // Add user to options
  useEffect(() => {
    if (db && user) {
      const { displayName, uid, photoURL } = user;
      db.collection(PROFILES)
        .doc(uid)
        .set({ id: uid, displayName, photoURL }, { merge: true })
        .catch(console.error);
    }
  }, [db, user]);

  useEffect(() => {
    if (app && db) {
      return db
        .collection(CONFIGS)
        .doc((app.options as { appId: string }).appId)
        .onSnapshot((doc) =>
          setConfigs(doc.data() as { [key in Config]?: unknown })
        );
    }
  }, [app, db]);

  return {
    ready: !!app && !!db && !!functions,
    app,
    functions,
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
