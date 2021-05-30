import React, { useContext } from "react";

import { FirebaseContext } from "../contexts";

import OptionCard from "../components/OptionCard";
import withUser from "../components/withUser";

const UpcomingPage = () => {
  const { options, currentWeekVotes } = useContext(FirebaseContext);

  const votes = currentWeekVotes
    .flatMap(({ votes }) => votes)
    .reduce((res, vote) => ({ [vote]: (res[vote] || 0) + 1 }), {});

  return (
    <div className="space-y-12">
      <h1 className="font-light text-4xl">
        Upcoming <span className="font-bold">GOAT</span>s
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {options
          .map((option) => ({
            ...option,
            votes: votes[option.id],
          }))
          .filter(({ votes }) => votes)
          .sort((a, b) => b.votes - a.votes)
          .map(({ id, displayName, photoURL }) => (
            <OptionCard
              key={id}
              displayName={displayName}
              photoURL={photoURL}
            />
          ))}
      </div>
    </div>
  );
};

export default withUser(UpcomingPage);
