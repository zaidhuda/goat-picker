import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getLayout } from 'components/Layout';
import WeekNavigation from 'components/WeekNavigation';
import AttendanceTable from 'components/Attendance/Table';
import useWeek from 'hooks/useWeek';

export default function AttendancePage() {
  const { currentWeek } = useWeek();
  const {
    query: { week: weekParam = currentWeek },
  } = useRouter();

  const week = Number(weekParam);

  return (
    <div className="space-y-8">
      <WeekNavigation>
        <Link href="/attendances">
          <a title="Go to current week">
            <h1 className="font-medium text-2xl sm:text-5xl">Week {week}</h1>
          </a>
        </Link>
      </WeekNavigation>
      <AttendanceTable />
    </div>
  );
}

AttendancePage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Attendances' },
};
