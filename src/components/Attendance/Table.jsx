import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { ButtonBase } from '@material-ui/core';

import classnames from 'classnames';
import useFirebase from '../../hooks/useFirebase';

import AttendanceDay from './Day';
import Avatar from '../Avatar';

const MAX_ATTENDEES = 10; // TODO: Set value from API

export default function AttendanceTable() {
  const { users, user, getAttendances, addAttendance, removeAttendance } =
    useFirebase();
  const {
    query: { week: weekParam, year: yearParam },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

  const [attendances, setAttendances] = useState([]);
  const [showWeekend, toggleWeekend] = useState(false);

  const getDate = (weekday) =>
    DateTime.fromObject({
      weekYear: year,
      weekNumber: week,
      weekday,
    });

  const getAttendanceByDay = (date) =>
    attendances.find(({ id }) => id === date.toISODate());

  const toggleAttendance = (date) => () => {
    if (date >= DateTime.now().startOf('day')) {
      if (
        !getAttendanceByDay(date)?.attendees.find(({ id }) => id === user.uid)
      ) {
        addAttendance(date);
      } else {
        removeAttendance(date);
      }
    }
  };

  useEffect(() => {
    setAttendances([]);
    const listener = getAttendances(year, week, (results) => {
      setAttendances(
        results.map(({ attendees = [], ...rest }) => ({
          ...rest,
          attendees: attendees.map((uid) => users.find(({ id }) => uid === id)),
        }))
      );
    });

    return listener;
  }, [getAttendances, users, week, year]);

  return (
    <div className="flex flex-col gap-4 pb-16">
      {[getDate(1), getDate(2), getDate(3), getDate(4), getDate(5)].map(
        (date) => {
          const attendeesCount = getAttendanceByDay(date)?.attendees.length;
          let style = { border: 'border-gray-300', text: 'text-gray-400' };
          if (attendeesCount >= 1)
            style = { border: 'border-green-500', text: 'text-green-500' };
          if (attendeesCount >= MAX_ATTENDEES / 2)
            style = { border: 'border-yellow-500', text: 'text-yellow-500' };
          if (attendeesCount === MAX_ATTENDEES)
            style = { border: 'border-red-500', text: 'text-red-500' };

          const hasUser = getAttendanceByDay(date)?.attendees.some(
            ({ id }) => id === user.uid
          );

          const CountContent = () => (
            <>
              <span>
                {attendeesCount}/{MAX_ATTENDEES}
              </span>
              <span>
                ({((attendeesCount / MAX_ATTENDEES) * 100).toFixed(0)}%)
              </span>
            </>
          );

          return (
            <ButtonBase
              key={date.toISODate()}
              onClick={toggleAttendance(date)}
              className="!rounded"
              title="Press to book or remove"
              disabled={
                date < DateTime.now().startOf('day') ||
                (attendeesCount === MAX_ATTENDEES && !hasUser)
              }
            >
              <AttendanceDay
                className={style.border}
                label={
                  <>
                    <div className="flex sm:flex-col items-baseline gap-2 sm:gap-0 text-center sm:text-left">
                      <p className="sm:text-xl">{date.weekdayLong}</p>
                      <p className="text-sm sm:text-base text-gray-400">
                        {date.toLocaleString()}
                      </p>
                    </div>
                    <p
                      className={classnames(
                        'flex gap-1 sm:hidden text-sm sm:text-base',
                        style.text
                      )}
                    >
                      <CountContent />
                    </p>
                  </>
                }
              >
                <div className="grid gap-2 grid-cols-5 sm:grid-cols-10 w-full items-center justify-items-center">
                  {getAttendanceByDay(date)?.attendees.map(
                    ({ photoURL, displayName }) => (
                      <Avatar
                        size={32}
                        key={photoURL}
                        photoURL={photoURL}
                        displayName={displayName}
                      />
                    )
                  )}
                </div>
                <div
                  className={classnames(
                    'hidden sm:flex flex-col font-medium text-lg text-right w-14',
                    style.text
                  )}
                >
                  <CountContent />
                </div>
              </AttendanceDay>
            </ButtonBase>
          );
        }
      )}
      <button
        className="mx-auto"
        type="button"
        onClick={() => toggleWeekend(!showWeekend)}
      >
        I want to see weekend
      </button>
      {showWeekend && (
        <>
          <AttendanceDay
            label={
              <>
                <p className="text-xl">{getDate(6).weekdayLong}</p>
                <p className="text-gray-400">{getDate(6).toLocaleString()}</p>
              </>
            }
          >
            <p className="text-xl">It's the weekend!</p>
          </AttendanceDay>
          <AttendanceDay
            label={
              <>
                <p className="text-xl">{getDate(7).weekdayLong}</p>
                <p className="text-gray-400">{getDate(7).toLocaleString()}</p>
              </>
            }
          >
            <p className="text-xl">It's the weekend!</p>
          </AttendanceDay>
        </>
      )}
    </div>
  );
}
