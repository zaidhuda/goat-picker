export type Profile = {
  id: string;
  displayName: string;
  photoURL: string;
  slackProfile?: Record<string, unknown>;
};

export type ProfileWithStats = Profile & {
  totalVotes: number;
  totalVoted: number;
};
