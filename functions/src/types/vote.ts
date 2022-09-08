import { firestore } from 'firebase-admin';
import { Profile, ProfileWithStats } from './profile';

export type UserVote = {
  id: string;
  voted: firestore.DocumentReference<Profile>;
  voter: firestore.DocumentReference<Profile>;
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
