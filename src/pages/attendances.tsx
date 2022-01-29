import React from 'react';
import { getLayout } from 'components/Layout';
import WeekNavigation from 'components/WeekNavigation';
import AttendanceTable from 'components/Attendance/Table';

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-8 pb-12 sm:pb-0">
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
