import React from 'react';
import { DateTime } from 'luxon';

interface Props {
  week: number;
  year: number;
}

export default function WeekRangeLabel({ week, year }: Props) {
  const fromDate = DateTime.fromObject({
    weekYear: year,
    weekNumber: week,
    weekday: 1,
  });

  const toDate = DateTime.fromObject({
    weekYear: year,
    weekNumber: week,
    weekday: 7,
  });

  const sameMonth = fromDate.month === toDate.month;
  const sameYear = fromDate.year === toDate.year;

  return (
    <p title={`Week ${week}, ${year}`} className="cursor-default inline-block">
      {fromDate.toLocaleString({
        day: 'numeric',
        month: sameMonth ? undefined : 'short',
        year: sameYear ? undefined : '2-digit',
      })}
      {' - '}
      {toDate.toLocaleString({
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      })}
    </p>
  );
}
