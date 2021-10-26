import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import AttendanceDay from './Day';

export default function AttendanceTable() {
  const {
    query: { week: weekParam, year: yearParam },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

  const dates = useMemo(() => {
    const getDate = (weekday: number) =>
      DateTime.fromObject({
        weekYear: year,
        weekNumber: week,
        weekday,
      });

    return [getDate(1), getDate(2), getDate(3), getDate(4), getDate(5)];
  }, [week, year]);

  return (
    <div className="flex flex-col gap-4">
      {dates.map((date) => (
        <AttendanceDay key={date.toISODate()} date={date} />
      ))}
    </div>
  );
}
