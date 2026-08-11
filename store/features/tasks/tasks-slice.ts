import undoable, { groupByActionTypes } from 'redux-undo';
import { mockTasks } from '@/data/mock-tasks';
import { TaskPriority, TaskRaw, TaskStatus } from '@/components/tasks/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TaskDisplayField =
  | 'id'
  | 'priority'
  | 'status'
  | 'title'
  | 'assignee'
  | 'createdAt'
  | 'updatedAt'
  | 'labels';

const defaultVisibleFields: TaskDisplayField[] = [
  'priority',
  'id',
  'status',
  'title',
  'assignee',
  'createdAt',
  'updatedAt',
];

export const taskSortFields = [
  'id',
  'priority',
  'status',
  'title',
  'createdAt',
  'updatedAt',
] as const;
export type TaskSortField = (typeof taskSortFields)[number];
export type TaskSortDirection = 'asc' | 'desc';

export interface TaskState {
  tasks: TaskRaw[];
  selectedTaskId: string | null;
  visibleFields: TaskDisplayField[];
  sortBy: TaskSortField;
  sortDirection: TaskSortDirection;
  sortFieldHidden: boolean;
}

const defaultSortField: TaskSortField = 'id';
const defaultSortDirection: TaskSortDirection = 'desc';

function parseTaskId(id: string) {
  const match = id.match(/^([A-Z]+)-(\d+)$/);

  if (match) {
    return { prefix: match[1], number: parseInt(match[2], 10) };
  }

  return { prefix: id, number: 0 };
}

function sortTasks(
  tasks: TaskRaw[],
  sortBy: TaskSortField,
  sortDirection: TaskSortDirection,
): TaskRaw[] {
  return [...tasks].sort((a, b) => {
    let valueA: string | number;
    let valueB: string | number;

    switch (sortBy) {
      case 'id':
        const idA = parseTaskId(a.id);
        const idB = parseTaskId(b.id);

        if (idA.prefix !== idB.prefix) {
          valueA = idA.prefix;
          valueB = idB.prefix;
        } else {
          valueA = idA.number;
          valueB = idB.number;
        }
        break;
      case 'title':
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        break;
      case 'status':
        const statusOrder: TaskStatus[] = [
          'cancelled',
          'done',
          'todo',
          'in-progress',
          'in-review',
        ];
        valueA = statusOrder.indexOf(a.status);
        valueB = statusOrder.indexOf(b.status);
        break;
      case 'priority':
        const priorityOrder: TaskPriority[] = [0, 4, 3, 2, 1];
        valueA = priorityOrder.indexOf(a.priority);
        valueB = priorityOrder.indexOf(b.priority);
        break;
      case 'updatedAt':
        valueA = new Date(a.updatedAt).getTime();
        valueB = new Date(b.updatedAt).getTime();
        break;
      case 'createdAt':
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;
      default:
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;
    }

    if (valueA < valueB) {
      return sortDirection === 'asc' ? -1 : 1;
    }

    if (valueA > valueB) {
      return sortDirection === 'asc' ? 1 : -1;
    }

    return 0;
  });
}

