import React, { Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Avatar, Button, ButtonBase, IconButton } from '@mui/material';
import { Disclosure, Menu, Transition } from '@headlessui/react';

import useFirebase from 'hooks/useFirebase';
import useWeek from 'hooks/useWeek';

export default function Navbar() {
  const { user, signOut } = useFirebase();
  const { pathname } = useRouter();
  const { currentWeek, currentYear } = useWeek();
  const lastYear = currentYear - 1;

  const navigation = [
    {
      name: 'Vote',
      href: '/vote',
      current: pathname.startsWith('/vote'),
    },
    {
      name: `${lastYear}`,
      href: `/stats?year=${lastYear}`,
      current: pathname.startsWith('/stats'),
      hidden: currentWeek > 1,
    },
    {
      name: 'Attendance',
      href: '/attendances',
      current: pathname.startsWith('/attendances'),
    },
  ];

  const renderNavLinks = () => (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 h-full">
      {navigation
        .filter(({ hidden }) => !hidden)
        .map((item) => (
          <Link key={item.name} href={item.href} passHref>
            <Button
              color="inherit"
              className={classNames(
                'hover:!bg-gray-900 w-full sm:w-auto',
                item.current ? 'text-white' : 'text-gray-300',
                {
                  '!bg-gray-900': item.current,
                }
              )}
            >
              <span className="font-semibold normal-case">{item.name}</span>
            </Button>
          </Link>
        ))}
    </div>
  );

  return (
    <Disclosure as="nav" className="bg-gray-800 text-white">
      {({ open }) => (
        <>
          <div className="container max-w-screen-md mx-auto">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button
                  as={IconButton}
                  color="inherit"
                  className="!outline !outline-offset-0 focus:!outline-2"
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <CloseIcon aria-hidden="true" />
                  ) : (
                    <MenuIcon aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/goat" passHref>
                    <Button
                      size="large"
                      color="inherit"
                      className="hover:!bg-gray-900"
                    >
                      <span className="font-bold text-lg">GOAT</span>
                    </Button>
                  </Link>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  {renderNavLinks()}
                </div>
              </div>
              {user ? (
                <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
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
                      <Menu.Items className="absolute right-0 w-36 mt-2 origin-top-right bg-white rounded-md outline-none shadow-lg z-10">
                        <Menu.Item
                          as={Button}
                          onClick={signOut}
                          fullWidth
                          color="warning"
                          className="!normal-case"
                        >
                          Logout
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              ) : null}
            </div>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Disclosure.Panel className="sm:hidden p-2">
              {renderNavLinks()}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
