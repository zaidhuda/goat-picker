import React, { useContext } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { FirebaseContext } from "../contexts";

const VoteButton = ({ id, displayName, photoURL, voteId }) => {
  const { addVote, removeVote } = useContext(FirebaseContext);
  const voted = !!voteId;

  return (
    <button
      type="button"
      className={classnames(
        "border-2 sm:flex-col inline-flex items-center focus:outline-none p-2 rounded space-x-2 sm:space-x-0",
        { "border-green-400": voted }
      )}
      onClick={() => (voted ? removeVote(voteId) : addVote(id))}
    >
      <img
        src={photoURL}
        alt={displayName}
        className="h-12 rounded-full w-12"
      />
      <figcaption className="font-semibold">{displayName}</figcaption>
    </button>
  );
};

VoteButton.propTypes = {
  id: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  photoURL: PropTypes.string.isRequired,
  voteId: PropTypes.string,
};

VoteButton.defaultProps = {
  voteId: null,
};

export default VoteButton;
