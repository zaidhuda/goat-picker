import React, { useMemo } from 'react';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { ButtonBase } from '@mui/material';
import useWeek from 'hooks/useWeek';
import classNames from 'classnames';

interface Props {
  week: number;
  year: number;
  size?: number;
}

export default function WeekGraph({ week, year, size = 7 }: Props) {
  const { currentWeek, currentYear } = useWeek();
  const date = DateTime.fromObject({ weekNumber: week, weekYear: year }).plus({
    days: 3,
  });

  const weeks = useMemo(() => {
    const days = Array.from<unknown, DateTime>(
      { length: date.daysInMonth },
      (_, dayIndex: number) =>
        DateTime.fromObject({
          year: date.year,
          month: date.month,
          day: dayIndex + 1,
        })
    );

    // Pad beginning days
    const firstDay = days[0];
    if (firstDay.weekday) {
      Array.from({ length: firstDay.weekday }, (_, index) =>
        days.unshift(firstDay.minus({ hours: 24 * (index + 1) }))
      );
    }

    // Pad ending days
    let lastDay = days[days.length - 1];
    if (days.length % 7 > 0) {
      Array.from({ length: 7 - (days.length % 7) }, (_, index) =>
        days.push(lastDay.plus({ hours: 24 * (index + 1) }))
      );
    }

    lastDay = days[days.length - 1];
    if (lastDay.weekday === 6 && lastDay.weekNumber === date.weekNumber) {
      Array.from({ length: 7 - lastDay.weekday }, (_, index) =>
        days.push(lastDay.plus({ hours: 24 * (index + 1) }))
      );
    }

    return [...Array(Math.ceil(days.length / 7))].map(() => days.splice(0, 7));
  }, [date]);

  const renderDay = (day: DateTime, dayIndex: number) => {
    const isActiveMonth = day.month === date.month;
    const isActiveWeek = day.weekNumber === week;

    return (
      <div
        key={dayIndex}
        className={classNames(
          'flex items-center justify-center h-8 w-8',
          isActiveWeek
            ? isActiveMonth
              ? 'bg-emerald-400'
              : 'bg-emerald-200'
            : isActiveMonth
            ? 'bg-gray-200'
            : 'invisible'
        )}
        style={{ zoom: size / 32.0 }}
      >
        <span>{day.day}</span>
      </div>
    );
  };

  const renderWeek = (week: DateTime[], weekIndex: number) => (
    <div key={weekIndex} className="flex gap-[1px]">
      {week.map(renderDay)}
    </div>
  );

  return (
    <Link
      href={{
        query: {
          year: currentYear,
          week: currentWeek,
        },
      }}
      passHref
    >
      <ButtonBase
        focusRipple
        className="!rounded !outline !outline-offset-0 focus:!outline-2"
        title={`Go to Week ${currentWeek}, ${currentYear}`}
      >
        <div
          className="flex items-center relative"
          style={{ height: size * 6 + 5 }}
        >
          <div className="absolute flex items-center justify-center h-full w-full">
            <span className="uppercase font-bold">{date.monthShort}</span>
          </div>
          <div className="flex flex-col gap-[1px] z-[-1]">
            {weeks.map(renderWeek)}
          </div>
        </div>
      </ButtonBase>
    </Link>
  );
}
