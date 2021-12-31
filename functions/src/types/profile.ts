export type Profile = {
  id: string;
  displayName: string;
  photoURL: string;
  slackProfile?: Record<string, unknown>;
};
