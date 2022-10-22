import React, { useState } from 'react';
import { ButtonBase } from '@mui/material';
import useVotes from 'hooks/useVotes';
import { Profile } from 'types/profile';
import OptionCard from './OptionCard';

interface Props extends Omit<Profile, 'docUrl'> {
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
