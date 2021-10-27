import React from 'react';
import { getLayout } from 'components/Layout';
import AttendanceTable from 'components/Attendance/Table';
import WeekNavigation from 'components/WeekNavigation';
import useWeek from 'hooks/useWeek';
import { useRouter } from 'next/router';

export default function AttendancePage() {
  const { getPrevWeek, getNextWeek } = useWeek();
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
    <div className="space-y-8  max-w-2xl mx-auto">
      <WeekNavigation prevWeekPath={prevWeekPath} nextWeekPath={nextWeekPath}>
        <h1 className="font-medium text-2xl sm:text-5xl">Week {week}</h1>
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
