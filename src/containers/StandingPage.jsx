import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import { FirebaseContext } from "../contexts";

import withUser from "../components/withUser";

const VotePage = () => {
  const { year, week } = useParams();
  console.log({ year, week });
  const { options, currentWeekVotes } = useContext(FirebaseContext);
  const votes = currentWeekVotes
    .flatMap(({ votes }) => votes)
    .reduce((res, vote) => ({ [vote]: (res[vote] || 0) + 1 }), {});

  return (
    <div>
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

export default withUser(VotePage);
