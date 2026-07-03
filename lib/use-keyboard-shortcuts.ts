import { commandsRegistry } from '@/components/commands/commands-registry';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';

export function useKeyboardShortcuts() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    function isWithinInteractiveOverlay(el: HTMLElement | null): boolean {
      const roles = new Set([
        'menu',
        'listbox',
        'combobox',
        'dialog',
        'tree',
        'grid',
        'menuitem',
        'option',
      ]);
      let node: HTMLElement | null = el;
      while (node) {
        const role = node.getAttribute('role');
        if (role && roles.has(role)) return true;
        // cmdk / command palette markers
        if (node.dataset?.slot === 'command') return true;
        node = node.parentElement;
      }
      return false;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // If another handler has already claimed this key, do nothing
      if (e.defaultPrevented) return;

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

      // If navigating inside interactive overlays (e.g., context menus, lists),
      // don't handle ArrowUp/ArrowDown globally
      if (
        (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
        isWithinInteractiveOverlay(target)
      ) {
        return;
      }


      // Check for command palette shortcut (Cmd/Ctrl + K)
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        // Let the command palette component handle this
        return;
      }
      
      // Check for registered command shortcuts
      const modifiers: string[] = [];
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
      const base = modifiers.join('+');
      const shortcut = base ? `${base}+${e.key.toLowerCase()}` : e.key;
      
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
