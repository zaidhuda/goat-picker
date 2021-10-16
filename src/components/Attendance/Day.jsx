import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function AttendanceDay({ label, children, className }) {
  return (
    <div
      className={classnames(
        'border-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-h-[86px] p-2 sm:p-4 rounded w-full',
        className
      )}
    >
      <div className="flex sm:flex-col items-baseline sm:items-start justify-between min-w-[120px]">
        {label}
      </div>
      <div className="flex flex-1 gap-2">{children}</div>
    </div>
  );
}

AttendanceDay.propTypes = {
  label: PropTypes.node.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

AttendanceDay.defaultProps = {
  className: '',
};
