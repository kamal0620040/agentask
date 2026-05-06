import { TaskStatus, type Task } from '@/types/task';
import { useCommandsRegistry } from '../commands/commands-context';
import { useAppDispatch } from '@/store/hooks';
import {
  taskDeleteCommand,
  TaskDeleteCommandIcon,
  taskUnselectCommand,
} from './task-commands';
import { useEffect } from 'react';
import { updateTaskStatus } from '@/store/features/tasks/tasks-slice';
import { Button } from '../ui/button';
import { cn, formatShortcut } from '@/lib/utils';
import { TooltipTrigger, TooltipContent, Tooltip } from '../ui/tooltip';
import { RiArrowDownSLine } from 'react-icons/ri';
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenu } from '../ui/dropdown-menu';
import { taskStatusList, taskStatusRecord } from './status/task-status-list';
import { TaskStatusIcon } from './status/task-status-icon';

export type TaskDetailsProps = {
  task: Task;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  const { registerCommand } = useCommandsRegistry();
  const dispatch = useAppDispatch();

  const assigneeName = task.assigneeId || 'No assignee';
  const taskDeleteCommandObj = taskDeleteCommand(task.id);

  function handleStatusChange(newStatus: TaskStatus) {
    if (newStatus !== task.status) {
      dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
    }
  }

  useEffect(() => {
    const unregisterTaskDelete = registerCommand(taskDeleteCommand(task.id));
    const unRegisterTaskUnselect = registerCommand(taskUnselectCommand());

    return () => {
      unregisterTaskDelete();
      unRegisterTaskUnselect();
    };
  }, [registerCommand, task.id]);

  return (  
    <div className={cn('divide-y divide-input')}>
      <div
        className={cn('flex items-center gap-2 justify-between', 'py-2 px-2')}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              aria-label="Change status">
              <TaskStatusIcon status={task.status} />
              <span className="capitalize text-xs font-medium">
                {task.status.replace('-', ' ')}
              </span>
              <RiArrowDownSLine className="w-3 h-3 ml-1 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {taskStatusList.map((status) => {
              const taskStatus = taskStatusRecord[status];

              return (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleStatusChange(status)}>
                  <TaskStatusIcon status={status} className="mr-2" size="md" />
                  {taskStatus.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

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
            </div>
        
        <div className={cn(' flex flex-col gap-2  px-3 py-3')}>
        <h2 className="text-lg font-bold mb-2">{task.title}</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Assignee:</span>
          <span className="font-medium">{assigneeName}</span>
        </div>
        <div className="mb-2 text-sm font-semibold">Description</div>
        <div className="text-sm text-muted-foreground whitespace-pre-line">
          {task.description}
        </div>
      </div>
    </div>
  );
}
