'use client';

import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import {
  taskRedoCommand,
  taskUndoCommand,
  TaskRedoCommandIcon,
  TaskUndoCommandIcon,
} from './task-commands';
import {
  selectTasksCanRedo,
  selectTasksCanUndo,
} from '@/store/features/tasks/tasks-selector';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { formatShortcut } from '@/components/shortcuts/format-shortcut';
import TaskCreateDialog from './create/task-create-dialog';
import { TaskDisplayDropdown } from './display/task-display-dropdown';
import { useCommands } from '../commands/commands-context';
import { useEffect } from 'react';

export function TaskToolbar() {
  const { registerCommand } = useCommands();
  const tasksCanUndo = useAppSelector(selectTasksCanUndo);
  const tasksCanRedo = useAppSelector(selectTasksCanRedo);

  const taskUndoCommandObj = taskUndoCommand();
  const taskRedoCommandObj = taskRedoCommand();

  useEffect(() => {
    const unregisterUndo = registerCommand(taskUndoCommand());
    const unregisterRedo = registerCommand(taskRedoCommand());

    return () => {
      unregisterUndo();
      unregisterRedo();
    };
  }, [registerCommand]);

  return (
    <div className="flex justify-between items-center gap-2 w-full">
      <TaskCreateDialog />
      <div className="flex items-center gap-1">
        <TaskDisplayDropdown />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                taskUndoCommandObj.action();
              }}
              disabled={!tasksCanUndo}
              aria-label={taskUndoCommandObj.name}
              className="gap-2">
              <TaskUndoCommandIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{taskUndoCommandObj.name}</span>
            {taskUndoCommandObj.shortcut && (
              <kbd className="ml-2 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {formatShortcut(taskUndoCommandObj.shortcut)}
              </kbd>
            )}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                taskRedoCommandObj.action();
              }}
              disabled={!tasksCanRedo}
              aria-label={taskRedoCommandObj.name}
              className="gap-2">
              <TaskRedoCommandIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{taskRedoCommandObj.name}</span>
            {taskRedoCommandObj.shortcut && (
              <kbd className="ml-2 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {formatShortcut(taskRedoCommandObj.shortcut)}
              </kbd>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}