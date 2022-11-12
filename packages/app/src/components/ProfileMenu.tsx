import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  AdminPanelSettings,
  DataObject,
  MoreVert,
  PersonAdd,
  PersonRemove,
} from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { Profile } from 'types/profile';
import SlackIcon from './SlackIcon';

export type ProfileMenuAction =
  | 'slackId'
  | 'activate'
  | 'deactivate'
  | 'setAdmin'
  | 'removeAdmin';

export default function ProfileMenu({
  profile: { docUrl, hidden, isAdmin },
  onMenuClick,
}: {
  profile: Profile;
  onMenuClick: (action: ProfileMenuAction) => () => void;
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={Fragment}>
        <IconButton color="primary">
          <MoreVert className="dark:text-white text-base" />
        </IconButton>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-36 mt-2 origin-top-right bg-white dark:bg-gray-700 rounded-md outline-none drop-shadow-lg z-10">
          <Menu.Item>
            <a href={docUrl} target={docUrl}>
              <Button
                fullWidth
                color="secondary"
                className="!normal-case"
                startIcon={<DataObject />}
              >
                Firestore
              </Button>
            </a>
          </Menu.Item>
          {!hidden ? (
            <Menu.Item
              as={Button}
              fullWidth
              className="!normal-case"
              color="error"
              onClick={onMenuClick(isAdmin ? 'removeAdmin' : 'setAdmin')}
              startIcon={<AdminPanelSettings />}
            >
              {isAdmin ? 'Remove admin' : 'Make admin'}
            </Menu.Item>
          ) : null}
          <Menu.Item
            as={Button}
            fullWidth
            className="!normal-case"
            onClick={onMenuClick('slackId')}
            startIcon={<SlackIcon />}
          >
            Slack ID
          </Menu.Item>
          <Menu.Item
            as={Button}
            fullWidth
            color={hidden ? 'success' : 'warning'}
            className="!normal-case"
            onClick={onMenuClick(hidden ? 'activate' : 'deactivate')}
            startIcon={hidden ? <PersonAdd /> : <PersonRemove />}
          >
            {hidden ? 'Activate' : 'Deactivate'}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
