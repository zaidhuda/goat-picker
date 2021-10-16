import React from 'react';

import WeekNavigation from '../components/Attendance/WeekNavigation';
import AttendanceTable from '../components/Attendance/Table';
import { getLayout } from '../components/Layout';

export default function AttendancePage() {
  return (
    <div className="space-y-8  max-w-2xl mx-auto">
      <WeekNavigation />
      <AttendanceTable />
    </div>
  );
}

AttendancePage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Attendances' },
};
