import { ProfileWithStats } from './profile';

export type UserVote = {
  id: string;
  votes?: string[];
};

export type AnnualStats = {
  highestVoted: number;
  highestVotes: number;
  mostVoted: ProfileWithStats[];
  mostVotes: ProfileWithStats[];
  totalParticipation: number;
  totalVoted: number;
  totalVotes: number;
};
