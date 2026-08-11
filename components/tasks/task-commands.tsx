import { ActionCreators as UndoActionCreators } from 'redux-undo';
import { CommandCreator } from '@/actions/types';
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

export const TaskUndoCommandIcon = RiArrowGoBackLine;
export const taskUndoCommand: CommandCreator = () => ({
  id: 'task.undo',
  name: 'Undo task change',
  icon: TaskUndoCommandIcon,
  shortcut: 'Cmd+Z',
  group: 'tasks',
  description: 'Undo the last task change',
  action: () => store.dispatch(UndoActionCreators.undo()),
  commandPalette: true,
});

export const TaskRedoCommandIcon = RiArrowGoForwardLine;
export const taskRedoCommand: CommandCreator = () => ({
  id: 'task.redo',
  name: 'Redo task change',
  icon: TaskRedoCommandIcon,
  shortcut: 'Cmd+Shift+Z',
  group: 'tasks',
  description: 'Redo the last undone task change',
  action: () => store.dispatch(UndoActionCreators.redo()),
  commandPalette: true,
});

export const TaskCreateDialogOpenCommandIcon = RiStickyNoteAddLine;
export const taskCreateDialogOpenCommand: CommandCreator = (func: () => void) => ({
  id: 'task.create.open',
  name: 'Create task',
  icon: TaskCreateDialogOpenCommandIcon,
  shortcut: 'C',
  group: 'tasks',
  description: 'Create a new task',
  action: () => func(),
  commandPalette: true,
});

export const TaskDisplayPropertiesCommandIcon = RiEqualizerFill;
export const taskDisplayPropertiesCommand: CommandCreator = (
  func: () => void,
) => ({
  id: 'task.display_properties',
  name: 'Show display options',
  icon: TaskDisplayPropertiesCommandIcon,
  shortcut: 'Shift+V',
  group: 'tasks',
  description: 'Show display options',
  action: () => func(),
  commandPalette: true,
});

export const TaskStatusOpenCommandIcon = RiProgress4Line;
export const taskStatusOpenCommand: CommandCreator = (func: () => void) => ({
  id: 'task.status.open',
  name: 'Change status',
  icon: TaskStatusOpenCommandIcon,
  shortcut: 'S',
  group: 'tasks',
  description: 'Change status of the selected task',
  action: () => func(),
  commandPalette: true,
});

export const TaskPriorityOpenCommandIcon = MdSignalCellular4Bar;
export const taskPriorityOpenCommand: CommandCreator = (func: () => void) => ({
  id: 'task.priority.open',
  name: 'Change priority',
  icon: TaskPriorityOpenCommandIcon,
  shortcut: 'P',
  group: 'tasks',
  description: 'Change priority of the selected task',
  action: () => func(),
  commandPalette: true,
});

export const TaskAssigneeOpenCommandIcon = MdAssignmentInd;
export const taskAssigneeOpenCommand: CommandCreator = (func: () => void) => ({
  id: 'task.assignee.open',
  name: 'Change assignee',
  icon: TaskAssigneeOpenCommandIcon,
  shortcut: 'A',
  group: 'tasks',
  description: 'Change assignee of the selected task',
  action: () => func(),
  commandPalette: true,
});

export const TaskDeleteCommandIcon = RiDeleteBin7Line;
export const taskDeleteCommand:CommandCreator = (id: string) => ({
  id: 'task.delete',
  name: 'Delete task',
  icon: TaskDeleteCommandIcon,
  shortcut: 'Cmd+Backspace',
  group: 'tasks',
  description: 'Delete the selected task',
  action: () => store.dispatch(deleteTask(id)),
  commandPalette: true,
});

export const TaskUnselectCommandIcon = RiForbidLine;
export const taskUnselectCommand: CommandCreator = () => ({
  id: 'task.unselect',
  name: 'Unselect task',
  icon: TaskUnselectCommandIcon,
  shortcut: 'Escape',
  group: 'tasks',
  description: 'Unselect the selected task',
  action: () => store.dispatch(clearSelectedTask()),
  commandPalette: true,
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
  commandPalette: false,
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
  commandPalette: false,
});