import React, { useContext } from "react";

import { FirebaseContext } from "../contexts";

import withUser from "../components/withUser";
import Navbar from "../components/Navbar";
import Selection from "../components/VoteButton";

const VotePage = () => {
  const {
    user: { uid: userId },
    options,
    currentUserVotes,
  } = useContext(FirebaseContext);

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {options
          .filter(({ id }) => id !== userId)
          .map((option) => ({
            ...option,
            voteId: currentUserVotes.find(
              ({ option: votedOption }) => votedOption === option.id
            )?.id,
          }))
          .map((option) => (
            <Selection key={option.id} {...option} />
          ))}
      </div>
    </div>
  );
};

export default withUser(VotePage);
