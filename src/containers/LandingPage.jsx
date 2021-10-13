import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import useFirebase from '../hooks/useFirebase';

import LoginButton from '../components/LoginButton';

const LandingPage = () => {
  const history = useHistory();
  const { user } = useFirebase();

  useEffect(() => {
    if (user) return history.push('/vote');
  }, [user, history]);

  return (
    <div className="fixed flex flex-col h-screen items-center justify-center space-y-12 w-screen">
      <h1 className="font-light text-8xl">🐐</h1>
      <LoginButton />
    </div>
  );
};

export default LandingPage;
