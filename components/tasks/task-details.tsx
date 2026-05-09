import { TaskStatus, type TaskObject, TaskAssignee } from '@/types/task';
import { useCommandsRegistry } from '../commands/commands-context';
import { useAppDispatch } from '@/store/hooks';
import {
  taskDeleteCommand,
  TaskDeleteCommandIcon,
  taskUnselectCommand,
} from './task-commands';
import { useEffect, useState } from 'react';
import {
  assignTask,
  updateTask,
  updateTaskStatus,
} from '@/store/features/tasks/tasks-slice';
import { Button } from '../ui/button';
import { cn, formatShortcut } from '@/lib/utils';
import { TooltipTrigger, TooltipContent, Tooltip } from '../ui/tooltip';
import { TaskStatusSelector } from './status/task-status-selector';
import { TaskAssigneeSelector } from './assignee/task-assignee-selector';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { TaskTitleField } from './title/task-title-field';

export type TaskDetailsProps = {
  task: TaskObject;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  const { registerCommand } = useCommandsRegistry();
  const dispatch = useAppDispatch();

  const taskDeleteCommandObj = taskDeleteCommand(task.id);

  const [description, setDescription] = useState<string>(
    task.description || '',
  );

  function handleStatusChange(newStatus: TaskStatus) {
    if (newStatus !== task.status) {
      dispatch(updateTaskStatus({ id: task.id, status: newStatus }));
    }
  }

  function handleDescriptionBlur() {
    if (description !== task.description) {
      dispatch(updateTask({ id: task.id, updates: { description } }));
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

  function handleAssigneeChange(newAssignee: TaskAssignee) {
    if (newAssignee?.id !== task.assignee?.id) {
      dispatch(
        assignTask({
          id: task.id,
          assigneeId: newAssignee.id,
        }),
      );
    }
  }

  return (
    <div className={cn('divide-y divide-input')}>
      <div
        className={cn('flex items-center gap-2 justify-between', 'py-2 px-2')}>
        <TaskStatusSelector value={task.status} onChange={handleStatusChange} />
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
        <TaskTitleField
          key={task.id}
          value={task.title}
          onChange={(value) =>
            dispatch(updateTask({ id: task.id, updates: { title: value } }))
          }
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>Assignee:</span>
          {task.assignee ? (
            <TaskAssigneeSelector
              value={task.assignee ?? undefined}
              onChange={handleAssigneeChange}
            />
          ) : (
            <span className="font-medium">Unassigned</span>
          )}
        </div>
        <div className="grid w-full gap-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Add a description..."
          />
        </div>
      </div>
    </div>
  );
}
