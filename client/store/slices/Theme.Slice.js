import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme
        ? (savedTheme === 'dark')
        : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

const initialState = {
    isDarkMode: getInitialTheme()
};

const slice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        themeToggle(state) {
            state.isDarkMode = !state.isDarkMode;
        }
    }
});

export const { themeToggle } = slice.actions;
export default slice.reducer;