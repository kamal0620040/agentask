import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { TaskTitleField } from '../title/task-title-field';
import { TaskDescriptionField } from '../description/task-description-field';
import { TaskAssigneeSelector } from '../assignee/task-assignee-selector';
import { TaskStatusSelector } from '../status/task-status-selector';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAllTasks } from '@/store/features/tasks/tasks-selector';
import { TaskRaw, TaskStatus, TaskPriority } from '@/types/task';
import { formatShortcut } from '@/components/shortcuts/format-shortcut';
import { addTask, setSelectedTask } from '@/store/features/tasks/tasks-slice';
import { TaskPrioritySelector } from '../../priority/task-priority-selector';
import { taskCreateDialogOpenCommand } from '../task-commands';
import { useCommands } from '@/components/commands/commands-context';

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

// TODO: Should be globally unique and not depend on existing tasks
// because undo/redo affects task IDs. Maybe shift it into Redux store
function getNextTaskId(existingIds: string[]): string {
  let maxNum = 0;
  for (const id of existingIds) {
    const match = id.match(/^(.*?-)(\d+)$/);
    if (match) {
      const num = parseInt(match[2], 10);
      if (!Number.isNaN(num)) {
        maxNum = Math.max(maxNum, num);
      }
    }
  }
  return `MUL-${maxNum + 1}`;
}

const TaskCreateDialog = () => {
    const { registerCommand } = useCommands();
    const dispatch = useAppDispatch();
    const tasks = useAppSelector(selectAllTasks);
    const [open, setOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('todo');
    const [priority, setPriority] = useState<TaskPriority>(0);
    const [assigneeId, setAssigneeId] = useState<string | null>(null);

    const nextId = useMemo(() => {
        return getNextTaskId(tasks.map((task) => task.id));
    }, [tasks]);

    const openCommand = useMemo(
      () =>
        taskCreateDialogOpenCommand(() => {
          setOpen(true);
        }),
      [],
    );

    useEffect(() => {
      const unregisterDialogOpen = registerCommand(openCommand);

      return () => {
        unregisterDialogOpen();
      };
    }, [registerCommand, openCommand]);

    function resetForm() {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setAssigneeId(null);
      setPriority(0);
    }

    function handleCreate() {
      const createdAt = getTodayDateString();
      const newTask: TaskRaw = {
        id: nextId,
        title: title.trim() || 'Untitled',
        description: description,
        status,
        priority,
        assigneeId: assigneeId ?? undefined,
        labels: [],
        createdAt,
        updatedAt: createdAt,
      };
      dispatch(addTask(newTask));
      dispatch(setSelectedTask(newTask.id));
      setOpen(false);
      resetForm();
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label={openCommand.name}>
              <openCommand.icon />
              New Issue
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{openCommand.name}</span>
            {openCommand.shortcut && (
              <kbd className="ml-2 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {formatShortcut(openCommand.shortcut)}
              </kbd>
            )}
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <TaskTitleField value={title} onChange={(val) => setTitle(val)} />
          <TaskDescriptionField
            value={description}
            onChange={(val) => setDescription(val)}
            id="new-task-description"
            placeholder="Add a description..."
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground -ml-2">
          <TaskStatusSelector value={status} onChange={(val) => setStatus(val)} />
          <TaskPrioritySelector value={priority} onChange={(p) => setPriority(p)} />
          <TaskAssigneeSelector value={assigneeId} onChange={(val) => setAssigneeId(val)} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleCreate} disabled={false}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreateDialog;