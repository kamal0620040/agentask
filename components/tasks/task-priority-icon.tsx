import { cn } from '@/lib/utils';
import { Todo } from '@/types/todo';
import { RiAlarmWarningLine, RiArrowLeftBoxLine, RiArrowRightBoxLine, RiFireLine } from 'react-icons/ri';

interface TaskPriorityIconProps {
  priority: Todo['priority'];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
};

export function TaskPriorityIcon({
  priority,
  size = 'sm',
  className,
}: TaskPriorityIconProps) {
  const iconSize = sizeClasses[size];

  switch (priority) {
    case 'urgent':
      return <RiFireLine className={cn(iconSize, 'text-red-500', className)} />;
    case 'high':
      return (
        <RiAlarmWarningLine className={cn(iconSize, 'text-orange-500', className)} />
      );
    case 'medium':
      return (
        <RiArrowLeftBoxLine className={cn(iconSize, 'text-yellow-500', className)} />
      );
    case 'low':
      return (
        <RiArrowRightBoxLine
          className={cn(iconSize, 'text-gray-400 rotate-90', className)}
        />
      );
    default:
      return null;
  }
}