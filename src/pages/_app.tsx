import 'styles/global.css';

import { ReactElement, ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Settings } from 'luxon';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import Loader from 'components/Loader';
import FirebaseContext from 'contexts/FirebaseContext';
import { useFirebaseProvider } from 'hooks/useFirebase';
import useUserTracker from 'hooks/useUserTracker';
import muiTheme from 'lib/muiTheme';

Settings.defaultZone = 'Asia/Kuala_Lumpur';
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

  useUserTracker(firebase);

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
      <ThemeProvider theme={muiTheme}>
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </FirebaseContext.Provider>
  );
}
