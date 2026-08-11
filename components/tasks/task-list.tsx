'use client';
import {
  selectAllTasks,
  selectTaskCountsByStatus,
  selectSelectedTask,
} from '@/store/features/tasks/tasks-selector';
import {
  assignTask,
  deleteTask,
  updateTaskPriority,
  updateTaskStatus,
} from '@/store/features/tasks/tasks-slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { TaskItem } from './task-item';
import { TaskToolbar } from './task-toolbar';
import {
  Panel,
   Group,
  Separator,
} from 'react-resizable-panels';
import { TaskDetails } from './task-details';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { TaskStatusIcon } from './status/task-status-icon';
import { RiCheckboxBlankCircleLine } from 'react-icons/ri';
import { taskStatusRecord } from './status/task-status-list';

export function TaskList() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const taskCounts = useAppSelector(selectTaskCountsByStatus);
  const selectedTask = useAppSelector(selectSelectedTask);

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
        <TaskToolbar />
        <div className="flex items-center gap-3 md:gap-6 text-sm text-muted-foreground shrink-0 px-1">
          <div className="flex items-center gap-2">
            <TaskStatusIcon status='todo' size='lg' />
            <span className='text-xs'>
              {taskCounts.todo}
              <span className="max-md:hidden"> {taskStatusRecord.todo.label}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TaskStatusIcon status='in-progress' size='lg' />
            <span className='text-xs'>
              {taskCounts.inProgress}
              <span className="max-md:hidden"> {taskStatusRecord['in-progress'].label}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TaskStatusIcon status="in-review" size="lg" />
            <span className="text-xs">
              {taskCounts.inReview}
              <span className="max-md:hidden"> {taskStatusRecord['in-review'].label}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TaskStatusIcon status='done' size='lg' />
            <span className='text-xs'>
              {taskCounts.done}
              <span className="max-md:hidden"> {taskStatusRecord.done.label}</span>
            </span>
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
                  onAssigneeChange={(assigneeId) => {
                    dispatch(assignTask({ id: task.id, assigneeId }));
                  }}
                  onStatusChange={(status) => {
                    dispatch(updateTaskStatus({ id: task.id, status }));
                  }}
                  onPriorityChange={(priority) => {
                    dispatch(updateTaskPriority({ id: task.id, priority: priority}))
                  }}
                  onDelete={handleDeleteTask}
                  isSelected={selectedTask?.id === task.id}
                />
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <RiCheckboxBlankCircleLine className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
