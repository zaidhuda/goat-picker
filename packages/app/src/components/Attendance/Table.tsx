import React, { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import useAttendances from 'hooks/useAttendances';
import useWeek from 'hooks/useWeek';
import { Attendance } from 'types/attendance';
import AttendanceDay from './Day';

export default function AttendanceTable() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const { getAttendances } = useAttendances();
  const { currentWeek, currentYear } = useWeek();
  const {
    query: { week: weekParam = currentWeek, year: yearParam = currentYear },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

  useEffect(() => {
    return getAttendances(year, week, (results) => {
      setAttendances(results);
    });
  }, [getAttendances, year, week]);

  const days = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) =>
        DateTime.fromObject({
          weekYear: year,
          weekNumber: week,
          weekday: i + 1,
        })
      ),
    [week, year]
  );

  return (
    <div className="flex flex-col gap-4">
      {days.map((date) => (
        <AttendanceDay
          key={date.toISODate()}
          date={date}
          attendances={attendances.filter(
            ({ date: attendanceDate = date.toISODate() }) =>
              date.hasSame(DateTime.fromISO(attendanceDate), 'day')
          )}
        />
      ))}
    </div>
  );
}
