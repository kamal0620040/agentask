import { type Todo } from '@/types/todo';
import { useCommandsRegistry } from '../commands/commands-context';
import { useAppDispatch } from '@/store/hooks';
import {
  taskDeleteCommand,
  TaskDeleteCommandIcon,
  taskUnselectCommand,
} from './task-commands';
import { useEffect } from 'react';
import { toggleTaskStatus } from '@/store/features/tasks/tasks-slice';
import { RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { formatShortcut } from '@/lib/utils';
import { TooltipTrigger, TooltipContent, Tooltip } from '../ui/tooltip';

export type TaskDetailsProps = {
  task: Todo;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  const { registerCommand } = useCommandsRegistry();
  const dispatch = useAppDispatch();

  const assigneeName = task.assignee?.name || 'No assignee';
  const dueDate = task.dueDate || 'No due date';
  const taskDeleteCommandObj = taskDeleteCommand(task.id);

  useEffect(() => {
    const unregisterTaskDelete = registerCommand(taskDeleteCommand(task.id));
    const unRegisterTaskUnselect = registerCommand(taskUnselectCommand());

    return () => {
      unregisterTaskDelete();
      unRegisterTaskUnselect();
    };
  }, [registerCommand, task.id]);

  return (
    <div className="py-4 px-4">
      <div className="flex items-center gap-2 mb-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                dispatch(toggleTaskStatus(task.id));
              }}
              className="gap-2">
              <RefreshCw className="size-4" />
              {task.status === 'done' ? 'Mark as Todo' : 'Mark as Done'}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {task.status === 'done' ? 'Mark as Todo' : 'Mark as Done'}
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

        <span className="rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          Not started
        </span>
      </div>
      <h2 className="text-lg font-bold mb-2">{task.title}</h2>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Assignee:</span>
        <span className="font-medium">{assigneeName}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <span>Due date:</span>
        <span className="font-medium">{dueDate}</span>
      </div>
      <div className="mb-2 text-sm font-semibold">Description</div>
      <div className="text-sm text-muted-foreground whitespace-pre-line">
        {task.description}
      </div>
    </div>
  );
}
