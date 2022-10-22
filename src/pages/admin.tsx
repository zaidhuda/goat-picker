import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Button } from '@mui/material';
import { getLayout } from 'components/Layout';
import useFirebase from 'hooks/useFirebase';
import ProfilesPage from './profiles';

const TABS = ['Users', 'Settings'];

export default function AdminPage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user } = useFirebase();

  if (!user?.isAdmin) {
    <div className="space-y-12">
      <h1 className="font-light text-4xl">Unauthorized</h1>
    </div>;
  }

  return (
    <div className="space-y-8">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-1 rounded-lg bg-blue-900/20 p-1">
          {TABS.map((tab, index) => (
            <Tab
              key={tab}
              as={Button}
              fullWidth
              variant={index === selectedIndex ? 'contained' : 'text'}
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel as="div" className="flex flex-col gap-8">
            <ProfilesPage as="component" />
          </Tab.Panel>
          <Tab.Panel></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

AdminPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Admin' },
};
