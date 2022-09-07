import useFirebase from './useFirebase';
import { useEffect, useState } from 'react';
import { TrelloCard } from 'types/trello';
import { DateTime } from 'luxon';

type RawTrelloCard = TrelloCard & { start: string };

export default function useLnLLists() {
  const [cards, setCards] = useState<TrelloCard[]>();
  const { functions } = useFirebase();

  useEffect(() => {
    const today = DateTime.local().startOf('day');

    if (functions) {
      functions
        .httpsCallable('lnlSchedules')()
        .then((res: { data: RawTrelloCard[] }) => {
          setCards(
            res.data
              .filter(({ start }) => !!start)
              .map((card) => ({
                ...card,
                start: DateTime.fromISO(card.start),
              }))
              .map((card) => ({
                ...card,
                today: today.equals(card.start.startOf('day')),
              }))
              .filter(({ start }) => DateTime.now() < start)
              .sort((a, b) => a.start.toMillis() - b.start.toMillis())
          );
        });
    }
  }, [functions]);

  return cards;
}
