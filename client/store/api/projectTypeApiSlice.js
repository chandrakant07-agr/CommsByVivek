import { baseApiSlice } from "./baseApiSlice";
import { toast } from "react-toastify";

export const adminApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProjectTypes: builder.query({
            query: () => ({
                url: "/project-type/get",
                method: "GET"
            }),
            providesTags: ["ProjectType"]
        }),
        syncProjectType: builder.mutation({
            query: (projectTypes) => ({
                url: "/project-type/syncProjectType",
                method: "PUT",
                body: projectTypes
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Project types successfully synced");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err?.message || "Failed to sync project types");
                }
            },
            invalidatesTags: ["ProjectType"]
        })
    })
});

export const {
    useGetProjectTypesQuery,
    useSyncProjectTypeMutation,
} = adminApiSlice;