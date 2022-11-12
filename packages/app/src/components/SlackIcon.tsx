import React from 'react';

export default function SlackIcon({
  size = 16,
  ...props
}: {
  size?: number;
  title?: string;
}) {
  return (
    <img
      {...props}
      alt="Slack"
      src={'/images/slack.ico'}
      width={size}
      height={size}
      className="object-contain"
    />
  );
}
