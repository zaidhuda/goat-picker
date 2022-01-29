import React from 'react';
import classNames from 'classnames';
import { Flipped } from 'react-flip-toolkit';
import { CheckCircle } from '@mui/icons-material';
import { Badge as MuiBadge, BadgeProps, Avatar } from '@mui/material';

import { Profile } from 'types/profile';
import useFirebase from 'hooks/useFirebase';

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
  const { user } = useFirebase();
  const isCurrentUser = id === user?.uid;

  const color = () => {
    switch (votes) {
      case null:
      case undefined:
      case 0:
        return 'bg-transparent';
      case 1:
        return 'bg-blue-300 border-blue-300';
      case 2:
        return 'bg-blue-500 border-blue-500';
      case 3:
        return 'bg-emerald-500 border-emerald-500';
      case 4:
        return 'bg-purple-500 border-purple-500';
      case 5:
        return 'bg-orange-500 border-orange-500';
      default:
        return 'bg-red-600 border-red-600';
    }
  };

  const Badge = (props: BadgeProps) =>
    variant === 'voting' ? (
      <MuiBadge
        classes={{
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
        key={id}
        badgeContent={votes}
        classes={{ badge: classNames('text-white', color()) }}
        {...props}
      />
    );

  return (
    <Flipped flipId={id} stagger>
      <Badge className="bg-white h-full w-full">
        <div
          className={classNames(
            'flex sm:flex-col items-center h-full w-full',
            'gap-4 sm:gap-2 px-4 py-2',
            'border-2 rounded',
            isCurrentUser ? `${color()} bg-opacity-5` : '',
            {
              'hover:shadow-lg transition': variant === 'voting',
              'border-green-600': voted,
            }
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
