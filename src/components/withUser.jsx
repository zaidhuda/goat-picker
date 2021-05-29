import React, { useContext } from "react";
import { Redirect } from "react-router";

import { FirebaseContext } from "../contexts";

const withUser = (WrappedComponent) => {
  return ({ ...props }) => {
    const { user } = useContext(FirebaseContext);

    if (!user) {
      return <Redirect to="/" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withUser;
