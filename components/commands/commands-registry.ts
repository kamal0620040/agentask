import { Command } from "@/actions/types";

type CommandRegistry = {
    commands: Map<string, Command>;
    keyboardShortcuts: Map<string, string>;
};

class CommandsRegistry {
    private registry: CommandRegistry = {
        commands: new Map(),
        keyboardShortcuts: new Map(),
    };

    private listeners: Set<() => void> = new Set();

    register(command: Command) {
        const existing = this.registry.commands.get(command.id);
        if (existing === command) return;

        this.registry.commands.set(command.id, command);

        if(command.shortcut) {
            this.registry.keyboardShortcuts.set(command.shortcut.toLowerCase(), command.id);
        }

        this.notifyListeners();
    }

    unregister(commandId: string) {
        const command = this.registry.commands.get(commandId);
        if (command?.shortcut) {
            this.registry.keyboardShortcuts.delete(command.shortcut.toLowerCase());
        }
        this.registry.commands.delete(commandId);
        this.notifyListeners();
    }

    getCommand(commandId: string): Command | undefined {
        return this.registry.commands.get(commandId);
    }

    getCommandByShortcut(shortcut: string): Command | undefined {
        const commandId = this.registry.keyboardShortcuts.get(shortcut.toLowerCase());
        return commandId ? this.registry.commands.get(commandId) : undefined;
    }

    getAllCommands(): Command[] {
        return Array.from(this.registry.commands.values());
    }

    getCommandsByGroup(group: string): Command[] {
        return this.getAllCommands().filter((command) => command.group === group);
    };

    clear() {
        this.registry.commands.clear();
        this.registry.keyboardShortcuts.clear();
        this.notifyListeners();
    }

    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners() {
        this.listeners.forEach((listener) => listener());
    }
}

// Global registry instance
export const commandsRegistry = new CommandsRegistry();