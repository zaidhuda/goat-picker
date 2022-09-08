import useFirebase from './useFirebase';
import { useEffect, useState } from 'react';
import { TrelloCard } from 'types/trello';
import { DateTime } from 'luxon';

type RawTrelloCard = TrelloCard & { start: string };

export default function useLnLLists() {
  const [cards, setCards] = useState<TrelloCard[]>();
  const { db } = useFirebase();

  useEffect(() => {
    const today = DateTime.local().startOf('day');

    if (db) {
      db.doc('lnl/upcoming').onSnapshot((doc) => {
        const { schedules } = doc.data() as { schedules: RawTrelloCard[] };
        setCards(
          schedules
            .map((card) => ({
              ...card,
              start: DateTime.fromJSDate(new Date(card.name)).isValid
                ? DateTime.fromJSDate(new Date(card.name))
                : DateTime.fromISO(card.start),
            }))
            .map((card) => ({
              ...card,
              today: today.equals(card.start.startOf('day')),
            }))
            .filter(({ start }) => !!start && DateTime.now() < start)
            .sort((a, b) => a.start.toMillis() - b.start.toMillis())
        );
      });
    }
  }, [db]);

  return cards;
}
