import { DateTime } from 'luxon';

export type TrelloCard = {
  id: string;
  name: string;
  members: TrelloMember[];
  pos: number;
  start: DateTime;
  url: string;
  today?: boolean;
};

export type TrelloMember = {
  avatarUrl: string;
  fullName: string;
  initials: string;
};
