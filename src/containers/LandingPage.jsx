import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { FirebaseContext } from "../contexts";

import LoginButton from "../components/LoginButton";

const LandingPage = () => {
  const history = useHistory();
  const { user } = useContext(FirebaseContext);

  useEffect(() => {
    console.log(user);
    if (user) return history.push("/votes");
  }, [user, history]);

  return (
    <div className="flex h-screen items-center justify-center w-screen">
      <LoginButton />
    </div>
  );
};

export default LandingPage;
