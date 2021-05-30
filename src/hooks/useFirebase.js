import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useState, useEffect } from "react";
import useWeek from "./useWeek";

const firebaseConfig = {
  apiKey: "AIzaSyAvV7o3gZ8nE-DtaWBuyHca2d8dh0iDn4o",
  authDomain: "goat-picker.firebaseapp.com",
  projectId: "goat-picker",
  storageBucket: "goat-picker.appspot.com",
  messagingSenderId: "413537459528",
  appId: "1:413537459528:web:119f3c0bf23f961bb4a77d",
};

const OPTIONS = "options";
const VOTES = "votes";

const useFirebase = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  const { week, year } = useWeek();

  const [db] = useState(firebase.firestore());
  const [user, setUser] = useState();
  const [options, setOptions] = useState([]);
  const [currentWeekVotes, setCurrentWeekVotes] = useState([]);

  // *** Auth API ***

  const signInWithPopup = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope("profile");
    firebase.auth().signInWithPopup(provider).catch(console.error);
  };

  const signOut = () => {
    firebase.auth().signOut().catch(console.error);
  };

  // *** Firestore API ***

  const addVote = (option, resolver) => {
    if (user.uid === option) return;

    db.collection(VOTES)
      .doc(`${year}/${week}/${user.uid}`)
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
      .doc(`${year}/${week}/${user.uid}`)
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

  // Reset state on auth state change
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
      setOptions([]);
      setCurrentWeekVotes([]);
    });
  }, []);

  // Add user to options
  useEffect(() => {
    const addUserToOptions = ({ displayName, uid, photoURL }) => {
      db.collection(OPTIONS)
        .doc(uid)
        .set({ displayName, photoURL })
        .catch(console.error);
    };

    if (user) addUserToOptions(user);
  }, [db, user]);

  // Subsbscribe to /options
  useEffect(() => {
    let listener = null;

    if (user) {
      listener = db.collection(OPTIONS).onSnapshot((querySnapshot) => {
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

    return listener ? listener.unsubscribe : null;
  }, [db, user]);

  // Subsbscribe to votes for /year/week
  useEffect(() => {
    let listener = null;

    if (user) {
      listener = db
        .collection(`${VOTES}/${year}/${week}`)
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

    return listener ? listener.unsubscribe : null;
  }, [db, user, week, year]);

  return {
    currentWeekVotes,
    options,
    user,
    addVote,
    getVotes,
    removeVote,
    signInWithPopup,
    signOut,
  };
};

export default useFirebase;
