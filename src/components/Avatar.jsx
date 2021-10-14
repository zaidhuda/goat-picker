import React from 'react';
import PropTypes from 'prop-types';

export default function Avatar({ photoURL, displayName }) {
  return (
    <img
      src={photoURL}
      alt={displayName}
      title={displayName}
      className="h-12 rounded-full w-12"
    />
  );
}

Avatar.propTypes = {
  photoURL: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
};
