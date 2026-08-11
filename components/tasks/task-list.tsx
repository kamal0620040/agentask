'use client';
import {
  selectAllTasks,
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
import { RiCheckboxBlankCircleLine } from 'react-icons/ri';
import { useEffect } from 'react';
import {
  taskSelectNextCommand,
  taskSelectPreviousCommand,
  taskUnselectCommand,
} from './task-commands';
import { useCommands } from '../commands/commands-context';
import { TaskStatusSummary } from './status/task-status-summary';

export function TaskList() {
  const { registerCommand } = useCommands();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllTasks);
  const selectedTask = useAppSelector(selectSelectedTask);

  useEffect(() => {
    const unregisterNext = registerCommand(taskSelectNextCommand());
    const unregisterPrevious = registerCommand(taskSelectPreviousCommand());
    const unregisterTaskUnselect = registerCommand(taskUnselectCommand());

    return () => {
      unregisterNext();
      unregisterPrevious();
      unregisterTaskUnselect();
    };
  }, [registerCommand]);

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
      <div className={cn('flex items-center w-full', 'py-2 px-2')}>
        <TaskToolbar />
      </div>
      <div className="h-0 grow">
        <Group orientation="horizontal">
          <Panel minSize={'50%'} defaultSize={selectedTask ? '70%' : '100%'}>
            <div
              className={cn(
                'flex flex-col size-full',
                'divide-y divide-input',
              )}>
              <ScrollArea className="h-0 grow">
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
              <TaskStatusSummary />
            </div>
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
