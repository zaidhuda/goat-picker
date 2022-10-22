import React from 'react';
import { getLayout } from 'components/Layout';
import useFirebase from 'hooks/useFirebase';

export default function ProfilesPage() {
  const { user } = useFirebase();

  if (!user?.isAdmin) {
    <div className="space-y-12">
      <h1 className="font-light text-4xl">Unauthorized</h1>
    </div>;
  }

  return (
    <div className="space-y-12">
      <h1 className="font-light text-4xl">Admin</h1>
    </div>
  );
}

ProfilesPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Admin' },
};
