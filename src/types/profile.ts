export type Profile = {
  id: string;
  displayName: string;
  photoURL: string;
  hidden?: boolean;
};

export type ProfileWithStats = Profile & {
  totalVotes: number;
  totalVoted: number;
};
