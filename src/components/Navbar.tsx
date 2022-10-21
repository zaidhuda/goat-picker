import React, { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { Avatar, Button, ButtonBase, IconButton } from '@mui/material';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useDarkMode from 'hooks/useDarkMode';
import useFirebase from 'hooks/useFirebase';
import useWeek from 'hooks/useWeek';

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, signOut } = useFirebase();
  const { pathname } = useRouter();
  const { currentWeek, currentYear } = useWeek();
  const lastYear = currentYear - 1;

  const navigation = [
    {
      name: 'Vote',
      url: {
        pathname: '/vote',
      },
    },
    {
      name: `${lastYear}`,
      url: {
        pathname: '/stats',
        query: {
          year: lastYear,
        },
      },
      hidden: currentWeek > 1,
    },
    {
      name: 'LnL',
      url: {
        pathname: '/lnl',
      },
    },
  ];

  const renderNavLinks = (close: () => void) => (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 h-full">
      {navigation
        .filter(({ hidden }) => !hidden)
        .map((item) => (
          <Link key={item.name} href={item.url} passHref>
            <Button
              onClick={close}
              color="inherit"
              className={classNames(
                'hover:!bg-gray-900 w-full sm:w-auto',
                pathname.startsWith(item.url.pathname)
                  ? 'text-white'
                  : 'text-gray-300',
                {
                  '!bg-gray-900': pathname.startsWith(item.url.pathname),
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
    <Disclosure as="nav" className="bg-gray-800 text-white sticky top-0 z-10">
      {({ open, close }) => (
        <>
          <div className="container max-w-screen-md mx-auto">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button
                  as={IconButton}
                  color="inherit"
                  className="!outline !outline-offset-0 focus:!outline-2 dark:!outline-gray-600"
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
                  {renderNavLinks(close)}
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center gap-x-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <IconButton
                  title="Vote"
                  className="!text-yellow-400"
                  onClick={() => toggleDarkMode()}
                >
                  {darkMode ? (
                    <DarkMode className="!text-2xl" />
                  ) : (
                    <LightMode className="!text-2xl" />
                  )}
                </IconButton>

                {user ? (
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
                ) : null}
              </div>
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
              {renderNavLinks(close)}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
