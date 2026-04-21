import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatShortcut(shortcut: string) {
  return shortcut
    .toLowerCase()
    .replace('cmd', '⌘')
    .replace('shift', '⇧')
    .replace('alt', '⌥')
    .replace('+', '')
    .toUpperCase();
}
