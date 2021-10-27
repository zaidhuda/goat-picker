import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getLayout } from 'components/Layout';
import AttendanceTable from 'components/Attendance/Table';
import WeekNavigation from 'components/WeekNavigation';
import useWeek from 'hooks/useWeek';

export default function AttendancePage() {
  const { currentWeek, currentYear, getPrevWeek, getNextWeek } = useWeek();
  const {
    query: { week: weekParam, year: yearParam },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

  const prevWeekPath = () => {
    const { week: prevWeek, year: prevYear } = getPrevWeek(year, week);
    return `/attendances?year=${prevYear}&week=${prevWeek}`;
  };

  const nextWeekPath = () => {
    const { week: nextWeek, year: nextYear } = getNextWeek(year, week);
    return `/attendances?year=${nextYear}&week=${nextWeek}`;
  };

  return (
    <div className="space-y-8">
      <WeekNavigation prevWeekPath={prevWeekPath} nextWeekPath={nextWeekPath}>
        <Link href={`/attendances?year=${currentYear}&week=${currentWeek}`}>
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
