import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { TaskTitleField } from './title/task-title-field';
import { TaskDescriptionField } from './description/task-description-field';
import { TaskAssigneeSelector } from './assignee/task-assignee-selector';
import { TaskStatusSelector } from './status/task-status-selector';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAllTasks } from '@/store/features/tasks/tasks-selector';
import { TaskAssignee, TaskRaw, TaskStatus, TaskPriority } from '@/types/task';
import { RiAddLine } from 'react-icons/ri';
import { addTask, setSelectedTask } from '@/store/features/tasks/tasks-slice';
import { TaskPrioritySelector } from '../priority/task-priority-selector';

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

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

const NewTaskDialog = () => {
    const dispatch = useAppDispatch();
    const tasks = useAppSelector(selectAllTasks);
    const [open, setOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<TaskStatus>('todo');
    const [priority, setPriority] = useState<TaskPriority>(0);
    const [assignee, setAssignee] = useState<TaskAssignee | null>(null);

    const nextId = useMemo(() => {
        return getNextTaskId(tasks.map((task) => task.id));
    }, [tasks]);

    function resetForm() {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setAssignee(null);
      setPriority(0);
    }
    
    function handleOpenChange(val: boolean) {
        setOpen(val);
        
        if(!val) {
          resetForm()
        }
    }

    function handleCreate() {
      const createdAt = getTodayDateString();
      const newTask: TaskRaw = {
        id: nextId,
        title: title.trim() || 'Untitled',
        description: description,
        status,
        priority,
        assigneeId: assignee?.id,
        labels: [],
        createdAt,
        updatedAt: createdAt,
      };
      dispatch(addTask(newTask));
      dispatch(setSelectedTask(newTask.id));
      handleOpenChange(false);
    }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
            <RiAddLine />
            New Issue
        </Button>
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TaskAssigneeSelector value={assignee} onChange={(val) => setAssignee(val)} />
          <TaskStatusSelector value={status} onChange={(val) => setStatus(val)} />
          <TaskPrioritySelector value={priority} onChange={(p) => setPriority(p)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
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

export default NewTaskDialog;
