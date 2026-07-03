import { CommandCreator } from '@/actions/types';
import {
  clearSelectedTask,
  deleteTask,
  selectNextTask,
  selectPreviousTask,
} from '@/store/features/tasks/tasks-slice';
import { store } from '@/store/store';
import { RiArrowDownSLine, RiArrowUpSLine, RiDeleteBinLine, RiForbidLine } from 'react-icons/ri';

export const TaskDeleteCommandIcon = RiDeleteBinLine;
export const taskDeleteCommand:CommandCreator = (id: string) => ({
  id: 'task.delete',
  name: 'Delete task',
  icon: TaskDeleteCommandIcon,
  shortcut: 'd',
  group: 'tasks',
  description: 'Delete the selected task',
  action: () => store.dispatch(deleteTask(id)),
});

export const TaskUnselectCommandIcon = RiForbidLine;
export const taskUnselectCommand: CommandCreator = () => ({
  id: 'task.unselect',
  name: 'Unselect task',
  icon: TaskUnselectCommandIcon,
  shortcut: 'escape',
  group: 'tasks',
  description: 'Unselect the selected task',
  action: () => store.dispatch(clearSelectedTask()),
});

export const TaskSelectNextCommandIcon = RiArrowDownSLine;
export const taskSelectNextCommand: CommandCreator = () => ({
  id: 'task.select.next',
  name: 'Select next task',
  icon: TaskSelectNextCommandIcon,
  shortcut: 'ArrowDown',
  group: 'tasks',
  description: 'Navigate to the next task',
  action: () => store.dispatch(selectNextTask()),
});

export const TaskSelectPreviousCommandIcon = RiArrowUpSLine;
export const taskSelectPreviousCommand: CommandCreator = () => ({
  id: 'task.select.prev',
  name: 'Select previous task',
  icon: TaskSelectPreviousCommandIcon,
  shortcut: 'ArrowUp',
  group: 'tasks',
  description: 'Navigate to the previous task',
  action: () => store.dispatch(selectPreviousTask()),
});