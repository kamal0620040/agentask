import undoable, { groupByActionTypes } from 'redux-undo';
import { mockTasks } from '@/data/mock-tasks';
import { TaskRaw } from '@/types/task';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TaskState {
  tasks: TaskRaw[];
  selectedTaskId: string | null;
}

const initialState: TaskState = {
  tasks: mockTasks,
  selectedTaskId: null,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<TaskRaw>) => {
      state.tasks.unshift(action.payload);
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<TaskRaw> }>,
    ) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
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
      if (task) {
        task.assigneeId = action.payload.assigneeId;
        task.updatedAt = new Date().toISOString();
      }
    },
    // Label operation
    addTaskLabel: (
      state,
      action: PayloadAction<{ id: string; label: string }>,
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        if (!task.labels) {
          task.labels = [];
        }
        if (!task.labels.includes(action.payload.label)) {
          task.labels.push(action.payload.label);
          task.updatedAt = new Date().toISOString();
        }
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
      state.tasks = mockTasks;
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
} = taskSlice.actions;

const undoableTasks = undoable(taskSlice.reducer, {
  groupBy: groupByActionTypes([selectNextTask.type, selectPreviousTask.type]),
});

export default undoableTasks;
