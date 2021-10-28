import React from 'react';

import { getLayout } from 'components/Layout';
import useProfiles from 'hooks/useProfiles';
import { Avatar } from '@mui/material';

export default function ProfilesPage() {
  const profiles = useProfiles();

  return (
    <div className="space-y-12">
      <h1 className="font-light text-4xl">Profiles</h1>
      <div className="flex flex-wrap gap-2">
        {profiles.map(({ id, photoURL, displayName }) => (
          <Avatar
            key={id}
            src={photoURL}
            alt={displayName}
            title={displayName}
          />
        ))}
      </div>
    </div>
  );
}

ProfilesPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Profiles' },
};
