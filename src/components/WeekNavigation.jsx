import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';

export default function WeekNavigation({ prevWeekPath, nextWeekPath }) {
  return (
    <div className="flex gap-8">
      {prevWeekPath ? (
        <Link href={prevWeekPath()}>
          <a className="flex items-center">
            <NavigateBefore fontSize="large" />
            <span>Previous Week</span>
          </a>
        </Link>
      ) : null}
      {nextWeekPath ? (
        <Link href={nextWeekPath()}>
          <a className="flex items-center">
            <span>Next Week</span>
            <NavigateNext fontSize="large" />
          </a>
        </Link>
      ) : null}
    </div>
  );
}

WeekNavigation.propTypes = {
  prevWeekPath: PropTypes.func,
  nextWeekPath: PropTypes.func,
};
