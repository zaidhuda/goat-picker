import React from 'react';
import { Redirect } from 'react-router';

import useFirebase from '../hooks/useFirebase';

export default function withUser(WrappedComponent) {
  return function WithUser({ ...props }) {
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
}
