"use client";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useEffect, useState } from "react";
import { CommandShortcut } from "./ui/command";
import { themeSetDarkCommand, themeSetLightCommand, themeToggleCommand } from "./theme/theme-commands";

import { useAppDispatch } from "@/store/hooks";

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    return (
        <>
            <p className="text-sm text-muted-foreground">
                Press{' '}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </p>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Theme">
                        {
                            [
                                themeToggleCommand,
                                themeSetDarkCommand,
                                themeSetLightCommand,
                            ].map((command) => (
                                <CommandItem key={command.id} onSelect={() => { 
                                    const action = command.action();
                                    if (action) dispatch(action);
                                    setOpen(false); 
                                }}>
                                    {command.icon && <command.icon className="mr-2 h-4 w-4" />}
                                    <span>{command.name}</span>
                                    {command.shortcut && <CommandShortcut>{command.shortcut}</CommandShortcut>}
                                </CommandItem>
                            ))
                        }
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}