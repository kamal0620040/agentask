'use client';
import { cn } from '@/lib/utils';
import { TaskObject, TaskStatus } from '@/types/task';
import { Badge } from '../ui/badge';
import {
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenu,
} from '../ui/context-menu';
import { useAppDispatch } from '@/store/hooks';
import React, { useEffect, useState } from 'react';
import { setSelectedTask } from '@/store/features/tasks/tasks-slice';
import { TaskStatusIcon } from './status/task-status-icon';
import { TaskDeleteCommandIcon } from './task-commands';
import Image from 'next/image';
import { RiProgress4Line, RiUser2Fill } from 'react-icons/ri';
import { TaskStatusCombobox } from './status/task-status-combobox';
import { TaskAssigneeCombobox } from './assignee/task-assignee-combobox';

interface TaskItemProps {
  task: TaskObject;
  onAssigneeChange: (assigneeId: string) => void;
  onStatusChange: (status: TaskStatus) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
}

export function TaskItem({
  task,
  onStatusChange,
  onAssigneeChange,
  onDelete,
  isSelected = false,
}: TaskItemProps) {
  const dispatch = useAppDispatch();
    const rootRef = React.useRef<HTMLDivElement>(null);

  const [statusSubOpen, setStatusSubOpen] = useState(false);
  const [assigneeSubOpen, setAssigneeSubOpen] = useState(false);
  
    
  useEffect(() => {
    if (isSelected && rootRef.current) {
      rootRef.current.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [isSelected]);


  function handleDelete() {
    onDelete(task.id);
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div ref={rootRef}>
          <div
            className={cn(
              'group flex items-center gap-3 px-3 py-2 rounded transition-colors',
              isSelected ? 'bg-indigo-300/25' : 'hover:bg-accent/50',
            )}
            onClick={() => {
              dispatch(setSelectedTask(task.id));
            }}>
            <button
              className="shrink-0 hover:scale-110 transition-transform">
              <TaskStatusIcon status={task.status} size='lg' />
            </button>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground font-mono font-medium w-14">
                {task.id}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  'text-sm',
                  task.status === 'done' &&
                    'line-through text-muted-foreground',
                )}>
                {task.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {task.labels?.slice(0, 2).map((label) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="text-xs px-1.5 py-0">
                  {label}
                </Badge>
              ))}
              {task.labels && task.labels.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  +{task.labels.length - 2}
                </Badge>
              )}
            </div>
            {task.assignee && (
              <Image
                src={task.assignee?.avatar || '/default-avatar.png'}
                alt={task.assignee?.name}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuSub open={statusSubOpen} onOpenChange={setStatusSubOpen}>
          <ContextMenuSubTrigger>
            <RiProgress4Line className="size-4 text-muted-foreground" />
            <span className="ml-2">Status</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="p-0 w-48">
              <TaskStatusCombobox onSelect={(status) => {
                onStatusChange(status);
                setStatusSubOpen(false);
              }}
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub
          open={assigneeSubOpen}
          onOpenChange={setAssigneeSubOpen}>
          <ContextMenuSubTrigger>
            <RiUser2Fill className="size-4 text-muted-foreground" />
            <span className="ml-2">Assignee</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="p-0 w-48">
            <TaskAssigneeCombobox
              onSelect={(assigneeId) => {
                onAssigneeChange(assigneeId);
                setAssigneeSubOpen(false);
              }}
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDelete}>
          <TaskDeleteCommandIcon className="size-4 text-muted-foreground"  />
          <span className="ml-2">Delete...</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
