import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import { FirebaseContext } from "../contexts";

import OptionCard from "./OptionCard";

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
        { "bg-gray-100 cursor-default": disabled }
      )}
    >
      <OptionCard displayName={displayName} photoURL={photoURL} voted={voted} />
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
