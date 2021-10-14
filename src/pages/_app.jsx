import '../styles/global.css';

import { useEffect } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';

import { FirebaseContext } from '../contexts';

import useFirebaseProvider from '../hooks/useFirebaseProvider';

import Loader from '../components/Loader';

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.options?.layout || ((page) => page);

  const { push } = useRouter();

  const firebase = useFirebaseProvider();
  const { ready, user } = firebase;

  useEffect(() => {
    Router.events.on('routeChangeStart', NProgress.start);
    Router.events.on('routeChangeComplete', NProgress.done);
    Router.events.on('routeChangeError', NProgress.done);

    return () => {
      Router.events.off('routeChangeStart', NProgress.start);
      Router.events.off('routeChangeComplete', NProgress.done);
      Router.events.off('routeChangeError', NProgress.done);
    };
  }, []);

  useEffect(() => {
    if (Component.options?.withUser && ready && user === null) {
      push('/');
    }
  }, [ready, user, push, Component]);

  if (!ready || (Component.options?.withUser && !user)) {
    return <Loader />;
  }

  return (
    <FirebaseContext.Provider value={firebase}>
      <Head>
        <title>{Component.options?.head?.title || 'GOAT Picker'}</title>
      </Head>
      {getLayout(<Component {...pageProps} />)}
    </FirebaseContext.Provider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};
