import { commandsRegistry } from '@/components/commands/commands-registry';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';

export function useKeyboardShortcuts() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in form element
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable === true ||
          target.contentEditable === 'true')
      ) {
        return;
      }

      // Check for command palette shortcut (Cmd/Ctrl + K)
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        // Let the command palette component handle this
        return;
      }
      
      // Check for registered command shortcuts
      const modifiers = [];
      if (e.metaKey || e.ctrlKey) {
        modifiers.push('cmd');
      }
      if (e.shiftKey) {
        modifiers.push('shift');
      }
      if (e.altKey) {
        modifiers.push('alt');
      }

      // Create shortcut string (e.g., "cmd+t", "cmd+shift+l")
      const shortcut =
      modifiers.length > 0
      ? `${modifiers.join('+')}+${e.key.toLowerCase()}`
      : e.key.toLowerCase();
      
      const command = commandsRegistry.getCommandByShortcut(shortcut);
      
      if (command) {
          e.preventDefault();
          e.stopPropagation();
          dispatch(command.action());
        }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [dispatch]);
}
