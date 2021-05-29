import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useState, useEffect } from "react";
import { DateTime } from "luxon";

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

  const [db] = useState(firebase.firestore());
  const [user, setUser] = useState();
  const [options, setOptions] = useState([]);
  const [currentUserVotes, setCurrentUserVotes] = useState([]);

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
    if (!user.uid || user.uid === option) return;

    const now = DateTime.now();
    const year = now.year;
    const week = now.weekNumber;

    db.collection(VOTES)
      .doc(`${year}-${week}-${option}-${user.uid}`)
      .set({ voter: user.uid, option, week, year })
      .then(resolver)
      .catch(console.error);
  };

  const removeVote = (id, resolver) => {
    db.collection(VOTES).doc(id).delete().then(resolver).catch(console.error);
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    const addUserToOptions = ({ displayName, uid, photoURL }) => {
      db.collection(OPTIONS)
        .doc(uid)
        .set({ displayName, photoURL })
        .catch(console.error);
    };

    if (user) addUserToOptions(user);
  }, [db, user]);

  useEffect(() => {
    const getOptions = (resolver) => {
      db.collection(OPTIONS)
        .onSnapshot((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            if (doc.id !== user.uid) {
              data.push({
                id: doc.id,
                ...doc.data(),
              });
            }
          });
          resolver(data);
        });
    };
  
    const getCurrentUserVotes = (resolver) => {
      const now = DateTime.now();
      const year = now.year;
      const week = now.weekNumber;
  
      db.collection(VOTES)
        .where("year", "==", year)
        .where("week", "==", week)
        .where("voter", "==", user.uid)
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
    };

    if (user) {
      getOptions(setOptions);
      getCurrentUserVotes(setCurrentUserVotes);
    }
  }, [db, user])

  return {
    currentUserVotes,
    options,
    user,
    addVote,
    removeVote,
    signInWithPopup,
    signOut,
  };
};

export default useFirebase;
