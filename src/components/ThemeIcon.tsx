import React from 'react';
import { BrightnessAuto, DarkMode, LightMode } from '@mui/icons-material';
import { IconButton, SvgIconProps } from '@mui/material';
import useDarkMode from 'hooks/useDarkMode';

export default function ThemeIcon() {
  const { theme, toggleTheme } = useDarkMode();

  const Icon = (props: SvgIconProps) =>
    ({
      light: <LightMode {...props} />,
      dark: <DarkMode {...props} />,
      auto: <BrightnessAuto {...props} className="text-blue-500" />,
    }[theme]);

  return (
    <IconButton title="Toggle theme" onClick={toggleTheme}>
      <Icon fontSize="medium" className="text-yellow-400" />
    </IconButton>
  );
}
