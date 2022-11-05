import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  AdminPanelSettings,
  DataObject,
  MoreVert,
  PersonAdd,
  PersonRemove,
} from '@mui/icons-material';
import { Avatar, Button, IconButton } from '@mui/material';
import classNames from 'classnames';
import LastSeen from 'components/LastSeen';
import { getLayout } from 'components/Layout';
import useFirebase from 'hooks/useFirebase';
import useProfileManager from 'hooks/useProfileManager';
import { Profile } from 'types/profile';

const SlackIcon = (props: { title?: string }) => (
  <img
    {...props}
    alt="Slack"
    src={'/images/slack.ico'}
    width={16}
    height={16}
    className="object-contain"
  />
);

type MenuAction =
  | 'slackId'
  | 'activate'
  | 'deactivate'
  | 'setAdmin'
  | 'removeAdmin';

const ProfileMenu = ({
  profile: { docUrl, hidden, isAdmin },
  onMenuClick,
}: {
  profile: Profile;
  onMenuClick: (action: MenuAction) => () => void;
}) => (
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

type Props = {
  as?: 'page' | 'component';
};

export default function ProfilesPage({ as = 'page' }: Props) {
  const { user, profiles } = useFirebase();
  const { updateUser } = useProfileManager();
  const [showAll, setShowAll] = useState(false);

  const handleMenuClick =
    ({ id, slackId, displayName }: Profile) =>
    (action: MenuAction) =>
    () => {
      if (!user?.isAdmin) return;

      switch (action) {
        case 'slackId': {
          const newSlackId = prompt(`Update ${displayName} Slack ID:`, slackId);
          if (newSlackId !== null && newSlackId !== slackId) {
            if (confirm(`Change ${displayName} Slack ID to ${newSlackId}?`)) {
              updateUser(id, { slackId: newSlackId });
            }
          }
          break;
        }
        case 'activate': {
          if (confirm(`Activate ${displayName}?`)) {
            updateUser(id, { hidden: false });
          }

          break;
        }
        case 'deactivate': {
          if (confirm(`Deactivate ${displayName}?`)) {
            updateUser(id, { hidden: true });
          }

          break;
        }
        case 'setAdmin': {
          if (confirm(`Make ${displayName} admin?`)) {
            updateUser(id, { isAdmin: true });
          }

          break;
        }
        case 'removeAdmin': {
          if (confirm(`Remove ${displayName} from admin?`)) {
            updateUser(id, { isAdmin: false });
          }

          break;
        }
      }
    };

  const profilesTable = (
    <>
      <table className="table-auto w-full cursor-default">
        <thead>
          <tr>
            <th className="py-3">#</th>
            <th className="text-left">Name</th>
            <th className="hidden md:table-cell">Last Seen</th>
            {user?.isAdmin ? <th /> : null}
          </tr>
        </thead>
        <tbody>
          {profiles
            ?.filter(({ hidden }) => showAll || !hidden)
            .map((profile, index) => (
              <tr
                key={profile.id}
                className="bg-black dark:bg-white odd:!bg-opacity-5 even:!bg-opacity-0 h-14"
              >
                <td className="px-2" width={1}>
                  {index + 1}
                </td>
                <td>
                  <div className="flex gap-2">
                    <Avatar
                      src={profile.photoURL}
                      sx={{ width: 28, height: 28 }}
                      imgProps={{
                        referrerPolicy: 'no-referrer',
                      }}
                    />
                    <p
                      className={classNames('line-clamp-1', {
                        'line-through': profile.hidden,
                      })}
                    >
                      {profile.displayName}
                    </p>
                    {profile.isAdmin ? (
                      <AdminPanelSettings titleAccess="Admin" />
                    ) : null}
                    {profile.slackId ? (
                      <SlackIcon title={`Slack ID: ${profile.slackId}`} />
                    ) : null}
                  </div>
                </td>
                <td className="text-center hidden md:table-cell">
                  <LastSeen lastSeen={profile.lastSeenAt} />
                </td>
                {user?.isAdmin ? (
                  <td className="px-2" width={1}>
                    <ProfileMenu
                      profile={profile}
                      onMenuClick={handleMenuClick(profile)}
                    />
                  </td>
                ) : null}
              </tr>
            ))}
        </tbody>
      </table>

      <Button
        fullWidth
        variant="outlined"
        onClick={() => setShowAll((state) => !state)}
        color="warning"
      >
        {showAll ? 'Hide Inactive' : 'Show All'}
      </Button>
    </>
  );

  if (as === 'component') return profilesTable;

  return (
    <div className="space-y-12">
      <h1 className="font-light text-4xl">Users</h1>

      {profilesTable}
    </div>
  );
}

ProfilesPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Profiles' },
};
