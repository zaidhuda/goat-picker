import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { ButtonBase } from '@material-ui/core';

import useFirebase from '../hooks/useFirebase';
import useWeek from '../hooks/useWeek';

import WeekNavigation from '../components/WeekNavigation';
import AttendanceDay from '../components/AttendanceDay';
import Avatar from '../components/Avatar';
import { getLayout } from '../components/Layout';

export default function AttendancePage() {
  const { getPrevWeek, getNextWeek } = useWeek();
  const { users, user, getAttendances, addAttendance, removeAttendance } =
    useFirebase();
  const {
    query: { week: weekParam, year: yearParam },
  } = useRouter();

  const week = Number(weekParam);
  const year = Number(yearParam);

  const [attendances, setAttendances] = useState([]);

  const prevWeekPath = () => {
    const { week: prevWeek, year: prevYear } = getPrevWeek(year, week);
    return `/attendances?year=${prevYear}&week=${prevWeek}`;
  };

  const nextWeekPath = () => {
    const { week: nextWeek, year: nextYear } = getNextWeek(year, week);
    return `/attendances?year=${nextYear}&week=${nextWeek}`;
  };

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
    <div className="space-y-8">
      <WeekNavigation prevWeekPath={prevWeekPath} nextWeekPath={nextWeekPath} />

      <h1 className="font-light text-5xl">Attendance of week {week}</h1>

      <div className="flex flex-col gap-4 pb-16">
        {[getDate(1), getDate(2), getDate(3), getDate(4), getDate(5)].map(
          (date) => (
            <ButtonBase
              key={date.toISODate()}
              onClick={toggleAttendance(date)}
              className="!rounded"
              title="Press to book or remove"
              disabled={date < DateTime.now().startOf('day')}
            >
              <AttendanceDay
                label={
                  <>
                    <p className="text-xl">{date.weekdayLong}</p>
                    <p className="text-gray-400">{date.toLocaleString()}</p>
                  </>
                }
              >
                {getAttendanceByDay(date)?.attendees?.length ? (
                  <div className="flex gap-2">
                    {getAttendanceByDay(date)?.attendees.map(
                      ({ photoURL, displayName }) => (
                        <Avatar
                          key={photoURL}
                          photoURL={photoURL}
                          displayName={displayName}
                        />
                      )
                    )}
                  </div>
                ) : null}
              </AttendanceDay>
            </ButtonBase>
          )
        )}
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
      </div>
    </div>
  );
}

AttendancePage.options = {
  withUser: true,
  layout: getLayout,
  head: { title: 'Attendances' },
};
