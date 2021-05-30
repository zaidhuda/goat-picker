import React, { useContext } from "react";

import { FirebaseContext } from "../contexts";

import withUser from "../components/withUser";

const StandingPage = () => {
  const { options, currentWeekVotes } = useContext(FirebaseContext);
  const votes = currentWeekVotes
    .flatMap(({ votes }) => votes)
    .reduce((res, vote) => ({ [vote]: (res[vote] || 0) + 1 }), {});

  return (
    <div className="space-y-8">
      <h1 className="font-bold text-4xl">
        GOAT <span className="font-light">wannabes</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ul className="space-y-1">
          {options
            .map((option) => ({
              ...option,
              votes: votes[option.id] || 0,
            }))
            .sort((a, b) => b.votes - a.votes)
            .map(({ id, displayName, photoURL }) => (
              <li key={id}>
                <img
                  src={photoURL}
                  alt={displayName}
                  className="inline mr-2 rounded-full w-10"
                />
                <span>{displayName}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default withUser(StandingPage);
