import React from 'react';
import PropTypes from 'prop-types';

export default function Avatar({ photoURL, displayName, size }) {
  return (
    <img
      rel="noreferrer"
      src={photoURL}
      alt={displayName}
      title={displayName}
      className={`rounded-full h-${size} w-${size}`}
    />
  );
}

Avatar.propTypes = {
  photoURL: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Avatar.defaultProps = {
  size: 12,
};
