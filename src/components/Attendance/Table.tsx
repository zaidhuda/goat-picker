import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import AttendanceDay from './Day';
import { Button } from '@mui/material';

export default function AttendanceTable() {
  const [weekendsVisible, showWeekends] = useState(false);
  const {
    query: { week: weekParam, year: yearParam },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

  const getDate = (weekday: number) =>
    DateTime.fromObject({
      weekYear: year,
      weekNumber: week,
      weekday,
    });

  const weekday = useMemo(
    () => Array.from({ length: 5 }, (_, i) => getDate(i + 1)),
    [week, year]
  );

  const weekends = useMemo(
    () =>
      weekendsVisible
        ? Array.from({ length: 2 }, (_, i) => getDate(i + 6))
        : [],
    [week, year, weekendsVisible]
  );

  return (
    <div className="flex flex-col gap-4">
      {weekday.map((date) => (
        <AttendanceDay key={date.toISODate()} date={date} />
      ))}

      <Button
        size="small"
        color={weekendsVisible ? 'primary' : 'warning'}
        onClick={() => showWeekends(!weekendsVisible)}
      >
        {weekendsVisible ? 'Hide weekends' : 'Show me weekends'}
      </Button>

      {weekends.map((date) => (
        <AttendanceDay key={date.toISODate()} date={date} />
      ))}
    </div>
  );
}
