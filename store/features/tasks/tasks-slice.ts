import { mockTodos } from '@/data/mock-todos';
import { Todo } from '@/types/todo';
import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';

export interface TaskState {
  tasks: Todo[];
  selectedTaskId: string | null;
  loading: boolean;
  error: boolean;
}

const initialState: TaskState = {
  tasks: mockTodos,
  loading: false,
  error: false,
  selectedTaskId: null,
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Todo>) => {
      state.tasks.push(action.payload);
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Todo> }>,
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
    // Status operation
    updateTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: Todo['status'] }>,
    ) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id,
      );
      if (index !== -1) {
        state.tasks[index].status = action.payload.status;
        state.tasks[index].updatedAt = new Date().toISOString();
      }
    },
    toggleTaskStatus: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        const currentStatus = task.status;
        const newStatus = currentStatus === 'done' ? 'todo' : 'done';
        task.status = newStatus;
        task.updatedAt = new Date().toISOString();
      }
    },
    // Priority operation
    updateTaskPriority: (
      state,
      action: PayloadAction<{ id: string; priority: Todo['priority'] }>,
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.priority = action.payload.priority;
        task.updatedAt = new Date().toISOString();
      }
    },
    // Assignee operation
    assignTask: (
      state,
      action: PayloadAction<{ id: string; assignee: Todo['assignee'] }>,
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.assignee = action.payload.assignee;
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
    // Loading and error operations
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<boolean>) => {
      state.error = action.payload;
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
    toggleSelectedTaskStatus: (state) => {
      if (state.selectedTaskId) {
        const task = state.tasks.find(
          (task) => task.id === state.selectedTaskId,
        );
        if (task) {
          task.status = task.status === 'done' ? 'todo' : 'done';
          task.updatedAt = new Date().toISOString();
        }
      }
    },
    // Bulk operations
    clearCompletedTasks: (state) => {
      state.tasks = state.tasks.filter((task) => task.status !== 'done');
    },
    resetTasks: (state) => {
      state.tasks = mockTodos;
      state.loading = false;
      state.error = false;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  toggleTaskStatus,
  updateTaskPriority,
  assignTask,
  addTaskLabel,
  removeTaskLabel,
  setSelectedTask,
  clearSelectedTask,
  setLoading,
  setError,
  clearCompletedTasks,
  resetTasks,
  selectNextTask,
  selectPreviousTask,
  toggleSelectedTaskStatus,
} = taskSlice.actions;

export default taskSlice.reducer;
