'use client';
import {
  selectAllTasks,
  selectTaskCountsByStatus,
  selectSelectedTask,
} from '@/store/features/tasks/tasks-selector';
import {
  deleteTask,
  toggleTaskStatus,
  updateTaskStatus,
} from '@/store/features/tasks/tasks-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  Plus,
  Circle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { TaskItem } from './task-item';
import { Todo } from '@/types/todo';
import { TaskToolbar } from './task-toolbar';
import { useCommandsRegistry } from '../commands/commands-context';
import { useEffect } from 'react';
import { taskSelectNextCommand, taskSelectPreviousCommand } from './task-commands';
import {
  Panel,
   Group,
 Separator,
} from 'react-resizable-panels';
import { TaskDetails } from './task-details';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';

export function TaskList() {
  const {registerCommand} = useCommandsRegistry();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  console.log("task", tasks)
  const taskCounts = useAppSelector(selectTaskCountsByStatus);
  const selectedTask = useAppSelector(selectSelectedTask);


  useEffect(() => {
    const taskSelectNextCommandItem = taskSelectNextCommand();
    const taskSelectPreviousCommandItem = taskSelectPreviousCommand();

    const unregisterTaskSelectNext = registerCommand(taskSelectNextCommandItem);
    const unregisterTaskSelectPrevious = registerCommand(taskSelectPreviousCommandItem);

    return () => {
      unregisterTaskSelectNext();
      unregisterTaskSelectPrevious();
    };
  }, [registerCommand]);

  
  function handleStatusChange(id: string) {
    dispatch(toggleTaskStatus(id));
  }

  function handleStatusUpdate(id: string, status: Todo['status']) {
    dispatch(updateTaskStatus({ id, status }));
  }

  function handleDeleteTask(id: string) {
    dispatch(deleteTask(id));
  }

  return (
    <div
      className={cn(
        'flex flex-col',
        'border border-input',
        'rounded-sm',
        'divide-y divide-input',
        'h-full bg-background',
      )}>
      <div
        className={cn('flex items-center justify-between w-full', 'py-2 px-2')}>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm">
            <Plus className="size-4" />
            New issue
          </Button>
          {selectedTask && <TaskToolbar selectedTask={selectedTask} />}
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground shrink-0">
          <div className="flex items-center gap-2">
            <Circle className="size-4" />
            <span className='text-xs'>{taskCounts.todo} Todo</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-blue-600" />
            <span className='text-xs'>{taskCounts.inProgress} In progress</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-green-600" />
            <span className='text-xs'>{taskCounts.done} Done</span>
          </div>
        </div>
      </div>
      <div className="h-0 grow">
        <Group orientation="horizontal">
          <Panel minSize={'50%'} defaultSize={selectedTask ? '70%' : '100%'}>
            <ScrollArea className="h-full">

            <div className="p-1 size-full space-y-1 overflow-y-auto">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDeleteTask}
                  isSelected={selectedTask?.id === task.id}
                />
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Circle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No issues yet</p>
                  <p className="text-sm">
                    Create your first issue to get started
                  </p>
                </div>
              )}
            </div>
            </ScrollArea>
          </Panel>
          {selectedTask && (
            <>
              <Separator className="w-px bg-border cursor-col-resize" />
              <Panel minSize={'20%'}>
                <TaskDetails task={selectedTask} />
              </Panel>
            </>
          )}
        </Group>
    </div>
    </div>
  );
}
