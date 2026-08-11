import { TaskStatus } from '@/types/task';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

import { RiArrowDownSLine } from 'react-icons/ri';
import { TaskStatusIcon } from './task-status-icon';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { TaskStatusCombobox } from './task-status-combobox';
import { taskStatusRecord } from './task-status-list';
import { taskStatusOpenCommand } from '../task-commands';
import { useCommands } from '@/components/commands/commands-context';

export type TaskStatusSelectorProps = {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  className?: string;
};

export function TaskStatusSelector({
  value,
  onChange,
  className,
}: TaskStatusSelectorProps) {
  const [open, setOpen] = useState(false);
  const { registerCommand } = useCommands();

  const openCommand = useMemo(
    () =>
      taskStatusOpenCommand(() => {
        setOpen(true);
      }),
    [],
  );

  useEffect(() => {
    const unregisterStatus = registerCommand(openCommand);

    return () => {
      unregisterStatus();
    };
  }, [registerCommand, openCommand]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('flex items-center gap-1', className)}
          aria-label={openCommand.name}
          title={openCommand.shortcut}>
          <TaskStatusIcon status={value} />
          <span className="text-xs font-medium">
            {taskStatusRecord[value].label}
          </span>
          <RiArrowDownSLine className="w-3 h-3 ml-1 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-48">
        <TaskStatusCombobox
          onSelect={(status) => {
            onChange(status);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}