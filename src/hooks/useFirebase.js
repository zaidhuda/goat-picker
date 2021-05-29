import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useState, useEffect } from "react";

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

  const getOptions = (resolver) => {
    db.collection(OPTIONS)
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

  return {
    user,
    getOptions,
    signInWithPopup,
    signOut,
  };
};

export default useFirebase;
