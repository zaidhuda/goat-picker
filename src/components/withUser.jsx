import React from 'react';
import { Redirect } from 'react-router';

import useFirebase from '../hooks/useFirebase';

const withUser = (WrappedComponent) => {
  return ({ ...props }) => {
    const { user } = useFirebase();

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
