import React, { useState } from 'react';

import OptionCard from './OptionCard';
import { Profile } from 'types/profile';
import useVotes from 'hooks/useVotes';
import { ButtonBase } from '@mui/material';

interface Props extends Profile {
  voted?: boolean;
  disabled?: boolean;
}

export default function VoteButton({
  id,
  displayName,
  photoURL,
  voted,
  disabled,
}: Props) {
  const { addVote, removeVote } = useVotes();
  const [submitting, setSubmitting] = useState(false);

  const handleOnClick = () => {
    if (!submitting) {
      setSubmitting(true);
      if (voted) {
        removeVote(id, () => setSubmitting(false));
      } else {
        addVote(id, () => setSubmitting(false));
      }
    }
  };

  return (
    <ButtonBase
      onClick={handleOnClick}
      disabled={disabled && !voted}
      focusRipple
    >
      <OptionCard
        variant="voting"
        id={id}
        displayName={displayName}
        photoURL={photoURL}
        voted={voted}
      />
    </ButtonBase>
  );
}
