import 'styles/global.css';

import { ReactElement, ReactNode, useEffect } from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';

import Loader from 'components/Loader';
import { NextPage } from 'next';
import { useFirebaseProvider } from 'hooks/useFirebase';
import FirebaseContext from 'contexts/FirebaseContext';

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

type NextPageWithLayout = NextPage & {
  options?: {
    layout?: (page: ReactElement) => ReactNode;
    withUser?: boolean;
    head?: {
      title?: string;
    };
  };
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
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
