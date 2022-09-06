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

export default function WeekGraph({ week, year, size = 48 }: Props) {
  const gap = size / 6;
  const fontSize = size * 0.4;

  const { currentWeek, currentYear } = useWeek();
  const date = DateTime.fromObject({ weekNumber: week, weekYear: year }).plus({
    days: 3,
  });

  const days = useMemo(() => {
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

    // Pad days if selected week has less than 7 days
    lastDay = days[days.length - 1];
    if (lastDay.weekday === 6 && lastDay.weekNumber === date.weekNumber) {
      Array.from({ length: 7 - lastDay.weekday }, (_, index) =>
        days.push(lastDay.plus({ hours: 24 * (index + 1) }))
      );
    }

    return days;
  }, [date]);

  const renderDay = (day: DateTime, dayIndex: number) => {
    const isActiveMonth = day.month === date.month;
    const isActiveWeek = day.weekNumber === week;

    return (
      <div
        key={dayIndex}
        className={classNames(
          'flex items-center justify-center dark:text-gray-900',
          isActiveWeek
            ? isActiveMonth
              ? 'bg-emerald-400 dark:bg-emerald-500'
              : 'bg-emerald-200 dark:bg-emerald-700'
            : isActiveMonth
            ? 'bg-gray-200 dark:bg-gray-400'
            : 'invisible'
        )}
        style={{ width: size, height: size, fontSize }}
      >
        <span>{day.day}</span>
      </div>
    );
  };

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
        className="!rounded"
        title={`Go to Week ${currentWeek}, ${currentYear}`}
      >
        <div
          className="flex items-center justify-center relative"
          style={{ height: size, width: size }}
        >
          <div
            className="absolute grid grid-cols-7 z-[-1]"
            style={{
              gap,
              transform: `scale(${size / (size * 8)})`,
              width: size * 8,
            }}
          >
            {/* {weeks.map(renderWeek)} */}
            {days.map(renderDay)}
          </div>

          <span
            className="uppercase font-bold opacity-60 dark:text-gray-600"
            style={{ fontSize }}
          >
            {date.monthShort}
          </span>
        </div>
      </ButtonBase>
    </Link>
  );
}
