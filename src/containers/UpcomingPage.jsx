import React, { useContext } from "react";

import { FirebaseContext } from "../contexts";
import useOptions from "../hooks/useOptions";

import OptionCard from "../components/OptionCard";
import withUser from "../components/withUser";

const UpcomingPage = () => {
  const { options, currentWeekVotes } = useContext(FirebaseContext);
  const { votedOptions } = useOptions(options, currentWeekVotes);

  return (
    <div className="space-y-12">
      <h1 className="font-light text-4xl">
        Upcoming <span className="font-bold">GOAT</span>s
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {votedOptions.map(({ id, displayName, photoURL, votes }) => (
          <OptionCard
            key={id}
            displayName={displayName}
            photoURL={photoURL}
            votes={votes}
          />
        ))}
      </div>
    </div>
  );
};

export default withUser(UpcomingPage);
