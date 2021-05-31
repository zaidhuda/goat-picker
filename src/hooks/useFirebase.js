import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useState, useEffect, useCallback } from "react";
import useWeek from "./useWeek";

const OPTIONS = "options";
const VOTES = "votes";

const useFirebase = () => {
  const { currentWeek, currentYear } = useWeek();

  const [app, setApp] = useState();
  const [db, setDatabase] = useState();
  const [user, setUser] = useState();
  const [options, setOptions] = useState([]);
  const [currentWeekVotes, setCurrentWeekVotes] = useState([]);

  // *** Auth API ***

  const signInWithPopup = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    app.auth().signInWithPopup(provider).catch(console.error);
  };

  const signOut = useCallback(() => {
    app.auth().signOut().catch(console.error);
  }, [app]);

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

  const getVotes = (currentYear, currentWeek, resolver) => {
    db.collection(`${VOTES}/${currentYear}/${currentWeek}`)
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

  // Initialize Firebase app
  useEffect(() => {
    if (firebase.apps.length === 0) {
      fetch("/__/firebase/init.json").then(async (response) => {
        setApp(firebase.initializeApp(await response.json()));
      });
    } else {
      setApp(firebase.apps[0]);
    }

    return setApp;
  }, []);

  // Set up firestore
  useEffect(() => {
    if (!app) return;

    setDatabase(app.firestore());

    return setDatabase;
  }, [app]);

  // Reset state on auth state change
  useEffect(() => {
    if (app) {
      return app.auth().onAuthStateChanged((user) => {
        if (user?.email?.endsWith("@surialabs.com")) {
          setUser(user);
          setOptions([]);
          setCurrentWeekVotes([]);
        } else if (user?.email) {
          alert("@surialabs.com email only");
          signOut();
        } else {
          setUser();
        }
      });
    }
  }, [app, signOut]);

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
    ready: app && db,
    user,
    addVote,
    getVotes,
    removeVote,
    signInWithPopup,
    signOut,
  };
};

export default useFirebase;
