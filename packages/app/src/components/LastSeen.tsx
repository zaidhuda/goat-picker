import React, { useEffect, useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { DateTime } from 'luxon';

type Props = { lastSeen?: Timestamp };

export default function LastSeen({ lastSeen }: Props) {
  const [lastSeenText, setLastSeenText] = useState<string | null>();

  useEffect(() => {
    const getLastSeenText = () => {
      if (lastSeen) {
        const lastSeenDate = DateTime.fromJSDate(lastSeen.toDate());
        const minutesSince = lastSeenDate
          .until(DateTime.now())
          .length('minutes');

        if (minutesSince < 1) {
          return 'Just now';
        }

        return lastSeenDate.toRelative();
      }
    };

    setLastSeenText(getLastSeenText);

    const interval = setInterval(() => {
      setLastSeenText(getLastSeenText);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastSeen]);

  if (!lastSeen || !lastSeenText) {
    return <span className="font-extralight italic">Never seen</span>;
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
