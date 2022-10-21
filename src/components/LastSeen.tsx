import React, { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { DateTime } from 'luxon';

type Props = { lastSeen?: Timestamp };

export default function LastSeen({ lastSeen }: Props) {
  const [lastSeenText, setLastSeenText] = useState<string | null>();

  useEffect(() => {
    if (lastSeen) {
      const timeout = setTimeout(() => {
        setLastSeenText(() => {
          const lastSeenDate = DateTime.fromJSDate(lastSeen.toDate());
          const minutesSince = lastSeenDate
            .until(DateTime.now())
            .length('minutes');

          if (minutesSince < 1) {
            return 'Just now';
          } else if (minutesSince < 15) {
            return lastSeenDate.toRelative();
          } else {
            return lastSeenDate.toJSDate().toLocaleString();
          }
        });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [lastSeen, lastSeenText]);

  if (!lastSeen || !lastSeenText) {
    return <span>Never</span>;
  }

  return (
    <time
      dateTime={lastSeen.toDate().toISOString()}
      title={lastSeen.toDate().toLocaleString(undefined, {
        timeStyle: 'long',
        dateStyle: 'long',
      })}
    >
      {lastSeenText}
    </time>
  );
}
