import { DocumentReference } from 'firebase-admin/firestore';
import { Profile, ProfileWithStats } from './profile';

export type UserVote = {
  id: string;
  voted: DocumentReference<Profile>;
  voter: DocumentReference<Profile>;
  year: number;
  week: number;
};

export type Stats = {
  busiestWeek: [number, number];
  highestVoted: number;
  highestVotes: number;
  profileWithStats: ProfileWithStats[];
  totalParticipation: number;
  totalVoted: number;
  totalVotes: number;
};
