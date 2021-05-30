import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { FirebaseContext } from "../contexts";

const VoteButton = ({ id, displayName, photoURL, voted }) => {
  const { addVote, removeVote } = useContext(FirebaseContext);
  const [disabled, setDisabled] = useState(false);

  const handleOnClick = () => {
    setDisabled(true);
    setTimeout(() => setDisabled(false), 500);
    voted ? removeVote(id) : addVote(id); 
  };

  return (
    <button
      type="button"
      onClick={handleOnClick}
      disabled={disabled}
      className={classnames(
        "border-2 sm:flex-col inline-flex items-center focus:outline-none p-2 rounded space-x-2 sm:space-x-0",
        { "border-green-400": voted },
        { "bg-gray-100 cursor-default": disabled }
      )}
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
  voted: PropTypes.bool,
};

VoteButton.defaultProps = {
  voted: false,
};

export default VoteButton;
