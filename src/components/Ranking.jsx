import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/dist/client/router';
import { Flipper } from 'react-flip-toolkit';

import OptionCard from './OptionCard';

const Ranking = ({ options }) => {
  const { pathname } = useRouter();

  return (
    <Flipper flipKey={`${pathname}-${options.map(({ id }) => id).join()}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {options.map(({ id, displayName, photoURL }) => (
          <OptionCard
            key={id}
            id={id}
            displayName={displayName}
            photoURL={photoURL}
          />
        ))}
      </div>
    </Flipper>
  );
};

Ranking.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Ranking;
