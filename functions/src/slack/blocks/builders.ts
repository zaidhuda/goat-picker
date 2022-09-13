import { Button, SectionBlock } from '@slack/bolt';

export const buildPlainTextSection = (text: string): SectionBlock => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text,
  },
});

export const buildPlainTextSections = (
  messages: string | string[]
): SectionBlock[] =>
  Array.isArray(messages)
    ? messages.map(buildPlainTextSection)
    : [buildPlainTextSection(messages)];

export const buildButtonLinkElement = ({
  action_id = 'button-link',
  value = 'home',
  path = '/',
  text = 'Open GOAT Picker',
  ...props
}: Partial<Omit<Button, 'text'>> & {
  path?: string;
  text?: string;
}): Button => ({
  type: 'button',
  action_id,
  value,
  url: `https://goat-picker.web.app${path}`,
  text: {
    type: 'plain_text',
    emoji: true,
    text,
  },
  ...props,
});

export const buildButtonLinkSection = (
  text: string,
  accessory: Button
): SectionBlock => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text,
  },
  accessory,
});
