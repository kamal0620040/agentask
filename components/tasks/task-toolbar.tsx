'use client';

import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import {
  taskSelectNextCommand,
  TaskSelectNextCommandIcon,
  taskSelectPreviousCommand,
  TaskSelectPreviousCommandIcon,
} from './task-commands';
import {
  selectHasNextTask,
  selectHasPreviousTask,
  selectSelectedTask,
} from '@/store/features/tasks/tasks-selector';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { formatShortcut } from '@/components/shortcuts/format-shortcut';
import NewTaskDialog from './new-task-dialog';
import { useCommands } from '../commands/commands-context';
import { useEffect } from 'react';

export function TaskToolbar() {
  const { registerCommand } = useCommands();
  const hasNextTask = useAppSelector(selectHasNextTask);
  const hasPreviousTask = useAppSelector(selectHasPreviousTask);
  const selectedTask = useAppSelector(selectSelectedTask);

  const taskSelectNextCommandObj = taskSelectNextCommand();
  const taskSelectPreviousCommandObj = taskSelectPreviousCommand();

  useEffect(() => {
    const unregisterNext = registerCommand(taskSelectNextCommand());
    const unregisterPrevious = registerCommand(taskSelectPreviousCommand());

    return () => {
      unregisterNext();
      unregisterPrevious();
    };
  }, [registerCommand]);

  return (
    <div className="flex items-center gap-2">
      <NewTaskDialog />
      {selectedTask && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  taskSelectNextCommandObj.action();
                }}
                disabled={!hasNextTask}
                aria-label={taskSelectNextCommandObj.name}
                className="gap-2">
                <TaskSelectNextCommandIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>{taskSelectNextCommandObj.name}</span>
              {taskSelectNextCommandObj.shortcut && (
                <kbd className="ml-2 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  {formatShortcut(taskSelectNextCommandObj.shortcut)}
                </kbd>
              )}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  taskSelectPreviousCommandObj.action();
                }}
                disabled={!hasPreviousTask}
                aria-label={taskSelectPreviousCommandObj.name}
                className="gap-2">
                <TaskSelectPreviousCommandIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>{taskSelectPreviousCommandObj.name}</span>
              {taskSelectPreviousCommandObj.shortcut && (
                <kbd className="ml-2 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  {formatShortcut(taskSelectPreviousCommandObj.shortcut)}
                </kbd>
              )}
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
}