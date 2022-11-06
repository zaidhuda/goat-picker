import Axios from 'axios';
import { TrelloCard, TrelloMember } from '../types/trello';

const axiosInstance = Axios.create({
  baseURL: 'https://api.trello.com/1',
});

export default async function getLnlSchedules(): Promise<TrelloCard[]> {
  const { TRELLO_KEY, TRELLO_LNL_CARD_ID, TRELLO_TOKEN } = process.env;

  if (!TRELLO_KEY || !TRELLO_LNL_CARD_ID || !TRELLO_TOKEN) {
    throw new Error(
      'TRELLO_KEY, TRELLO_LNL_CARD_ID, or TRELLO_TOKEN is not defined'
    );
  }

  try {
    const { data: cards } = await axiosInstance.get(
      `/lists/${TRELLO_LNL_CARD_ID}/cards`,
      {
        params: {
          key: TRELLO_KEY,
          token: TRELLO_TOKEN,
          members: true,
        },
      }
    );

    return cards.map((card: TrelloCard) => ({
      id: card.id,
      name: card.name,
      pos: card.pos,
      start: card.start,
      url: card.url,
      members: card.members.map((member: TrelloMember) => ({
        avatarUrl: member.avatarUrl,
        fullName: member.fullName,
        initials: member.initials,
      })),
    }));
  } catch {
    return [];
  }
}
