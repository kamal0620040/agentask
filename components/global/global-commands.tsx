'use client';
import { useCommands } from '../commands/commands-context';
import { useEffect } from 'react';
import {
  themeSetDarkCommandCreator,
  themeSetLightCommandCreator,
  themeToggleCommandCreator,
} from '@/components/theme/theme-commands';
import { aiChatToggleCommandCreator } from '@/components/ai/ai-chat-commands';

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
    const unregisterAiChatToggle = registerCommand(
      aiChatToggleCommandCreator(),
    );

    return () => {
      unregisterThemeToggle();
      unregisterThemeSetLight();
      unregisterThemeSetDark();
      unregisterAiChatToggle();
    };
  }, [registerCommand]);

  return null;
}
