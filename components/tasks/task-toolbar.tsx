'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useCommandsRegistry } from '@/components/commands/commands-context';
import {
  toggleTaskStatus,
} from '@/store/features/tasks/tasks-slice';
import {
  taskDeleteCommand,
  TaskDeleteCommandIcon,
  taskSelectNextCommand,
  TaskSelectNextCommandIcon,
  taskSelectPreviousCommand,
  TaskSelectPreviousCommandIcon,
  taskUnselectCommand,
} from './task-commands';
import { useEffect } from 'react';
import { Todo } from '@/types/todo';
import { selectHasNextTask, selectHasPreviousTask } from '@/store/features/tasks/tasks-selector';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { formatShortcut } from '@/lib/utils';

export function TaskToolbar({ selectedTask }: { selectedTask: Todo }) {
  const { registerCommand } = useCommandsRegistry();

  const dispatch = useAppDispatch();
  const hasNextTask = useAppSelector(selectHasNextTask);
  const hasPreviousTask = useAppSelector(selectHasPreviousTask);

  useEffect(() => {
    const unregisterTaskDelete = registerCommand(taskDeleteCommand(selectedTask.id));
    const unregisterTaskUnselect = registerCommand(taskUnselectCommand());

    return () => {
      unregisterTaskDelete();
      unregisterTaskUnselect();
    };
  }, [registerCommand, selectedTask.id]);

  const taskDeleteCommandObj = taskDeleteCommand(selectedTask.id);
  const taskSelectNextCommandObj = taskSelectNextCommand();
  const taskSelectPreviousCommandObj = taskSelectPreviousCommand();

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              dispatch(toggleTaskStatus(selectedTask.id));
            }}
            className="gap-2">
            <RefreshCw className="size-4" />
            {selectedTask.status === 'done' ? 'Mark as Todo' : 'Mark as Done'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {selectedTask.status === 'done' ? 'Mark as Todo' : 'Mark as Done'}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              dispatch(taskDeleteCommandObj.action());
            }}
            aria-label="Delete"
            className="gap-2">
            <TaskDeleteCommandIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>{taskDeleteCommandObj.name}</span>
          {taskDeleteCommandObj.shortcut && (
            <kbd className="ml-2 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              {formatShortcut(taskDeleteCommandObj.shortcut)}
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
              dispatch(taskSelectNextCommandObj.action());
            }}
            disabled={!hasNextTask}
            aria-label="Next task"
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
              dispatch(taskSelectPreviousCommandObj.action());
            }}
            disabled={!hasPreviousTask}
            aria-label="Prev task"
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
  );
}