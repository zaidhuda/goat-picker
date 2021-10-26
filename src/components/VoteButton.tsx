import React, { useState } from 'react';

import OptionCard from './OptionCard';
import { Profile } from 'types/profile';
import useVotes from 'hooks/useVotes';
import { ButtonBase } from '@mui/material';

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
    if (!disabled) {
      setDisabled(true);
      if (voted) {
        removeVote(id, () => setDisabled(false));
      } else {
        addVote(id, () => setDisabled(false));
      }
    }
  };

  return (
    <ButtonBase onClick={handleOnClick}>
      <OptionCard
        id={id}
        displayName={displayName}
        photoURL={photoURL}
        voted={voted}
      />
    </ButtonBase>
  );
}
