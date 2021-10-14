import React from 'react';
import PropTypes from 'prop-types';

import Navbar from './Navbar';

export function getLayout(page) {
  return <Layout>{page}</Layout>;
}

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto pt-12">{children}</main>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
