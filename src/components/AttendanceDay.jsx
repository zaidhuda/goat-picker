import React from 'react';
import PropTypes from 'prop-types';

export default function AttendanceDay({ label, children }) {
  return (
    <div className="border-2 flex flex-col sm:flex-row sm:items-center gap-4 min-h-[86px] p-4 rounded w-full">
      <div className="min-w-[120px] text-left">{label}</div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

AttendanceDay.propTypes = {
  label: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};
