"use client";
import { useCommandsRegistry } from "./commands-context";
import { useEffect } from "react";
import { themeSetDarkCommand, themeSetLightCommand, themeToggleCommand } from "@/components/theme/theme-commands";
import { useKeyboardShortcuts } from "@/lib/use-keyboard-shortcuts";

export function CommandsInitializer() {
    const { registerCommand, unregisterCommand } = useCommandsRegistry();

    // setup keyboard shortcuts
    useKeyboardShortcuts();

    useEffect(() => {
        // Register theme commands
        registerCommand(themeToggleCommand);
        registerCommand(themeSetLightCommand);
        registerCommand(themeSetDarkCommand);

        return () => {
            // Unregister theme commands on unmount
            unregisterCommand(themeToggleCommand.id);
            unregisterCommand(themeSetLightCommand.id);
            unregisterCommand(themeSetDarkCommand.id);
        }
    }, [registerCommand, unregisterCommand]);

    return null;
}