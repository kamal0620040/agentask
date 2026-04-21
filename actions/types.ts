import { UnknownAction } from "@reduxjs/toolkit";

export type Command = Readonly<{
    id: string;
    name: string;
    description?: string;
    icon?: React.ElementType;
    group?: 'theme' | 'tasks';
    shortcut?: string;
    action: () => UnknownAction;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandCreator = (params?: any) => Command;