const initialState: TaskState = {
  tasks: sortTasks(mockTasks, defaultSortField, defaultSortDirection),
  selectedTaskId: null,
  visibleFields: defaultVisibleFields,
  sortBy: defaultSortField,
  sortDirection: defaultSortDirection,
  sortFieldHidden: false,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<TaskRaw>) => {
      state.tasks.unshift(action.payload);
      state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<TaskRaw> }>,
    ) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );
      if (index === -1) {
        return;
      }

      state.tasks[index] = {
        ...state.tasks[index],
        ...action.payload.updates,
        updatedAt: new Date().toISOString(),
      };
      state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
    },
    deleteTask: (state, action) => {
      const taskIdToDelete = action.payload;
      const currentIndex = state.tasks.findIndex(
        (task) => task.id === taskIdToDelete,
      );

      // If the task being deleted is currently selected, clear the next task
      if (state.selectedTaskId === taskIdToDelete) {
        if (currentIndex !== -1 && state.tasks.length > 1) {
          // Try to select the next task, or the previous on if this is the last task
          const nextIndex =
            currentIndex < state.tasks.length - 1
              ? currentIndex + 1
              : currentIndex - 1;
          state.selectedTaskId = state.tasks[nextIndex].id;
        } else {
          // No other tasks available, clear selection
          state.selectedTaskId = null;
        }
      }

      // Remove the task from the list
      state.tasks = state.tasks.filter((task) => task.id !== taskIdToDelete);
    },
    // Assignee operation
    assignTask: (
      state,
      action: PayloadAction<{ id: string; assigneeId: string }>,
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task == null) {
        return;
      }

      task.assigneeId = action.payload.assigneeId;
      task.updatedAt = new Date().toISOString();
      state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
    },
    // Label operation
    addTaskLabel: (
      state,
      action: PayloadAction<{ id: string; label: string }>,
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task == null) {
        return;
      }

      if (!task.labels) {
        task.labels = [];
      }

      if (!task.labels.includes(action.payload.label)) {
        task.labels.push(action.payload.label);
        task.updatedAt = new Date().toISOString();
        state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
      }
    },
    removeTaskLabel: (
      state,
      action: PayloadAction<{ id: string; label: string }>,
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task && task.labels) {
        task.labels = task.labels.filter((l) => l !== action.payload.label);
        task.updatedAt = new Date().toISOString();
      }
    },
    // task selection operations
    setSelectedTask: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    clearSelectedTask: (state) => {
      state.selectedTaskId = null;
    },
     selectNextTask: (state) => {
      if (state.tasks.length === 0) return;

      if (!state.selectedTaskId) {
        // No task selected, select the first one
        state.selectedTaskId = state.tasks[0].id;
        return;
      }

      const currentIndex = state.tasks.findIndex(
        (task) => task.id === state.selectedTaskId,
      );
      if (currentIndex !== -1 && currentIndex < state.tasks.length - 1) {
        // Select the next task
        state.selectedTaskId = state.tasks[currentIndex + 1].id;
      }
      // If already at the last task, do nothing (stay at current)
    },
    selectPreviousTask: (state) => {
      if (state.tasks.length === 0) return;

      if (!state.selectedTaskId) {
        // No task selected, select the last one
        state.selectedTaskId = state.tasks[state.tasks.length - 1].id;
        return;
      }

      const currentIndex = state.tasks.findIndex(
        (task) => task.id === state.selectedTaskId,
      );
      if (currentIndex > 0) {
        // Select the previous task
        state.selectedTaskId = state.tasks[currentIndex - 1].id;
      }
      // If already at the first task, do nothing (stay at current)
    },
    resetTasks: (state) => {
      state.tasks = sortTasks(mockTasks, state.sortBy, state.sortDirection);
      state.selectedTaskId = null;
    },
    toggleFieldVisibility: (state, action: PayloadAction<TaskDisplayField>) => {
      const field = action.payload;
      const index = state.visibleFields.indexOf(field);

      if (index === -1) {
        state.visibleFields.push(field);
        if (field === state.sortBy) {
          state.sortFieldHidden = false;
        }

        return;
      }

      // Field is visible, remove it (but keep at least title)
      if (field === 'title') {
        return;
      }

      state.visibleFields.splice(index, 1);
      if (field === state.sortBy) {
        state.sortFieldHidden = true;
      }
    },
    setFieldsVisibility: (state, action: PayloadAction<TaskDisplayField[]>) => {
      const fields = action.payload;
      if (!fields.includes('title')) {
        fields.push('title');
      }
      state.visibleFields = fields;
    },
    setFieldsSortBy: (state, action: PayloadAction<TaskSortField>) => {
      const newSortField = action.payload;
      const currentSortField = state.sortBy;

      if (state.sortFieldHidden && currentSortField !== 'title') {
        const fieldIndex = state.visibleFields.indexOf(currentSortField);
        if (fieldIndex !== -1) {
          state.visibleFields.splice(fieldIndex, 1);
        }
      }

      const isNewFieldHidden = !state.visibleFields.includes(newSortField);
      if (isNewFieldHidden) {
        state.visibleFields.push(newSortField);
      }

      state.sortBy = newSortField;
      state.sortFieldHidden = isNewFieldHidden;
      state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
    },
    setFieldsSortDirection: (
      state,
      action: PayloadAction<TaskSortDirection>,
    ) => {
      state.sortDirection = action.payload;
      state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
    },
    toggleFieldsSortDirection: (state) => {
      state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
      state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
    },
    resetFieldsToDefault: (state) => {
      state.visibleFields = [...defaultVisibleFields];
      state.sortBy = initialState.sortBy;
      state.sortDirection = initialState.sortDirection;
      state.sortFieldHidden = initialState.sortFieldHidden;
      state.tasks = sortTasks(state.tasks, state.sortBy, state.sortDirection);
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  assignTask,
  addTaskLabel,
  removeTaskLabel,
  setSelectedTask,
  clearSelectedTask,
  resetTasks,
  selectNextTask,
  selectPreviousTask,
  toggleFieldVisibility,
  setFieldsVisibility,
  setFieldsSortBy,
  setFieldsSortDirection,
  toggleFieldsSortDirection,
  resetFieldsToDefault,
} = taskSlice.actions;

const undoableTasks = undoable(taskSlice.reducer, {
  groupBy: groupByActionTypes([selectNextTask.type, selectPreviousTask.type]),
});

export default undoableTasks;
