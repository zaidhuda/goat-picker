import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useState, useEffect, useCallback } from 'react';
import useWeek from './useWeek';

const OPTIONS = 'options';
const VOTES = 'votes';
const ATTENDANCES = 'attendances';
const EMAIL_DOMAIN = '@surialabs.com';

const useFirebaseProvider = () => {
  const { currentWeek, currentYear } = useWeek();

  const [app, setApp] = useState();
  const [db, setDatabase] = useState();
  const [user, setUser] = useState();
  const [options, setOptions] = useState([]);
  const [currentWeekVotes, setCurrentWeekVotes] = useState([]);

  // *** Auth API ***

  const signInWithPopup = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    app.auth().signInWithPopup(provider).catch(console.error);
  };

  const signOut = useCallback(() => {
    if (!app || !user) return;

    app.auth().signOut().catch(console.error);
  }, [app, user]);

  // *** Firestore API ***

  const addVote = (option, resolver) => {
    if (user.uid === option) return;

    db.collection(VOTES)
      .doc(`${currentYear}/${currentWeek}/${user.uid}`)
      .set(
        {
          votes: firebase.firestore.FieldValue.arrayUnion(option),
        },
        { merge: true }
      )
      .then(resolver)
      .catch(console.error);
  };

  const removeVote = (option, resolver) => {
    db.collection(VOTES)
      .doc(`${currentYear}/${currentWeek}/${user.uid}`)
      .update({
        votes: firebase.firestore.FieldValue.arrayRemove(option),
      })
      .then(resolver)
      .catch(console.error);
  };

  const getVotes = (year, week, resolver) => {
    db.collection(`${VOTES}/${year}/${week}`)
      .get()
      .then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        resolver(data);
      });
  };

  const addAttendance = (date, resolver) => {
    db.collection(`${ATTENDANCES}/${date.year}/${date.weekNumber}`)
      .doc(date.toISODate())
      .set(
        {
          attendees: firebase.firestore.FieldValue.arrayUnion(user.uid),
        },
        { merge: true }
      )
      .then(resolver)
      .catch(console.error);
  };

  const removeAttendance = (date, resolver) => {
    db.collection(`${ATTENDANCES}/${date.year}/${date.weekNumber}`)
      .doc(date.toISODate())
      .update({
        attendees: firebase.firestore.FieldValue.arrayRemove(user.uid),
      })
      .then(resolver)
      .catch(console.error);
  };

  const getAttendances = (year, week, resolver) =>
    db
      .collection(`${ATTENDANCES}/${year}/${week}`)
      .onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        resolver(data);
      });

  // Initialize Firebase app
  useEffect(() => {
    if (firebase.apps.length === 0) {
      fetch('/__/firebase/init.json').then(async (response) => {
        setApp(firebase.initializeApp(await response.json()));
      });
    } else {
      setApp(firebase.apps[0]);
    }

    return setApp;
  }, []);

  // Set up firestore
  useEffect(() => {
    if (app) {
      setDatabase(app.firestore());
    }

    return setDatabase;
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
          setUser();
        }
      });
    }
  }, [app, signOut]);

  useEffect(() => signOut, [signOut]);

  // Add user to options
  useEffect(() => {
    if (db && user) {
      const { displayName, uid, photoURL } = user;
      db.collection(OPTIONS)
        .doc(uid)
        .set({ displayName, photoURL })
        .catch(console.error);
    }
  }, [db, user]);

  // Subscribe to /options
  useEffect(() => {
    if (db && user) {
      return db.collection(OPTIONS).onSnapshot((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setOptions(data);
      });
    }
  }, [db, user]);

  // Subscribe to votes for /year/week
  useEffect(() => {
    if (db && user) {
      return db
        .collection(`${VOTES}/${currentYear}/${currentWeek}`)
        .onSnapshot((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            data.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          setCurrentWeekVotes(data);
        });
    }
  }, [currentWeek, currentYear, db, user]);

  return {
    currentWeekVotes,
    options,
    users: options,
    ready: app && db,
    user,
    addVote,
    getVotes,
    removeVote,
    addAttendance,
    removeAttendance,
    getAttendances,
    signInWithPopup,
    signOut,
  };
};

export default useFirebaseProvider;
