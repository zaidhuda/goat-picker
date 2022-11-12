import React, { useState } from 'react';
import { AdminPanelSettings } from '@mui/icons-material';
import { Avatar, Button } from '@mui/material';
import classNames from 'classnames';
import { Timestamp } from 'firebase/firestore';
import LastSeen from 'components/LastSeen';
import { getLayout } from 'components/Layout';
import ProfileMenu, { ProfileMenuAction } from 'components/ProfileMenu';
import SlackIcon from 'components/SlackIcon';
import useFirebase from 'hooks/useFirebase';
import useProfileManager from 'hooks/useProfileManager';
import { Profile } from 'types/profile';

type Props = {
  as?: 'page' | 'component';
};

export default function ProfilesPage({ as = 'page' }: Props) {
  const { user, profiles } = useFirebase();
  const { updateUser } = useProfileManager();
  const [showAll, setShowAll] = useState(false);

  const handleMenuClick =
    ({ id, slackId, displayName }: Profile) =>
    (action: ProfileMenuAction) =>
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

  const renderRow = (profile: Profile, index: number) => {
    const latestLastSeen = (
      [profile?.lastSeenAt, profile?.lastSeenOnSlackAt].filter(
        Boolean
      ) as Timestamp[]
    ).sort((a, b) => b.toMillis() - a.toMillis())[0];

    const lastSeenOnSlack =
      !!latestLastSeen && profile.lastSeenOnSlackAt === latestLastSeen;

    return (
      <tr
        key={profile.id}
        className="bg-black dark:bg-white odd:!bg-opacity-5 even:!bg-opacity-0 h-14"
      >
        <td className="px-2" width={1}>
          {index + 1}
        </td>
        <td>
          <div className="flex gap-2 items-center">
            <Avatar
              src={profile.photoURL}
              sx={{ width: 28, height: 28 }}
              imgProps={{
                referrerPolicy: 'no-referrer',
              }}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
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
              <p className="md:hidden font-thin text-xs !text-opacity-30 text-black dark:text-white">
                <LastSeen lastSeen={latestLastSeen} />
              </p>
            </div>
          </div>
        </td>
        <td className="hidden md:table-cell text-center">
          <div className="inline-flex gap-2 w-fit">
            <LastSeen lastSeen={latestLastSeen} />
            {lastSeenOnSlack ? <SlackIcon title="Last seen on Slack" /> : null}
          </div>
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
    );
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
          {profiles?.filter(({ hidden }) => showAll || !hidden).map(renderRow)}
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
