'use client';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  taskRedoCommandCreator,
  taskUndoCommandCreator,
  TaskRedoCommandIcon,
  TaskUndoCommandIcon,
} from './task-commands';
import {
  selectTasksCanRedo,
  selectTasksCanUndo,
} from '@/store/features/tasks/tasks-selector';
import {
  toggleAiChatSidebar,
} from '@/store/features/display/display-slice';
import { selectAiChatSidebarVisible } from '@/store/features/display/display-selectors';
import { RiArrowRightDoubleLine, RiSparkling2Fill } from 'react-icons/ri';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { formatShortcut } from '@/components/shortcuts/format-shortcut';
import TaskCreateDialog from './create/task-create-dialog';
import { TaskDisplayDropdown } from './display/task-display-dropdown';
import { useCommands } from '../commands/commands-context';
import { useEffect, useMemo } from 'react';

export function TaskToolbar() {
  const { registerCommand } = useCommands();
  const dispatch = useAppDispatch();
  const tasksCanUndo = useAppSelector(selectTasksCanUndo);
  const tasksCanRedo = useAppSelector(selectTasksCanRedo);
  const aiChatSidebarVisible = useAppSelector(selectAiChatSidebarVisible);

  const taskUndoCommandObj = useMemo(() => taskUndoCommandCreator(), []);
  const taskRedoCommandObj = useMemo(() => taskRedoCommandCreator(), []);

  useEffect(() => {
    const unregisterUndo = registerCommand(taskUndoCommandObj);
    const unregisterRedo = registerCommand(taskRedoCommandObj);

    return () => {
      unregisterUndo();
      unregisterRedo();
    };
  }, [registerCommand, taskUndoCommandObj, taskRedoCommandObj]);

  return (
    <div className="flex justify-between items-center gap-2 w-full">
      <div className="flex items-center gap-x-0.5">
        <TaskCreateDialog />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                taskUndoCommandObj.action();
              }}
              disabled={!tasksCanUndo}
              aria-label={taskUndoCommandObj.name}
              className="gap-2">
              <TaskUndoCommandIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{taskUndoCommandObj.name}</span>
            {taskUndoCommandObj.shortcut && (
              <kbd className="ml-2 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {formatShortcut(taskUndoCommandObj.shortcut)}
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
                taskRedoCommandObj.action();
              }}
              disabled={!tasksCanRedo}
              aria-label={taskRedoCommandObj.name}
              className="gap-2">
              <TaskRedoCommandIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>{taskRedoCommandObj.name}</span>
            {taskRedoCommandObj.shortcut && (
              <kbd className="ml-2 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                {formatShortcut(taskRedoCommandObj.shortcut)}
              </kbd>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex items-center gap-x-0.5">
        <TaskDisplayDropdown />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Toggle AI Chat"
              className="gap-1.5"
              onClick={() => {
                dispatch(toggleAiChatSidebar());
              }}>
              {aiChatSidebarVisible ? (
                <RiArrowRightDoubleLine className="size-4" />
              ) : (
                <>
                  <RiSparkling2Fill className="size-4" />
                  <span>Chat</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Toggle AI Chat</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}