import { assignees } from "@/data/mock-assignee";
import { RootState } from "@/store/store";
import { TaskObject, TaskRaw, TaskStatus, TaskPriority } from "@/components/tasks/types";
import { createSelector } from "@reduxjs/toolkit";

function augmentTaskWithAssignee(task: TaskRaw | null): TaskObject | null {
    if (task == null) {
    return null;
  }

  if (!task.assigneeId) {
    return { ...task, assignee: null };
  }

  const assignee = assignees.find((a) => a.id === task.assigneeId) ?? null;

  return {
    ...task,
    assignee,
  };
}

function augmentTasksWithAssignee(tasks: TaskRaw[]): Array<TaskObject> {
  return tasks.map(augmentTaskWithAssignee).flatMap((task) => task || []);
}

export const selectRawTasks = (state: RootState) => state.tasks.present.tasks;
export const selectAllTasks = createSelector([selectRawTasks], (tasks) => augmentTasksWithAssignee(tasks));

export const selectSelectedTaskId = (state: RootState) => state.tasks.present.selectedTaskId;

export const selectTasksCanUndo = (state: RootState) => state.tasks.past.length > 0;
export const selectTasksCanRedo = (state: RootState) => state.tasks.future.length > 0;

// Task by ID selector
export const selectTaskById = (taskId: string) => createSelector([selectAllTasks], (tasks) => tasks.find(task => task.id === taskId));

// Status-based selectors
export const selectTasksByStatus = (status: TaskStatus) => createSelector([selectAllTasks], (tasks) => tasks.filter(task => task.status === status));

export const selectTodoTasks = selectTasksByStatus('todo');
export const selectInProgressTasks = selectTasksByStatus('in-progress');
export const selectDoneTasks = selectTasksByStatus('done');
export const selectCancelledTasks = selectTasksByStatus('cancelled');

// Assignee-based selector
export const selectTasksByAssignee = (assigneeId: string) => createSelector([selectAllTasks], (tasks) => tasks.filter(task => task.assignee?.id === assigneeId));
export const selectUnassignedTasks = createSelector([selectAllTasks], (tasks) => tasks.filter(task => task.assignee !== null));

// Label-based selector
export const selectTasksByLabel = (label: string) => createSelector([selectAllTasks], (tasks) => tasks.filter(task => task.labels?.includes(label)));
export const selectAllLabels = createSelector([selectAllTasks], (tasks) => {
    const labelSet = new Set<string>();
    tasks.forEach(task => {
        task.labels?.forEach(label => labelSet.add(label));
    });
    return Array.from(labelSet);
});

// Priority - based selectors
export function selectTasksByPriority(priority: TaskPriority) {
  return createSelector([selectAllTasks], function (tasks) {
    return tasks.filter((task) => task.priority === priority);
  });
}

// Statistics selectors
export const selectTaskCountsByStatus = createSelector([selectAllTasks], (tasks) => ({
    total: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    inReview: tasks.filter(task => task.status === 'in-review').length,
    done: tasks.filter(task => task.status === 'done').length,
    cancelled: tasks.filter(task => task.status === 'cancelled').length,
    p0: tasks.filter((task) => task.priority === 0).length,
    p1: tasks.filter((task) => task.priority === 1).length,
    p2: tasks.filter((task) => task.priority === 2).length,
    p3: tasks.filter((task) => task.priority === 3).length,
    p4: tasks.filter((task) => task.priority === 4).length,
})); 

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