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
    <div className="flex flex-col h-screen items-center justify-center space-y-12">
      <h1 className="font-light text-8xl">🐐</h1>
      <LoginButton />
    </div>
  );
};

export default LandingPage;
