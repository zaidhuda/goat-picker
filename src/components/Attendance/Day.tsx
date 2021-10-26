import React, { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import Avatar from 'components/Avatar';
import useAttendances from 'hooks/useAttendances';
import { Profile } from 'types/profile';
import { DateTime } from 'luxon';
import useFirebase from 'hooks/useFirebase';
import { ButtonBase } from '@material-ui/core';

const MAX_ATTENDEES = 10; // TODO: Set value from API

interface Props {
  date: DateTime;
}

export default function AttendanceDay({ date }: Props) {
  const [disabled, setDisabled] = useState(false);
  const { user } = useFirebase();
  const { getAttendances, addAttendance, removeAttendance } = useAttendances();

  const [attendances, setAttendances] = useState<Profile[]>([]);

  const hasUser = useMemo(() => {
    return user && attendances.some(({ id }) => id === user?.uid);
  }, [user, attendances]);

  const toggleAttendance = () => {
    if (!disabled && date >= DateTime.now().startOf('day')) {
      setDisabled(true);
      if (hasUser) {
        removeAttendance(date, () => setDisabled(false));
      } else {
        addAttendance(date, () => setDisabled(false));
      }
    }
  };

  useEffect(() => {
    return getAttendances(date, (results) => {
      setAttendances(results);
    });
  }, [getAttendances, date]);

  const attendeesCount = attendances.length;

  let style = { border: 'border-gray-300', text: 'text-gray-400' };
  if (attendeesCount >= 1)
    style = { border: 'border-green-500', text: 'text-green-500' };
  if (attendeesCount >= MAX_ATTENDEES / 2)
    style = { border: 'border-yellow-500', text: 'text-yellow-500' };
  if (attendeesCount === MAX_ATTENDEES)
    style = { border: 'border-red-500', text: 'text-red-500' };

  const CountContent = () => (
    <>
      <span>
        {attendeesCount}/{MAX_ATTENDEES}
      </span>
      <span>({((attendeesCount / MAX_ATTENDEES) * 100).toFixed(0)}%)</span>
    </>
  );

  return (
    <ButtonBase
      onClick={toggleAttendance}
      className="!rounded"
      title="Press to book or remove"
      disabled={
        date < DateTime.now().startOf('day') ||
        (attendeesCount === MAX_ATTENDEES && !hasUser)
      }
    >
      <div
        className={classnames(
          'border-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-h-[86px] p-2 sm:p-4 rounded w-full',
          style.border
        )}
      >
        <div className="flex sm:flex-col items-baseline sm:items-start justify-between min-w-[120px]">
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
        </div>
        <div className="flex flex-1 gap-2">
          <div className="grid gap-2 grid-cols-5 sm:grid-cols-10 w-full items-center justify-items-center">
            {attendances.map(({ photoURL, displayName }) => (
              <Avatar
                size={32}
                key={photoURL}
                photoURL={photoURL}
                displayName={displayName}
              />
            ))}
          </div>
          <div
            className={classnames(
              'hidden sm:flex flex-col font-medium text-lg text-right w-14',
              style.text
            )}
          >
            <CountContent />
          </div>
        </div>
      </div>
    </ButtonBase>
  );
}
