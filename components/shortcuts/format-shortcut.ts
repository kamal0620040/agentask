export function formatShortcut(shortcut: string) {
  return shortcut
    .toLowerCase()
    .replace('cmd', '⌘')
    .replace('shift', '⇧')
    .replace('alt', '⌥')
    .replace('ctrl', '⌃')
    .replace('arrowup', '↑')
    .replace('arrowdown', '↓')
    .replace('enter', '↵')
    .replace('escape', 'esc')
    .replace('backspace', '⌫')
    .replaceAll('+', '')
    .toUpperCase();
}