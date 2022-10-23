import React from 'react';
import { Button } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { getLayout } from 'components/Layout';
import useFirebase from 'hooks/useFirebase';

type Props = {
  as?: 'page' | 'component';
};

export default function SettingsPage({ as = 'page' }: Props) {
  const { user, configs, db } = useFirebase();

  const handleEditClick = (key: string, value: unknown) => () => {
    const promptValue = prompt(`${key}:`, value as string);
    let newValue;

    switch (key) {
      case 'MAX_ATTENDEES':
      case 'MAX_VOTES_PER_USER':
        const parsedValue = Number(promptValue);
        newValue = isNaN(parsedValue) ? value : parsedValue;
        break;
      case 'EMAIL_DOMAIN':
        newValue = promptValue?.trim();
        break;
    }

    if (
      db &&
      newValue !== value &&
      confirm(`Are you sure you want to change ${key} to ${newValue}?`)
    ) {
      setDoc(doc(db, 'configs', 'web'), { [key]: newValue }, { merge: true });
    }
  };

  const settingsTable = (
    <table className="table-auto w-full cursor-default">
      <thead>
        <tr>
          <th className="py-3">#</th>
          <th className="text-left">Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(configs || {})
          .sort()
          .map(([key, value], index) => (
            <tr
              key={key}
              className="bg-black dark:bg-white odd:!bg-opacity-5 even:!bg-opacity-0 h-14"
            >
              <td className="px-2" width={1}>
                {index + 1}
              </td>
              <td className="text-left">{key}</td>
              <td className="px-2 text-center">
                <Button
                  fullWidth
                  variant="outlined"
                  color="warning"
                  className="normal-case"
                  onClick={handleEditClick(key, value)}
                  disabled={!user?.isAdmin}
                >
                  {value}
                </Button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );

  if (as === 'component') return settingsTable;

  return (
    <div className="space-y-12">
      <h1 className="font-light text-4xl">Settings</h1>

      {settingsTable}
    </div>
  );
}

SettingsPage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Profiles' },
};
