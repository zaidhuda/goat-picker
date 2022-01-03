import { Profile } from '../types/profile';

export default function getSlackNames(profiles: Profile[]): string {
  return new Intl.ListFormat('en').format(
    profiles.map(({ displayName, slackId }) =>
      slackId ? `<@${slackId}>` : `*${displayName}*`
    )
  );
}
