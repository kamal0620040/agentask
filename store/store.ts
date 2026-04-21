import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/store/features/theme/theme-slice";
import tasksReducer from "@/store/features/tasks/tasks-slice";

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        tasks: tasksReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;