import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApiSlice = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,
        credentials: "include",
    }),
    tagTypes: ["Admin", "Message", "ProjectType", "ContactDetails", "Content", "Gallery"],
    endpoints:  builder => ({}),
});