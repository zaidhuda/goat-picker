import { Profile } from '../types/profile';

export default async function getSlackNames(
  profiles: Profile[]
): Promise<string> {
  return new Intl.ListFormat('en').format(
    profiles.map(({ displayName }) => `*${displayName}*`)
  );
}
