import React, { useContext } from "react";

import { FirebaseContext } from "../contexts";

import withUser from "../components/withUser";
import Navbar from "../components/Navbar";
import VoteButton from "../components/VoteButton";

const VotePage = () => {
  const {
    user: { uid: userId },
    options,
    currentWeekVotes,
  } = useContext(FirebaseContext);

  const votes = currentWeekVotes.find(({ id }) => id === userId)?.votes || [];

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {options
          .filter(({ id }) => id !== userId)
          .map((option) => ({
            ...option,
            voted: votes.some((votedId) => votedId === option.id),
          }))
          .map((option) => (
            <VoteButton key={option.id} {...option} />
          ))}
      </div>
    </div>
  );
};

export default withUser(VotePage);
