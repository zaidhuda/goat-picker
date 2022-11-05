import Axios from 'axios';
import { config } from 'firebase-functions/v1';
import { TrelloCard, TrelloMember } from '../types/trello';

const axiosInstance = Axios.create({
  baseURL: 'https://api.trello.com/1',
});

export default async function getLnlSchedules(): Promise<TrelloCard[]> {
  const { key, token, lnl_card_id } = config().trello;

  try {
    const { data: cards } = await axiosInstance.get(
      `/lists/${lnl_card_id}/cards`,
      {
        params: {
          key,
          token,
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
