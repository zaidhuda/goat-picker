import React from "react";
import PropTypes from "prop-types";

const Selection = ({ displayName, photoURL }) => {
  return (
    <button
      type="button"
      className="border-2 sm:flex-col inline-flex items-center p-2 rounded space-x-2 sm:space-x-0"
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

Selection.propTypes = {
  displayName: PropTypes.string.isRequired,
  photoURL: PropTypes.string.isRequired,
};

export default Selection;
