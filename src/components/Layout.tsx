import React, { ReactNode } from 'react';

import Navbar from './Navbar';

export function getLayout(page: ReactNode) {
  return <Layout>{page}</Layout>;
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto py-12">{children}</main>
    </>
  );
}
