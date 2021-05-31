import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

const OptionCard = ({ displayName, photoURL, voted, votes }) => {
  return (
    <div
      className={classnames(
        "border-2 h-full inline-flex items-center px-4 py-2 rounded sm:flex-col space-x-4 space-y-0 sm:space-x-0 sm:space-y-2 w-full",
        { "border-green-400": voted }
      )}
    >
      <img
        src={photoURL}
        alt={displayName}
        className="h-12 rounded-full w-12"
      />
      <figcaption className="font-semibold text-lg">{displayName}</figcaption>
      <span>{votes}</span>
    </div>
  );
};

OptionCard.propTypes = {
  displayName: PropTypes.string.isRequired,
  photoURL: PropTypes.string.isRequired,
  voted: PropTypes.bool,
};

OptionCard.defaultProps = {
  voted: false,
};

export default OptionCard;
