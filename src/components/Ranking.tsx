import React, { useMemo } from 'react';
import { useRouter } from 'next/dist/client/router';
import { Flipper } from 'react-flip-toolkit';
import { ProfileWithStats } from 'types/profile';
import OptionCard from './OptionCard';

interface Props {
  profiles?: Omit<ProfileWithStats, 'totalVotes'>[];
}

export default function Ranking({ profiles }: Props) {
  const { pathname } = useRouter();

  const rankedProfiles = useMemo(
    () =>
      profiles
        ?.sort((a, b) => a.displayName.localeCompare(b.displayName))
        .sort((a, b) => b.totalVoted - a.totalVoted)
        .filter((profile) => profile.totalVoted > 0) || [],
    [profiles]
  );

  return (
    <Flipper
      flipKey={`${pathname}-${rankedProfiles.map(({ id }) => id).join()}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {rankedProfiles.map(({ id, displayName, photoURL, totalVoted = 0 }) => (
          <OptionCard
            variant="ranking"
            key={id}
            id={id}
            displayName={displayName}
            photoURL={photoURL}
            votes={totalVoted}
          />
        ))}
      </div>
    </Flipper>
  );
}
