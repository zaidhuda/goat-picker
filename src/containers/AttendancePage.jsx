import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DateTime } from 'luxon';

import useFirebase from '../hooks/useFirebase';
import useWeek from '../hooks/useWeek';

import withUser from '../components/withUser';
import WeekNavigation from '../components/WeekNavigation';
import { ButtonBase } from '@material-ui/core';

const AttendancePage = () => {
  const { getPrevWeek, getNextWeek } = useWeek();
  const { users, user, getAttendances, addAttendance, removeAttendance } =
    useFirebase();
  const { week: weekParam, year: yearParam } = useParams();

  const week = Number(weekParam);
  const year = Number(yearParam);

  let [attendances, setAttendances] = useState([]);

  const prevWeekPath = () => {
    const { week: prevWeek, year: prevYear } = getPrevWeek(year, week);
    return `/attendances/${prevYear}/${prevWeek}`;
  };

  const nextWeekPath = () => {
    const { week: nextWeek, year: nextYear } = getNextWeek(year, week);
    return `/attendances/${nextYear}/${nextWeek}`;
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
              <div className="border-2 flex flex-col sm:flex-row sm:items-center gap-4 min-h-[86px] p-4 rounded w-full">
                <div className="min-w-[120px] text-left">
                  <p className="text-xl">{date.weekdayLong}</p>
                  <p className="text-gray-400">{date.toLocaleString()}</p>
                </div>
                {getAttendanceByDay(date)?.attendees?.length ? (
                  <div>
                    {getAttendanceByDay(date)?.attendees.map(
                      ({ photoURL, displayName }) => (
                        <img
                          src={photoURL}
                          alt={displayName}
                          title={displayName}
                          className="h-12 rounded-full w-12"
                        />
                      )
                    )}
                  </div>
                ) : null}
              </div>
            </ButtonBase>
          )
        )}
      </div>
    </div>
  );
};

export default withUser(AttendancePage);
