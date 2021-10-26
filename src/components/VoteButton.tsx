import React, { useState } from 'react';
import classnames from 'classnames';

import OptionCard from './OptionCard';
import { Profile } from 'types/profile';
import useVotes from 'hooks/useVotes';

interface Props extends Profile {
  voted?: boolean;
}

export default function VoteButton({
  id,
  displayName,
  photoURL,
  voted,
}: Props) {
  const { addVote, removeVote } = useVotes();
  const [disabled, setDisabled] = useState(false);

  const handleOnClick = () => {
    setDisabled(true);
    if (voted) {
      removeVote(id, () => setDisabled(false));
    } else {
      addVote(id, () => setDisabled(false));
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
}
