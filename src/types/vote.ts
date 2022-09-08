import firebase from 'firebase/app';
import 'firebase/firestore';
import { Profile, ProfileWithStats } from './profile';

export type UserVote = {
  id: string;
  voted: firebase.firestore.DocumentReference<Profile>;
  voter: firebase.firestore.DocumentReference<Profile>;
  year: number;
  week: number;
};

export type AnnualStats = {
  busiestWeek: [number, number];
  highestVoted: number;
  highestVotes: number;
  profileWithStats: ProfileWithStats[];
  totalParticipation: number;
  totalVoted: number;
  totalVotes: number;
};
