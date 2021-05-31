import React from "react";
import PropTypes from "prop-types";
import FlipMove from "react-flip-move";

import OptionCard from "./OptionCard";

const Ranking = ({ options }) => {
  return (
    <FlipMove className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {options.map(({ id, displayName, photoURL, votes }) => (
        <OptionCard key={id} displayName={displayName} photoURL={photoURL} />
      ))}
    </FlipMove>
  );
};

Ranking.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Ranking;
