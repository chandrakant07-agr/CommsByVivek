import { createSlice } from "@reduxjs/toolkit";
import { adminApiSlice } from "../api/adminApiSlice";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        user: null
    },
    reducers: {
        setCredentials: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        clearCredentials: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            adminApiSlice.endpoints.adminLogin.matchFulfilled,
            (state, { payload }) => {
                state.isAuthenticated = true;
                state.user = payload.data;
            }
        );
        builder.addMatcher(
            adminApiSlice.endpoints.getAdminProfile.matchFulfilled,
            (state, { payload }) => {
                state.isAuthenticated = true;
                state.user = payload.data;
            }
        );
        builder.addMatcher(
            adminApiSlice.endpoints.adminLogout.matchFulfilled,
            (state) => {
                state.isAuthenticated = false;
                state.user = null;
            }
        );
    }
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
