import React, { useRef, useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import useAttendances from 'hooks/useAttendances';
import { Profile } from 'types/profile';
import { DateTime } from 'luxon';
import useFirebase from 'hooks/useFirebase';
import { Avatar, AvatarGroup, ButtonBase } from '@mui/material';

interface Props {
  date: DateTime;
}

export default function AttendanceDay({ date }: Props) {
  const avatarsContainer = useRef<HTMLDivElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user, getConfig } = useFirebase();
  const { getAttendances, addAttendance, removeAttendance } = useAttendances();

  const MAX_ATTENDEES = getConfig<number>('MAX_ATTENDEES', 10);

  const [attendances, setAttendances] = useState<Profile[]>([]);

  const hasUser = useMemo(() => {
    return user && attendances.some(({ id }) => id === user?.uid);
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

  useEffect(() => {
    return getAttendances(date, (results) => {
      setAttendances(results);
    });
  }, [getAttendances, date]);

  const maxAvatars = Math.floor(
    (avatarsContainer.current?.clientWidth || 36 * 5) / 36
  );

  const attendeesCount = attendances.length;

  const past = date < DateTime.now().startOf('day');
  const full = attendeesCount >= MAX_ATTENDEES && !hasUser;
  const disabled = past || full;

  let style = { border: 'border-gray-300', text: 'text-gray-400' };
  if (attendeesCount >= 1)
    style = { border: 'border-green-500', text: 'text-green-500' };
  if (attendeesCount >= MAX_ATTENDEES / 2)
    style = { border: 'border-yellow-500', text: 'text-yellow-500' };
  if (attendeesCount >= MAX_ATTENDEES)
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
      disabled={disabled}
    >
      <div
        className={classnames(
          'border-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 h-[96px] sm:h-[92px] p-2 sm:p-4 rounded w-full',
          style.border,
          { 'text-gray-400': past }
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
        <div ref={avatarsContainer} className="flex flex-1">
          <AvatarGroup max={maxAvatars}>
            {attendances.map(({ photoURL, displayName }) => (
              <Avatar
                key={photoURL}
                src={photoURL}
                alt={displayName}
                title={displayName}
              />
            ))}
          </AvatarGroup>
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
    </ButtonBase>
  );
}
