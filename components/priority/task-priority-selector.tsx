import { useEffect, useMemo, useState } from 'react';
import type { TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TaskPriorityIcon } from './task-priority-icon';
import { TaskPriorityCombobox } from './task-priority-combobox';
import { taskPriorityRecord } from './task-priority-list';
import { taskPriorityOpenCommand } from '@/components/tasks/task-commands';
import { useCommands } from '@/components/commands/commands-context';

export function TaskPrioritySelector({
  value,
  onChange,
  className,
}: {
  value: TaskPriority;
  onChange: (p: TaskPriority) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { registerCommand } = useCommands();

  const openCommand = useMemo(
    () =>
      taskPriorityOpenCommand(() => {
        setOpen(true);
      }),
    [],
  );

  useEffect(() => {
    const unregisterPriority = registerCommand(openCommand);

    return () => {
      unregisterPriority();
    };
  }, [registerCommand, openCommand]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('flex items-center gap-1', className)}
          aria-label={openCommand.name}
          title={openCommand.shortcut}>
          <TaskPriorityIcon priority={value} />
          <span className="text-xs font-medium">
            {taskPriorityRecord[value].label}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-48">
        <TaskPriorityCombobox
          onSelect={(priority) => {
            onChange(priority);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}