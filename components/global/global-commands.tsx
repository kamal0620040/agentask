'use client';
import { useCommands } from '../commands/commands-context';
import { useEffect } from 'react';
import {
  themeSetDarkCommandCreator,
  themeSetLightCommandCreator,
  themeToggleCommandCreator,
} from '@/components/theme/theme-commands';

export function GlobalCommands() {
  const { registerCommand } = useCommands();

  useEffect(() => {
    const unregisterThemeToggle = registerCommand(
      themeToggleCommandCreator(),
    );
    const unregisterThemeSetLight = registerCommand(
      themeSetLightCommandCreator(),
    );
    const unregisterThemeSetDark = registerCommand(
      themeSetDarkCommandCreator(),
    );

    return () => {
      unregisterThemeToggle();
      unregisterThemeSetLight();
      unregisterThemeSetDark();
    };
  }, [registerCommand]);

  return null;
}
