import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
    mode: 'light' | 'dark' | 'system';
}

const initialState: ThemeState = {
    mode: 'system'
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeMode: (state, action: PayloadAction<ThemeState['mode']>) => {
            state.mode = action.payload;
        },
        toggleTheme: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        resetTheme: (state) => {
            state.mode = 'system';
        }
    }
})

export const { setThemeMode, toggleTheme, resetTheme } = themeSlice.actions;
export default themeSlice.reducer;