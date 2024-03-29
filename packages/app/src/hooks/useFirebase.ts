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
  enableMultiTabIndexedDbPersistence,
  Firestore,
  getFirestore,
  onSnapshot,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import FirebaseContext from 'contexts/FirebaseContext';
import { Configurations } from 'types/config';
import { Profile } from 'types/profile';
import useProfiles from './useProfiles';

const PROFILES = 'profiles';
const CONFIGS = 'configs';

export function useFirebaseProvider() {
  const [app, setApp] = useState<FirebaseApp>();
  const [auth, setAuth] = useState<Auth>();
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [user, setUser] = useState<Profile | null>();
  const [db, setDatabase] = useState<Firestore>();
  const [configs, setConfigs] = useState<Configurations>({});

  const profiles = useProfiles(db, currentUser);

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
      const db = getFirestore(app);
      setDatabase(db);
      enableMultiTabIndexedDbPersistence(db).catch((err) => console.error(err));
    }

    return () => setDatabase(undefined);
  }, [app]);

  // Reset state on auth state change
  useEffect(() => {
    const EMAIL_DOMAIN = getConfig('EMAIL_DOMAIN', '');
    if (db && auth && EMAIL_DOMAIN) {
      return auth?.onAuthStateChanged((authState) => {
        if (authState?.email?.endsWith(EMAIL_DOMAIN)) {
          setCurrentUser(authState);
          const { displayName, uid, photoURL } = authState;
          setDoc(
            doc(db, PROFILES, uid),
            {
              id: uid,
              displayName,
              photoURL,
              hidden: false,
              lastSeenAt: Timestamp.now(),
            },
            { merge: true }
          );
        } else if (authState?.email) {
          alert(`${EMAIL_DOMAIN} email only`);
          signOut();
        } else {
          setUser(null);
        }
      });
    }
  }, [db, auth, getConfig, signOut]);

  useEffect(() => {
    if (db && currentUser) {
      return onSnapshot(doc(db, PROFILES, currentUser.uid), (doc) =>
        setUser(doc.data() as Profile)
      );
    }
  }, [db, currentUser]);

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
    profiles,
    signInWithPopup,
    signOut,
    getConfig,
  };
}

export default function useFirebase() {
  return useContext(FirebaseContext);
}
