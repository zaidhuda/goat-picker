import React from 'react';
import classnames from 'classnames';
import { Flipped } from 'react-flip-toolkit';
import { Badge as MuiBadge, BadgeProps } from '@mui/material';

import { Profile } from 'types/profile';
import { Avatar } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

interface Props extends Profile {
  voted?: boolean;
  votes?: number;
  variant: 'voting' | 'ranking';
}

export default function OptionCard({
  id,
  displayName,
  photoURL,
  voted,
  votes,
  variant,
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

  const Badge = (props: BadgeProps) =>
    variant === 'voting' ? (
      <MuiBadge
        classes={{
          root: 'w-full',
          badge: '!p-0',
        }}
        key={id}
        badgeContent={
          voted ? (
            <CheckCircle
              color="success"
              className="!bg-white !border-0 !rounded-full"
            />
          ) : null
        }
        {...props}
      />
    ) : (
      <MuiBadge
        classes={{ root: 'w-full' }}
        key={id}
        badgeContent={votes}
        color={color()}
        {...props}
      />
    );

  return (
    <Flipped flipId={id} stagger>
      <Badge>
        <div
          className={classnames(
            'flex sm:flex-col items-center h-full w-full',
            'gap-4 sm:gap-2 px-4 py-2',
            'bg-white border-2 rounded',
            'hover:shadow transition',
            { 'border-emerald-400': voted }
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
          <figcaption className="font-semibold line-clamp-1 text-lg text-center">
            {displayName}
          </figcaption>
        </div>
      </Badge>
    </Flipped>
  );
}
