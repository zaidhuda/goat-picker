import { useState, useEffect, useCallback, useContext } from 'react';
import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup as firebaseSignInWithPopup,
  User,
} from 'firebase/auth';
import {
  doc,
  Firestore,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import FirebaseContext from 'contexts/FirebaseContext';
import { Configurations } from 'types/config';
import { Profile } from 'types/profile';

const PROFILES = 'profiles';
const CONFIGS = 'configs';

export function useFirebaseProvider() {
  const [app, setApp] = useState<FirebaseApp>();
  const [auth, setAuth] = useState<Auth>();
  const [user, setUser] = useState<Profile | null>();
  const [db, setDatabase] = useState<Firestore>();
  const [configs, setConfigs] = useState<Configurations>({});

  const signInWithPopup = () => {
    if (auth) {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      firebaseSignInWithPopup(auth, provider).catch(console.error);
    }
  };

  const signOut = useCallback(() => {
    if (auth) {
      auth.signOut().catch(console.error);
    }
  }, [auth]);

  const getConfig = useCallback(
    <T extends keyof Configurations>(
      config: T,
      defaultValue: NonNullable<Configurations[T]>
    ) => configs[config] || defaultValue,
    [configs]
  );

  // Add user to options
  const saveUser = useCallback(
    (user: User) => {
      if (db && user) {
        const { displayName, uid, photoURL } = user;
        const docRef = doc(db, PROFILES, uid);
        setDoc(
          docRef,
          {
            id: uid,
            displayName,
            photoURL,
            hidden: false,
            lastSeenAt: Timestamp.now(),
          },
          { merge: true }
        ).then(() =>
          getDoc(docRef).then((doc) => setUser(doc.data() as Profile))
        );
      } else {
        setUser(null);
      }
    },
    [db]
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
    const EMAIL_DOMAIN = getConfig('EMAIL_DOMAIN', '');
    if (db && auth && EMAIL_DOMAIN) {
      return auth?.onAuthStateChanged((authState) => {
        if (authState?.email?.endsWith(EMAIL_DOMAIN)) {
          saveUser(authState);
        } else if (authState?.email) {
          alert(`${EMAIL_DOMAIN} email only`);
          signOut();
        } else {
          setUser(null);
        }
      });
    }
  }, [db, auth, getConfig, saveUser, signOut]);

  useEffect(() => {
    if (db) {
      return onSnapshot(doc(db, CONFIGS, 'web'), (doc) =>
        setConfigs(doc.data() as Configurations)
      );
    }
  }, [db]);

  return {
    ready: !!db,
    db,
    user,
    configs,
    signInWithPopup,
    signOut,
    getConfig,
  };
}

export default function useFirebase() {
  return useContext(FirebaseContext);
}
