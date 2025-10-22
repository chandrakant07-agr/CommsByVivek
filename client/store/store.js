import { configureStore } from "@reduxjs/toolkit";
import { baseApiSlice } from "./api/baseApiSlice";
import themeSlice from "./slices/Theme.Slice";

const store = configureStore({
    reducer: {
        theme: themeSlice,
        [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApiSlice.middleware),
});

export default store;