import { TaskStatus, type TaskObject } from '@/types/task';
import { useCommands } from '../commands/commands-context';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
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
import { RiContractRightLine } from 'react-icons/ri';
import {
  assignTask,
  updateTask,
} from '@/store/features/tasks/tasks-slice';
import {
  selectHasNextTask,
  selectHasPreviousTask,
} from '@/store/features/tasks/tasks-selector';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { TooltipTrigger, TooltipContent, Tooltip } from '../ui/tooltip';
import { TaskStatusSelector } from './status/task-status-selector';
import { TaskAssigneeSelector } from './assignee/task-assignee-selector';
import { TaskTitleField } from './title/task-title-field';
import { TaskDescriptionField } from './description/task-description-field';
import { formatShortcut } from '@/components/shortcuts/format-shortcut';
import { TaskPrioritySelector } from '../priority/task-priority-selector';

export type TaskDetailsProps = {
  task: TaskObject;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  const { registerCommand } = useCommands();
  const dispatch = useAppDispatch();

  const hasNextTask = useAppSelector(selectHasNextTask);
  const hasPreviousTask = useAppSelector(selectHasPreviousTask);
  const taskSelectNextCommandObj = taskSelectNextCommand();
  const taskSelectPreviousCommandObj = taskSelectPreviousCommand();
  const taskDeleteCommandObj = taskDeleteCommand(task.id);
  const taskUnselectCommandObj = taskUnselectCommand();

  function handleStatusChange(newStatus: TaskStatus) {
    if (newStatus !== task.status) {
      dispatch(
        updateTask({ id: task.id, updates: { status: newStatus } }),
      );
    }
  }

  useEffect(() => {
    const unregisterTaskDelete = registerCommand(taskDeleteCommand(task.id));

    return () => {
      unregisterTaskDelete();
    };
  }, [registerCommand, task.id]);

  function handleAssigneeChange(assigneeId: string) {
    if (assigneeId !== task.assignee?.id) {
      dispatch(
        assignTask({
          id: task.id,
          assigneeId,
        }),
      );
    }
  }

  return (
    <div className={cn('divide-y divide-input')}>
      <div
        className={cn('flex items-center gap-2 justify-between', 'py-2 px-3')}>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              taskSelectNextCommandObj.action();
            }}
            disabled={!hasNextTask}
            aria-label={taskSelectNextCommandObj.name}
            className="gap-2"
            title={taskSelectNextCommandObj.shortcut}>
            <TaskSelectNextCommandIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              taskSelectPreviousCommandObj.action();
            }}
            disabled={!hasPreviousTask}
            aria-label={taskSelectPreviousCommandObj.name}
            className="gap-2"
            title={taskSelectPreviousCommandObj.shortcut}>
            <TaskSelectPreviousCommandIcon className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-0.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                taskDeleteCommandObj.action();
              }}
              aria-label={taskDeleteCommandObj.name}
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
              variant="ghost"
              size="icon"
              onClick={() => {
                taskUnselectCommandObj.action();
              }}
              aria-label={taskUnselectCommandObj.name}
              className="gap-2">
              <RiContractRightLine className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{taskUnselectCommandObj.name}</span>
            {taskUnselectCommandObj.shortcut && (
              <kbd className="ml-2 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {formatShortcut(taskUnselectCommandObj.shortcut)}
              </kbd>
            )}
          </TooltipContent>
        </Tooltip>
        </div>
      </div>

      <div className={cn(' flex flex-col gap-2  px-3 py-3')}>
        <TaskTitleField
          key={task.id}
          value={task.title}
          onChange={(value) =>
            dispatch(updateTask({ id: task.id, updates: { title: value } }))
          }
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 -ml-2">
          <TaskStatusSelector
            value={task.status}
            onChange={handleStatusChange}
          />
          <TaskPrioritySelector
            value={task.priority}
            onChange={(p) => {
              if (p !== task.priority) {
                dispatch(updateTask({ id: task.id, updates: { priority: p } }));
              }
            }}
          />
          <TaskAssigneeSelector
            value={task.assignee?.id ?? undefined}
            onChange={handleAssigneeChange}
          />
        </div>
        <TaskDescriptionField
          value={task.description || ''}
          onChange={(newDescription) => {
            if (newDescription !== task.description) {
              dispatch(
                updateTask({
                  id: task.id,
                  updates: { description: newDescription },
                }),
              );
            }
          }}
        />
      </div>
    </div>
  );
}