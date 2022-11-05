export type Profile = {
  id: string;
  displayName: string;
  photoURL: string;
  slackId?: string;
};

export type ProfileWithStats = Profile & {
  totalVotes: number;
  totalVoted: number;
};
