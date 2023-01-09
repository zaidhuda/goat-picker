import React, { useRef, useMemo, useState } from 'react';
import { Avatar, AvatarGroup, Badge, ButtonBase } from '@mui/material';
import classnames from 'classnames';
import { DateTime } from 'luxon';
import useAttendances from 'hooks/useAttendances';
import useFirebase from 'hooks/useFirebase';
import { Attendance } from 'types/attendance';

interface Props {
  date: DateTime;
  attendances?: Attendance[];
}

export default function AttendanceDay({ date, attendances = [] }: Props) {
  const avatarsContainer = useRef<HTMLDivElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useFirebase();
  const { addAttendance, removeAttendance } = useAttendances();

  const hasUser = useMemo(() => {
    return user && attendances.some(({ id }) => id === user?.id);
  }, [user, attendances]);

  const toggleAttendance = () => {
    if (!submitting && date >= DateTime.now().startOf('day')) {
      setSubmitting(true);
      if (hasUser) {
        removeAttendance(date, () => setSubmitting(false));
      } else {
        addAttendance(date, () => setSubmitting(false));
      }
    }
  };

  const maxAvatars = Math.floor(
    (avatarsContainer.current?.clientWidth || 36 * 5) / 36
  );

  const attendeesCount = attendances.length;

  const today = date.toISODate() === DateTime.now().toISODate();
  const past = date < DateTime.now().startOf('day');

  let style = {
    border:
      'border-gray-300 ring-gray-100 dark:border-gray-600 dark:ring-gray-700',
    text: 'text-gray-400',
  };
  if (attendeesCount >= 1)
    style = {
      border: 'border-emerald-500 ring-emerald-100 dark:ring-emerald-800',
      text: 'text-emerald-500',
    };

  return (
    <Badge badgeContent={attendeesCount} color="primary">
      <ButtonBase
        onClick={toggleAttendance}
        className="!rounded !outline !outline-offset-0 focus:!outline-2 dark:!outline-gray-600 w-full"
        title="Press to book or remove"
        disabled={past}
      >
        <div
          className={classnames(
            'border-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 h-[96px] sm:h-[92px] p-2 sm:p-4 rounded w-full',
            style.border,
            { 'text-gray-400': past, 'ring-4': today }
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
            </>
          </div>
          <div ref={avatarsContainer} className="flex flex-1">
            <AvatarGroup max={maxAvatars}>
              {attendances.map(({ photoURL, displayName }) => (
                <Avatar
                  key={photoURL}
                  src={photoURL}
                  alt={displayName}
                  title={displayName}
                  imgProps={{
                    referrerPolicy: 'no-referrer',
                  }}
                />
              ))}
            </AvatarGroup>
          </div>
        </div>
      </ButtonBase>
    </Badge>
  );
}
