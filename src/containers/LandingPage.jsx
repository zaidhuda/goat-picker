import React, { useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";

import { FirebaseContext } from "../contexts";

import LoginButton from "../components/LoginButton";

const LandingPage = () => {
  const history = useHistory();
  const { user } = useContext(FirebaseContext);

  useEffect(() => {
    if (user) return history.push("/vote");
  }, [user, history]);

  return (
    <div className="flex h-screen items-center justify-center w-screen">
      <LoginButton />
    </div>
  );
};

export default LandingPage;
