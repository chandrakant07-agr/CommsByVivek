import { configureStore } from "@reduxjs/toolkit";
import { baseApiSlice } from "./api/baseApiSlice";
import themeSlice from "./slices/Theme.Slice";
import authSlice from "./slices/Auth.Slice";

const store = configureStore({
    reducer: {
        theme: themeSlice,
        auth: authSlice,
        [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApiSlice.middleware),
});

export default store;