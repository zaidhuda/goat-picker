import React, { useContext } from "react";

import { FirebaseContext } from "../contexts";

import withUser from "../components/withUser";
import Navbar from "../components/Navbar";

const VotePage = () => {
  const { options, currentWeekVotes } = useContext(FirebaseContext);

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ul className="space-y-1">
          {options
            .map((option) => ({
              ...option,
              votes: currentWeekVotes.filter(
                ({ option: votedOption }) => votedOption === option.id
              ).length,
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
