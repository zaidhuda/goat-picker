import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import useFirebase from '../hooks/useFirebase';

import OptionCard from './OptionCard';

const VoteButton = ({ id, displayName, photoURL, voted }) => {
  const { addVote, removeVote } = useFirebase();
  const [disabled, setDisabled] = useState(false);

  const handleOnClick = () => {
    setDisabled(true);
    if (voted) {
      removeVote(id, setDisabled);
    } else {
      addVote(id, setDisabled);
    }
  };

  return (
    <button
      type="button"
      onClick={handleOnClick}
      disabled={disabled}
      className={classnames({ 'bg-gray-100 cursor-default': disabled })}
    >
      <OptionCard
        id={id}
        displayName={displayName}
        photoURL={photoURL}
        voted={voted}
      />
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
