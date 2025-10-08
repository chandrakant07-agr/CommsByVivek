import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./slices/Theme.Slice";

const store = configureStore({
    reducer: {
        theme: themeSlice,
    }
});

export default store;