import React from 'react';
import classnames from 'classnames';
import { Flipped } from 'react-flip-toolkit';
import { Badge } from '@mui/material';

import { Profile } from 'types/profile';
import { Avatar } from '@mui/material';

interface Props extends Profile {
  voted?: boolean;
  votes?: number;
}

export default function OptionCard({
  id,
  displayName,
  photoURL,
  voted,
  votes,
}: Props) {
  const color = () => {
    switch (votes) {
      case null:
      case undefined:
      case 0:
        return 'default';
      case 1:
        return 'info';
      case 2:
        return 'primary';
      case 3:
        return 'success';
      case 4:
        return 'secondary';
      case 5:
        return 'warning';
      default:
        return 'error';
    }
  };

  return (
    <Flipped flipId={id} stagger>
      <Badge
        classes={{ root: 'w-full' }}
        key={id}
        badgeContent={votes}
        color={color()}
      >
        <div
          className={classnames(
            'bg-white border-2 h-full flex items-center px-4 py-2 rounded sm:flex-col space-x-4 space-y-0 sm:space-x-0 sm:space-y-2 w-full',
            { 'border-green-400': voted }
          )}
        >
          <figure>
            <Avatar
              alt={displayName}
              title={displayName}
              src={photoURL}
              sx={{ width: 48, height: 48 }}
            />
          </figure>
          <figcaption className="font-semibold text-lg line-clamp-1">
            {displayName}
          </figcaption>
        </div>
      </Badge>
    </Flipped>
  );
}
