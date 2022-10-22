import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { AdminPanelSettings, Logout } from '@mui/icons-material';
import { Avatar, Button, ButtonBase } from '@mui/material';
import { useRouter } from 'next/router';
import useFirebase from 'hooks/useFirebase';

export default function NavbarUserMenu() {
  const { user, signOut } = useFirebase();
  const { push } = useRouter();

  return user ? (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        as={ButtonBase}
        color="inherit"
        className="!rounded-full !outline !outline-offset-2 focus:!outline-2"
      >
        <Avatar
          src={user.photoURL as string}
          title={user.displayName as string}
          sx={{ width: 36, height: 36 }}
        />
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
          {user.isAdmin ? (
            <Menu.Item
              as={Button}
              fullWidth
              onClick={() => push('/admin')}
              color="info"
              className="!normal-case"
              startIcon={<AdminPanelSettings />}
            >
              Admin
            </Menu.Item>
          ) : null}
          <Menu.Item
            as={Button}
            onClick={signOut}
            fullWidth
            color="warning"
            className="!normal-case"
            startIcon={<Logout />}
          >
            Logout
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  ) : null;
}
