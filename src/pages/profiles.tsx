import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { MoreVert } from '@mui/icons-material';
import { Avatar, Button, IconButton } from '@mui/material';
import classNames from 'classnames';
import LastSeen from 'components/LastSeen';
import { getLayout } from 'components/Layout';
import useFirebase from 'hooks/useFirebase';
import useProfiles from 'hooks/useProfiles';
import { Profile } from 'types/profile';

type MenuAction =
  | 'slackId'
  | 'activate'
  | 'deactivate'
  | 'setAdmin'
  | 'removeAdmin';

const ProfileMenu = ({
  profile: { hidden, isAdmin },
  onMenuClick,
}: {
  profile: Profile;
  onMenuClick: (action: MenuAction) => () => void;
}) => (
  <Menu as="div" className="relative inline-block text-left">
    <Menu.Button as={Fragment}>
      <IconButton>
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
      <Menu.Items className="absolute right-0 top-[-10px] w-36 mt-2 origin-top-right bg-white dark:bg-gray-700 rounded-md outline-none drop-shadow-lg z-10">
        {!hidden ? (
          <Menu.Item
            as={Button}
            fullWidth
            className="!normal-case"
            color="error"
            onClick={onMenuClick(isAdmin ? 'removeAdmin' : 'setAdmin')}
          >
            {isAdmin ? 'Remove admin' : 'Make admin'}
          </Menu.Item>
        ) : null}
        <Menu.Item
          as={Button}
          fullWidth
          className="!normal-case"
          onClick={onMenuClick('slackId')}
        >
          Slack ID
        </Menu.Item>
        <Menu.Item
          as={Button}
          fullWidth
          color={hidden ? 'success' : 'warning'}
          className="!normal-case"
          onClick={onMenuClick(hidden ? 'activate' : 'deactivate')}
        >
          {hidden ? 'Activate' : 'Deactivate'}
        </Menu.Item>
      </Menu.Items>
    </Transition>
  </Menu>
);

export default function ProfilesPage() {
  const { user } = useFirebase();
  const [showAll, setShowAll] = useState(false);

  const profiles = useProfiles();
  const currentUser = profiles.find((profile) => profile.id === user?.uid);

  const handleMenuClick =
    ({ slackId, displayName }: Profile) =>
    (action: MenuAction) =>
    () => {
      if (!currentUser?.isAdmin) return;

      switch (action) {
        case 'slackId':
          const newSlackId = prompt(`Update ${displayName} Slack ID:`, slackId);
          if (newSlackId !== null && newSlackId !== slackId) {
            confirm(`Change ${displayName} Slack ID to ${newSlackId}?`) &&
              alert(`New Slack ID: ${newSlackId}. Not implemented yet.`);
          }
          break;
        case 'activate':
          confirm(`Activate ${displayName}?`) &&
            alert(`Activating ${displayName}. Not implemented yet.`);
          break;
        case 'deactivate':
          confirm(`Deactivate ${displayName}?`) &&
            alert(`Deactivating ${displayName}. Not implemented yet.`);
          break;
        case 'setAdmin':
          confirm(`Make ${displayName} admin?`) &&
            alert(`Making ${displayName} admin. Not implemented yet.`);
          break;
        case 'removeAdmin':
          confirm(`Remove ${displayName} from admin?`) &&
            alert(`Removing ${displayName} from admin. Not implemented yet.`);
          break;
      }
    };

  return (
    <div className="space-y-12">
      <h1 className="font-light text-4xl">Users</h1>

      <table className="table-auto w-full cursor-default">
        <thead>
          <tr>
            <th className="py-3">#</th>
            <th className="text-left">Name</th>
            <th className="hidden md:table-cell">Last Seen</th>
            {currentUser?.isAdmin ? <th /> : null}
          </tr>
        </thead>
        <tbody>
          {profiles
            .filter(({ hidden }) => showAll || !hidden)
            .map((profile, index) => (
              <tr
                key={profile.id}
                className="bg-black dark:bg-white odd:!bg-opacity-5 even:!bg-opacity-0"
              >
                <td className="px-2" width={1}>
                  {index + 1}
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <Avatar
                      src={profile.photoURL}
                      sx={{ width: 24, height: 24 }}
                    />
                    <p
                      className={classNames('line-clamp-1', {
                        'line-through': profile.hidden,
                      })}
                    >
                      {profile.displayName}
                    </p>
                  </div>
                </td>
                <td className="text-center hidden md:table-cell">
                  <LastSeen lastSeen={profile.lastSeenAt} />
                </td>
                {currentUser?.isAdmin ? (
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
    </div>
  );
}

ProfilesPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Profiles' },
};
