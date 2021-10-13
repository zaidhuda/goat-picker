import React from "react";

import { FirebaseContext } from "../contexts";
import useFirebaseProvider from '../hooks/useFirebaseProvider';

const FirebaseProvider = (props) => {
  const firebase = useFirebaseProvider();
  const { ready } = firebase;

  if (!ready) return null;

  return <FirebaseContext.Provider value={firebase} {...props} />;
};

export default FirebaseProvider;
