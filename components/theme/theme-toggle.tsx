'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/features/theme/theme-slice';
import { RiMoonLine, RiSunLine } from 'react-icons/ri';

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
        <RiSunLine className="size-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
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
        <RiSunLine className={cn('size-[1.2rem] transition-all duration-300')} />
      ) : (
        <RiMoonLine
          className={cn('size-[1.2rem] w-[1.2rem] transition-all duration-300')}
        />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
