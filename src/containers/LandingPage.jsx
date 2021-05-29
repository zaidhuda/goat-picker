import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { FirebaseContext } from "../contexts";

const LandingPage = () => {
  const history = useHistory();
  const { user, signInWithPopup } = useContext(FirebaseContext);

  useEffect(() => {
    console.log(user);
    if (user) return history.push("/votes");
  }, [user, history]);

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={signInWithPopup}>Sign In</button>
    </div>
  );
};

export default LandingPage;
