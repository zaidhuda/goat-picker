import React from 'react';
import { Link } from 'react-router-dom';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';

export default function WeekNavigation({ prevWeekPath, nextWeekPath }) {
  return (
    <div className="flex gap-8">
      {prevWeekPath ? (
        <Link to={prevWeekPath()} className="flex items-center">
          <NavigateBefore fontSize="large" />
          <span>Previous Week</span>
        </Link>
      ) : null}
      {nextWeekPath ? (
        <Link to={nextWeekPath()} className="flex items-center">
          <span>Next Week</span>
          <NavigateNext fontSize="large" />
        </Link>
      ) : null}
    </div>
  );
}
