"use client";
import { useCommands } from "./commands-context";
import { useEffect } from "react";
import { themeSetDarkCommandCreator, themeSetLightCommandCreator, themeToggleCommandCreator } from "@/components/theme/theme-commands";
import { useKeyboardShortcuts } from "@/lib/use-keyboard-shortcuts";

export function CommandsInitializer() {
    const { registerCommand } = useCommands();

    // setup keyboard shortcuts
    useKeyboardShortcuts();

    useEffect(() => {
        // Register theme commands
        const unregisterThemeToggle = registerCommand(themeToggleCommandCreator());
        const unregisterThemeSetLight = registerCommand(themeSetLightCommandCreator());
        const unregisterThemeSetDark = registerCommand(themeSetDarkCommandCreator());

        return () => {
            // Unregister theme commands on unmount
            unregisterThemeToggle();
            unregisterThemeSetLight();
            unregisterThemeSetDark();
        }
    }, [registerCommand]);

    return null;
}