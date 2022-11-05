export type Configurations = {
  MAX_ATTENDEES?: number;
  MAX_VOTES_PER_USER?: number;
  EMAIL_DOMAIN?: string;
};

export type GetConfigFn = <T extends keyof Configurations>(
  config: T,
  defaultValue: NonNullable<Configurations[T]>
) => NonNullable<Configurations[T]>;
