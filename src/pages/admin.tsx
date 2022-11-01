import React from 'react';
import { Tab } from '@headlessui/react';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { getLayout } from 'components/Layout';
import useFirebase from 'hooks/useFirebase';
import ProfilesPage from './profiles';
import SettingsPage from './settings';

const TABS = [
  { name: 'Profiles', component: ProfilesPage },
  { name: 'Settings', component: SettingsPage },
];

const getSelectedTab = (tab: string | string[] | undefined) =>
  Math.max(
    0,
    TABS.findIndex((t) => t.name === tab)
  );

export default function AdminPage() {
  const { user } = useFirebase();
  const {
    query: { tab, ...query },
    push,
  } = useRouter();

  const selectedIndex = getSelectedTab(tab);

  const onTabChange = (tab: number) =>
    push({
      query: {
        ...query,
        tab: TABS[tab].name,
      },
    });

  if (!user?.isAdmin) {
    <div className="space-y-12">
      <h1 className="font-light text-4xl">Unauthorized</h1>
    </div>;
  }

  return (
    <div className="space-y-8">
      <Tab.Group selectedIndex={selectedIndex} onChange={onTabChange}>
        <Tab.List className="flex space-x-1 rounded-lg bg-blue-900/20 p-1">
          {TABS.map(({ name }, index) => (
            <Tab
              key={name}
              as={Button}
              fullWidth
              variant={selectedIndex === index ? 'contained' : 'text'}
            >
              {name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {TABS.map(({ name, component: Component }) => (
            <Tab.Panel key={name} as="div" className="flex flex-col gap-8">
              <Component as="component" />
            </Tab.Panel>
          ))}
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
