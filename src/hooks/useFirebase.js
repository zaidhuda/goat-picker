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

export const PAGINATE_PER = 10;

const useFirebase = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  const [db] = useState(firebase.firestore());
  const [connections, setConnections] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

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

  // *** close connections ***
  const close = () => {
    connections.forEach((disconnect) => {
      if (typeof disconnect === "function") disconnect();
    });
    setConnections([]);
  };

  return {
    user,
    signInWithPopup,
    signOut,
  };
};

export default useFirebase;
