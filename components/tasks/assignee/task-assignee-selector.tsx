import { useEffect, useMemo, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useCommands } from '@/components/commands/commands-context';
import { taskAssigneeOpenCommand } from '../task-commands';
import { TaskAssigneeCombobox } from './task-assignee-combobox';
import { assignees } from '@/data/mock-assignee';

import { RiArrowDownSLine } from 'react-icons/ri';
import Image from 'next/image';

export type TaskAssigneeSelectorProps = {
  value?: string | null;
  onChange: (assigneeId: string) => void;
};

export function TaskAssigneeSelector({
  value,
  onChange,
}: TaskAssigneeSelectorProps) {
  const [open, setOpen] = useState(false);
  const { registerCommand } = useCommands();

  const openCommand = useMemo(
    () =>
      taskAssigneeOpenCommand(() => {
        setOpen(true);
      }),
    [],
  );

  useEffect(() => {
    const unregisterAssignee = registerCommand(openCommand);

    return () => {
      unregisterAssignee();
    };
  }, [registerCommand, openCommand]);

  const assignee = assignees.find((a) => a.id === value) || null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          aria-label={openCommand.name}
          title={openCommand.shortcut}>
          {assignee ? (
            <Image
              src={assignee.avatar || '/default-avatar.png'}
              alt={assignee.name}
              height={20}
              width={20}
              className="size-5 rounded-full"
            />
          ) : (
            <span className="size-5 rounded-full bg-muted" />
          )}
          <span className="text-xs font-medium">
            {assignee ? assignee.name : 'Unassigned'}
          </span>
          <RiArrowDownSLine className="w-3 h-3 ml-1 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-56">
        <TaskAssigneeCombobox
          onSelect={(assigneeId) => {
            onChange(assigneeId);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}