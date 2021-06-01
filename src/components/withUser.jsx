import React, { useContext } from "react";
import { Redirect } from "react-router";

import { FirebaseContext } from "../contexts";

const withUser = (WrappedComponent) => {
  return ({ ...props }) => {
    const { user } = useContext(FirebaseContext);

    if (!user) {
      return <Redirect to="/" />;
    }

    return (
      <div className="container mx-auto pt-12">
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default withUser;
