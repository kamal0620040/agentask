'use client';
import {
  selectAllTasks,
  selectSelectedTask,
  selectSelectedTaskId,
} from '@/store/features/tasks/tasks-selector';
import {
  assignTask,
  deleteTask,
  updateTask,
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
import { useEffect } from 'react';
import {
  taskSelectNextCommand,
  taskSelectPreviousCommand,
  taskUnselectCommand,
} from './task-commands';
import { useCommands } from '../commands/commands-context';
import { TaskStatusSummary } from './status/task-status-summary';
import type { TaskObject } from '@/types/task';
import { TaskEmptyState } from './task-empty-state';

export function TaskList() {
  const { registerCommand } = useCommands();
  const dispatch = useAppDispatch();
  const tasks: TaskObject[] = useAppSelector(selectAllTasks);

  const selectedTask: TaskObject | null = useAppSelector(selectSelectedTask);
  const selectedTaskId = useAppSelector(selectSelectedTaskId);
  const hasSelection = !!selectedTaskId;

  function handleDeleteTask(id: string) {
    dispatch(deleteTask(id));
  }

  function renderListSection() {
    return (
      <div className={cn('flex flex-col size-full', 'divide-y divide-input')}>
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
                  dispatch(updateTask({ id: task.id, updates: { status } }));
                }}
                onPriorityChange={(priority) => {
                  dispatch(updateTask({ id: task.id, updates: { priority } }));
                }}
                onDelete={handleDeleteTask}
                isSelected={selectedTaskId === task.id}
              />
            ))}
            {tasks.length === 0 && <TaskEmptyState />}
          </div>
        </ScrollArea>
        <TaskStatusSummary />
      </div>
    );
  }

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

  return (
    <div
      className={cn(
        'flex flex-col',
        'border border-input',
        'rounded-sm',
        'divide-y divide-input',
        'h-full bg-background',
      )}>
      <div className={cn('flex items-center w-full', 'py-2 pr-2 pl-3')}>
        <TaskToolbar />
      </div>
      <div className="h-0 grow">
        <div className="hidden md:block h-full">
          <Group orientation="horizontal">
            <Panel minSize={'50%'} defaultSize={hasSelection ? '70%' : '100%'}>
              {renderListSection()}
            </Panel>
            {selectedTask && (
              <>
                <Separator className="w-px bg-border cursor-col-resize" />
                <Panel minSize={'20%'}>
                  <TaskDetails key={selectedTask.id} task={selectedTask} />
                </Panel>
              </>
            )}
          </Group>
        </div>
        <div className="md:hidden h-full">
          {selectedTask ? (
            <TaskDetails key={selectedTask.id} task={selectedTask} />
          ) : (
            renderListSection()
          )}
        </div>
      </div>
    </div>
  );
}
