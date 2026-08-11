'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/features/theme/theme-slice';
import {
  themeSetDarkCommandData,
  themeSetLightCommandData,
  themeToggleCommandData,
} from './theme-commands';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <themeSetDarkCommandData.icon className="size-[1.2rem]" />
        <span className="sr-only">{themeToggleCommandData.name}</span>
      </Button>
    );
  }

  function handleThemeToggle() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  }

  return (
    <Button
      variant={theme === 'light' ? 'outline' : 'secondary'}
      size="icon"
      onClick={handleThemeToggle}>
      {theme === 'light' ? (
        <themeSetLightCommandData.icon
          className={cn('size-[1.2rem] transition-all duration-300')}
        />
      ) : (
        <themeSetDarkCommandData.icon
          className={cn('size-[1.2rem] w-[1.2rem] transition-all duration-300')}
        />
      )}
      <span className="sr-only">{themeToggleCommandData.name}</span>
    </Button>
  );
}
