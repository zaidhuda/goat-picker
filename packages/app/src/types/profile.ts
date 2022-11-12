import { Timestamp } from 'firebase/firestore';

export type Profile = {
  id: string;
  displayName: string;
  photoURL: string;
  hidden?: boolean;
  slackId?: string;
  lastSeenAt?: Timestamp;
  lastSeenOnSlackAt?: Timestamp;
  isAdmin?: boolean;
  docUrl: string;
};

export type ProfileWithStats = Profile & {
  totalVotes: number;
  totalVoted: number;
};
