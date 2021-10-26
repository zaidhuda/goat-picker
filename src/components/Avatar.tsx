import React from 'react';
import { Profile } from 'types/profile';

interface Props extends Partial<Profile> {
  size?: number;
}

export default function Avatar({ photoURL, displayName, size = 48 }: Props) {
  return (
    <img
      height={size}
      width={size}
      src={photoURL}
      alt={displayName}
      title={displayName}
      className="rounded-full"
    />
  );
}
