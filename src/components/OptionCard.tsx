import React from 'react';
import classnames from 'classnames';
import { Flipped } from 'react-flip-toolkit';

import Avatar from './Avatar';
import { Profile } from 'types/profile';

interface Props extends Profile {
  voted?: boolean;
}

export default function OptionCard({
  id,
  displayName,
  photoURL,
  voted,
}: Props) {
  return (
    <Flipped flipId={id} stagger>
      <div
        className={classnames(
          'bg-white border-2 h-full flex items-center px-4 py-2 rounded sm:flex-col space-x-4 space-y-0 sm:space-x-0 sm:space-y-2 w-full',
          { 'border-green-400': voted }
        )}
      >
        <Avatar displayName={displayName} photoURL={photoURL} />
        <figcaption className="font-semibold text-lg">{displayName}</figcaption>
      </div>
    </Flipped>
  );
}
