'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  taskSelectNextCommand,
  TaskSelectNextCommandIcon,
  taskSelectPreviousCommand,
  TaskSelectPreviousCommandIcon,
} from './task-commands';;
import { selectHasNextTask, selectHasPreviousTask } from '@/store/features/tasks/tasks-selector';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { formatShortcut } from '@/lib/utils';

export function TaskToolbar() {
  const dispatch = useAppDispatch();
  const hasNextTask = useAppSelector(selectHasNextTask);
  const hasPreviousTask = useAppSelector(selectHasPreviousTask);

  const taskSelectNextCommandObj = taskSelectNextCommand();
  const taskSelectPreviousCommandObj = taskSelectPreviousCommand();

  return (
    <>
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