import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiProgress4Line,
  RiProgress6Line,
  RiTimeLine,
} from 'react-icons/ri';
import { TaskStatus } from '@/components/tasks/types';

export const taskStatusRecord: Record<
  TaskStatus,
  Readonly<{
    icon: React.ElementType;
    className: string;
    label: string;
  }>
> = {
  todo: {
    icon: RiCheckboxBlankCircleLine,
    className: 'text-gray-400',
    label: 'Todo',
  },
  'in-progress': {
    icon: RiProgress4Line,
    className: 'text-yellow-500',
    label: 'In Progress',
  },
  done: {
    icon: RiCheckboxCircleFill,
    className: 'text-indigo-600',
    label: 'Done',
  },
  'in-review': {
    icon: RiProgress6Line,
    className: 'text-blue-500',
    label: 'In Review',
  },
  cancelled: {
    icon: RiCloseCircleFill,
    className: 'text-gray-400',
    label: 'Cancelled',
  },
};

export const taskStatusList = [
  'todo',
  'in-progress',
  'in-review',
  'done',
  'cancelled',
] as const;