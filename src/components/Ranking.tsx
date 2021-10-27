import React from 'react';
import { useRouter } from 'next/dist/client/router';
import { Flipper } from 'react-flip-toolkit';

import OptionCard from './OptionCard';
import { Profile } from 'types/profile';

interface Props {
  options: (Profile & { votes?: number })[];
}

export default function Ranking({ options }: Props) {
  const { pathname } = useRouter();

  return (
    <Flipper flipKey={`${pathname}-${options.map(({ id }) => id).join()}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {options.map(({ id, displayName, photoURL, votes = 0 }) => (
          <OptionCard
            key={id}
            id={id}
            displayName={displayName}
            photoURL={photoURL}
            votes={votes}
          />
        ))}
      </div>
    </Flipper>
  );
}
