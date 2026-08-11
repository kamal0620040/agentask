import { ActionCreators as UndoActionCreators } from 'redux-undo';
import type { CommandCreator, CommandData } from '@/components/commands/types';
import {
  clearSelectedTask,
  deleteTask,
  selectNextTask,
  selectPreviousTask,
} from '@/store/features/tasks/tasks-slice';
import { store } from '@/store/store';
import { MdAssignmentInd, MdSignalCellular4Bar } from 'react-icons/md';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
  RiDeleteBin7Line,
  RiEqualizerFill,
  RiForbidLine,
  RiProgress4Line,
  RiStickyNoteAddLine,
} from 'react-icons/ri';

// Undo
export const TaskUndoCommandIcon = RiArrowGoBackLine;
export const taskUndoCommandData: CommandData = {
  id: 'task.undo',
  name: 'Undo last change',
  icon: TaskUndoCommandIcon,
  shortcut: 'Cmd+Z',
  group: 'tasks',
  description: 'Undo the last change',
};
export const taskUndoCommandCreator: CommandCreator = () => ({
  ...taskUndoCommandData,
  action: () => store.dispatch(UndoActionCreators.undo()),
  commandPalette: true,
});

// Redo
export const TaskRedoCommandIcon = RiArrowGoForwardLine;
export const taskRedoCommandData: CommandData = {
  id: 'task.redo',
  name: 'Redo change',
  icon: TaskRedoCommandIcon,
  shortcut: 'Cmd+Shift+Z',
  group: 'tasks',
  description: 'Redo the last undone change',
};
export const taskRedoCommandCreator: CommandCreator = () => ({
  ...taskRedoCommandData,
  action: () => store.dispatch(UndoActionCreators.redo()),
  commandPalette: true,
});

// Create task dialog
export const TaskCreateDialogOpenCommandIcon = RiStickyNoteAddLine;
export const taskCreateDialogOpenCommandData: CommandData = {
  id: 'task.create.open',
  name: 'Create new task',
  icon: TaskCreateDialogOpenCommandIcon,
  shortcut: 'C',
  group: 'tasks',
  description: 'Create a new task',
};
export const taskCreateDialogOpenCommandCreator: CommandCreator = (
  func: () => void,
) => ({
  ...taskCreateDialogOpenCommandData,
  action: () => func(),
  commandPalette: true,
});

// Display options
export const TaskDisplayPropertiesCommandIcon = RiEqualizerFill;
export const taskDisplayPropertiesCommandData: CommandData = {
  id: 'task.display_properties',
  name: 'Show display options',
  icon: TaskDisplayPropertiesCommandIcon,
  shortcut: 'Shift+V',
  group: 'tasks',
  description: 'Show display options',
};
export const taskDisplayPropertiesCommandCreator: CommandCreator = (
  func: () => void,
) => ({
  ...taskDisplayPropertiesCommandData,
  action: () => func(),
  commandPalette: true,
});

// Change status
export const TaskStatusOpenCommandIcon = RiProgress4Line;
export const taskStatusOpenCommandData: CommandData = {
  id: 'task.status.open',
  name: 'Change status',
  icon: TaskStatusOpenCommandIcon,
  shortcut: 'S',
  group: 'tasks',
  description: 'Change status of the selected task',
};
export const taskStatusOpenCommandCreator: CommandCreator = (
  func: () => void,
) => ({
  ...taskStatusOpenCommandData,
  action: () => func(),
  commandPalette: true,
});

// Change priority
export const TaskPriorityOpenCommandIcon = MdSignalCellular4Bar;
export const taskPriorityOpenCommandData: CommandData = {
  id: 'task.priority.open',
  name: 'Change priority',
  icon: TaskPriorityOpenCommandIcon,
  shortcut: 'P',
  group: 'tasks',
  description: 'Change priority of the selected task',
};
export const taskPriorityOpenCommandCreator: CommandCreator = (
  func: () => void,
) => ({
  ...taskPriorityOpenCommandData,
  action: () => func(),
  commandPalette: true,
});

// Change assignee
export const TaskAssigneeOpenCommandIcon = MdAssignmentInd;
export const taskAssigneeOpenCommandData: CommandData = {
  id: 'task.assignee.open',
  name: 'Change assignee',
  icon: TaskAssigneeOpenCommandIcon,
  shortcut: 'A',
  group: 'tasks',
  description: 'Change assignee of the selected task',
};
export const taskAssigneeOpenCommandCreator: CommandCreator = (
  func: () => void,
) => ({
  ...taskAssigneeOpenCommandData,
  action: () => func(),
  commandPalette: true,
});

// Delete task
export const TaskDeleteCommandIcon = RiDeleteBin7Line;
export const taskDeleteCommandData: CommandData = {
  id: 'task.delete',
  name: 'Delete task',
  icon: TaskDeleteCommandIcon,
  shortcut: 'Cmd+Backspace',
  group: 'tasks',
  description: 'Delete the selected task',
};
export const taskDeleteCommandCreator: CommandCreator = (id: string) => ({
  ...taskDeleteCommandData,
  action: () => store.dispatch(deleteTask(id)),
  commandPalette: true,
});

// Unselect
export const TaskUnselectCommandIcon = RiForbidLine;
export const taskUnselectCommandData: CommandData = {
  id: 'task.unselect',
  name: 'Unselect task',
  icon: TaskUnselectCommandIcon,
  shortcut: 'Escape',
  group: 'tasks',
  description: 'Unselect the selected task',
};
export const taskUnselectCommandCreator: CommandCreator = () => ({
  ...taskUnselectCommandData,
  action: () => store.dispatch(clearSelectedTask()),
  commandPalette: true,
});

// Select next
export const TaskSelectNextCommandIcon = RiArrowDownSLine;
export const taskSelectNextCommandData: CommandData = {
  id: 'task.select.next',
  name: 'Select next task',
  icon: TaskSelectNextCommandIcon,
  shortcut: 'ArrowDown',
  group: 'tasks',
  description: 'Navigate to the next task',
};
export const taskSelectNextCommandCreator: CommandCreator = () => ({
  ...taskSelectNextCommandData,
  action: () => store.dispatch(selectNextTask()),
  commandPalette: false,
});

// Select previous
export const TaskSelectPreviousCommandIcon = RiArrowUpSLine;
export const taskSelectPreviousCommandData: CommandData = {
  id: 'task.select.prev',
  name: 'Select previous task',
  icon: TaskSelectPreviousCommandIcon,
  shortcut: 'ArrowUp',
  group: 'tasks',
  description: 'Navigate to the previous task',
};
export const taskSelectPreviousCommandCreator: CommandCreator = () => ({
  ...taskSelectPreviousCommandData,
  action: () => store.dispatch(selectPreviousTask()),
  commandPalette: false,
});
