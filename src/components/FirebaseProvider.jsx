import React from "react";

import { FirebaseContext } from "../contexts";
import useFirebase from "../hooks/useFirebase";

const FirebaseProvider = (props) => {
  const firebase = useFirebase();
  const { ready } = firebase;

  if (!ready) return null;

  return <FirebaseContext.Provider value={firebase} {...props} />;
};

export default FirebaseProvider;
