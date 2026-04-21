import { RootState } from "@/store/store";
import { Todo } from "@/types/todo";
import { createSelector } from "@reduxjs/toolkit";

// Base selector
export const selectTasksState = (state: RootState) => state.tasks;
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTaskLoading = (state: RootState) => state.tasks.loading;
export const selectTaskError = (state: RootState) => state.tasks.error;
export const selectSelectedTaskId = (state: RootState) => state.tasks.selectedTaskId;

// Task by ID selector
export const selectTaskById = (taskId: string) => createSelector([selectAllTasks], (tasks) => tasks.find(task => task.id === taskId));

// Status-based selectors
export const selectTasksByStatus = (status: Todo['status']) => createSelector([selectAllTasks], (tasks) => tasks.filter(task => task.status === status));

export const selectTodoTasks = selectTasksByStatus('todo');
export const selectInProgressTasks = selectTasksByStatus('in-progress');
export const selectDoneTasks = selectTasksByStatus('done');
export const selectCancelledTasks = selectTasksByStatus('cancelled');

// Priority-based selectors
export const selectTasksByPriority = (priority: Todo['priority']) => createSelector([selectAllTasks], (tasks) => tasks.filter(task => task.priority === priority));
export const selectLowPriorityTasks = selectTasksByPriority('low');
export const selectMediumPriorityTasks = selectTasksByPriority('medium');
export const selectHighPriorityTasks = selectTasksByPriority('high');
export const selectUrgentPriorityTasks = selectTasksByPriority('urgent');

// Assignee-based selector
export const selectTasksByAssignee = (assigneeId: string) => createSelector([selectAllTasks], (tasks) => tasks.filter(task => task.assignee?.id === assigneeId));
export const selectUnassignedTasks = createSelector([selectAllTasks], (tasks) => tasks.filter(task => !task.assignee));

// Label-based selector
export const selectTasksByLabel = (label: string) => createSelector([selectAllTasks], (tasks) => tasks.filter(task => task.labels?.includes(label)));
export const selectAllLabels = createSelector([selectAllTasks], (tasks) => {
    const labelSet = new Set<string>();
    tasks.forEach(task => {
        task.labels?.forEach(label => labelSet.add(label));
    });
    return Array.from(labelSet);
});

// Statistics selectors
export const selectTaskCountsByStatus = createSelector([selectAllTasks], (tasks) => ({
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    done: tasks.filter(task => task.status === 'done').length,
    cancelled: tasks.filter(task => task.status === 'cancelled').length,
})); 

export const selectPriorityCounts = createSelector([selectAllTasks], (tasks) => ({
    low: tasks.filter(task => task.priority === 'low').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    high: tasks.filter(task => task.priority === 'high').length,
    urgent: tasks.filter(task => task.priority === 'urgent').length,
}));

// Overdue tasks selector
export const selectOverdueTasks = createSelector([selectAllTasks], (tasks) => {
    const now = new Date();
    return tasks.filter(task => task.dueDate && new Date(task.dueDate) < now && task.status !== 'done');
});

// Recently updated tasks selector
export const selectRecentlyUpdatedTasks = createSelector([selectAllTasks], (tasks) => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return tasks.filter(task => task.updatedAt && new Date(task.updatedAt) > oneDayAgo);
});


// Selected task selector
export const selectSelectedTask = createSelector(
    [selectAllTasks, selectSelectedTaskId],
    (tasks, selectedTaskId) => {
        if(!selectedTaskId) return null;
        return tasks.find(task => task.id === selectedTaskId) || null;  
    }
);

// Navigation availability selectors
export const selectSelectedTaskIndex = createSelector(
  [selectAllTasks, selectSelectedTaskId],
  (tasks, selectedTaskId) => {
    if (!selectedTaskId) return -1;
    return tasks.findIndex((task) => task.id === selectedTaskId);
  },
);

export const selectHasNextTask = createSelector(
  [selectAllTasks, selectSelectedTaskIndex],
  (tasks, selectedIndex) => {
    if (selectedIndex === -1 || tasks.length === 0) return false;
    return selectedIndex < tasks.length - 1;
  },
);

export const selectHasPreviousTask = createSelector(
  [selectSelectedTaskIndex],
  (selectedIndex) => {
    if (selectedIndex === -1) return false;
    return selectedIndex > 0;
  },
);