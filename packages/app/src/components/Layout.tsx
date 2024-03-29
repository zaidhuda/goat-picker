import React, { ReactNode } from 'react';
import Navbar from './Navbar';

export function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container max-w-screen-md mx-auto py-8">{children}</main>
    </>
  );
}
