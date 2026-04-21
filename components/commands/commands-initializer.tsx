"use client";
import { useCommandsRegistry } from "./commands-context";
import { useEffect } from "react";
import { themeSetDarkCommand, themeSetLightCommand, themeToggleCommand } from "@/components/theme/theme-commands";
import { useKeyboardShortcuts } from "@/lib/use-keyboard-shortcuts";

export function CommandsInitializer() {
    const { registerCommand } = useCommandsRegistry();

    // setup keyboard shortcuts
    useKeyboardShortcuts();

    useEffect(() => {
        // Register theme commands
        const unregisterThemeToggle = registerCommand(themeToggleCommand());
        const unregisterThemeSetLight = registerCommand(themeSetLightCommand());
        const unregisterThemeSetDark = registerCommand(themeSetDarkCommand());

        return () => {
            // Unregister theme commands on unmount
            unregisterThemeToggle();
            unregisterThemeSetLight();
            unregisterThemeSetDark();
        }
    }, [registerCommand]);

    return null;
}