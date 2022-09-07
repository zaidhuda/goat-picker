export type TrelloCard = {
  id: string;
  members: TrelloMember[];
  pos: number;
  start: string;
  url: string;
};

export type TrelloMember = {
  avatarUrl: string;
  fullName: string;
  initials: string;
};
