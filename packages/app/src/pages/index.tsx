import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Loader from 'components/Loader';
import LoginButton from 'components/LoginButton';
import useFirebase from 'hooks/useFirebase';

export default function LandingPage() {
  const {
    push,
    query: { redirect = '/vote' },
  } = useRouter();
  const { user } = useFirebase();

  useEffect(() => {
    const redirectUrl = new URL(redirect as string, window.location.origin);
    if (user) {
      push({
        pathname: redirectUrl.pathname,
        search: redirectUrl.search,
      });
    }
  }, [user, redirect, push]);

  return (
    <div className="fixed flex flex-col h-screen items-center justify-center space-y-12 w-screen">
      <h1 className="font-light text-8xl">🐐</h1>
      {user === null ? <LoginButton /> : <Loader />}
    </div>
  );
}

LandingPage.options = {
  head: { title: 'GOAT Picker' },
};
