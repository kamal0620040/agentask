import { TaskStatus, type TaskObject } from '@/types/task';
import { useCommands } from '../commands/commands-context';
import { useAppDispatch } from '@/store/hooks';
import {
  taskDeleteCommand,
  TaskDeleteCommandIcon,
  taskUnselectCommand,
} from './task-commands';
import { useEffect } from 'react';
import {
  assignTask,
  updateTask,
  updateTaskPriority,
  updateTaskStatus,
} from '@/store/features/tasks/tasks-slice';
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
        className={cn('flex items-center gap-2 justify-between', 'py-2 px-2')}>
        <div className="flex items-center gap-2">
          <TaskStatusSelector
            value={task.status}
            onChange={handleStatusChange}
          />
          <TaskPrioritySelector
            value={task.priority}
            onChange={(p) => {
              if (p !== task.priority) {
                dispatch(updateTaskPriority({ id: task.id, priority: p }));
              }
            }}
          />
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                taskDeleteCommandObj.action();
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
        <TaskTitleField
          key={task.id}
          value={task.title}
          onChange={(value) =>
            dispatch(updateTask({ id: task.id, updates: { title: value } }))
          }
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Assignee:</span>
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
