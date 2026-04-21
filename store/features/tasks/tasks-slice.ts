import { mockTodos } from "@/data/mock-todos";
import { Todo } from "@/types/todo";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TaskState {
  tasks: Todo[];
  loading: boolean;
  error: boolean;
}

const initialState: TaskState = {
  tasks: mockTodos,
  loading: false,
  error: false,
};

export const taskSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Todo>) => {
            state.tasks.push(action.payload);
        },
        updateTask: (state, action: PayloadAction<{ id: string, updates: Partial<Todo> }>) => {
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = { ...state.tasks[index], ...action.payload.updates, updatedAt: new Date().toISOString() };
            }
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
        // Status operation
        updateTaskStatus: (state, action: PayloadAction<{ id: string, status: Todo['status'] }>) => {
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index].status = action.payload.status;
                state.tasks[index].updatedAt = new Date().toISOString();
            }
        },
        toggleTaskStatus: (state, action: PayloadAction<string>) => {
            const task = state.tasks.find(task => task.id === action.payload);
            if (task) {
                const currentStatus = task.status;
                const newStatus = currentStatus === 'done' ? 'todo' : 'done';
                task.status = newStatus;
                task.updatedAt = new Date().toISOString();
            }
        },
        // Priority operation
        updateTaskPriority: (state, action: PayloadAction<{ id: string, priority: Todo['priority'] }>) => {
            const task = state.tasks.find(task => task.id === action.payload.id);
            if (task) {
                task.priority = action.payload.priority;
                task.updatedAt = new Date().toISOString();
            }
        },
        // Assignee operation
        assignTask: (state, action: PayloadAction<{ id: string, assignee: Todo['assignee'] }>) => {
            const task = state.tasks.find(task => task.id === action.payload.id);
            if (task) {
                task.assignee = action.payload.assignee;
                task.updatedAt = new Date().toISOString();
            }
        },
        // Label operation
        addTaskLabel: (state, action: PayloadAction<{ id: string, label: string }>) => {
            const task = state.tasks.find(task => task.id === action.payload.id);
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
        removeTaskLabel: (state, action: PayloadAction<{ id: string, label: string }>) => {
            const task = state.tasks.find(task => task.id === action.payload.id);
            if (task && task.labels) {
                task.labels = task.labels.filter(l => l !== action.payload.label);
                task.updatedAt = new Date().toISOString();
            }
        },
        // Loading and error operations
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<boolean>) => {
            state.error = action.payload;
        },
        // Bulk operations
        clearCompletedTasks: (state) => {
            state.tasks = state.tasks.filter(task => task.status !== 'done');
        },
        resetTasks: (state) => {
            state.tasks = mockTodos;
            state.loading = false;
            state.error = false;
        }
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
    setLoading,
    setError,
    clearCompletedTasks,
    resetTasks,
} = taskSlice.actions;

export default taskSlice.reducer;