import { baseApiSlice } from "./baseApiSlice";
import { toast } from "react-toastify";

export const adminApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: "/portfolio/categories/get",
                method: "GET"
            }),
            providesTags: ["Portfolio"]
        }),
        syncCategories: builder.mutation({
            query: (categories) => ({
                url: "/portfolio/categories/sync",
                method: "PUT",
                body: categories
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Categories successfully synced!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to sync categories.");
                }
            },
            invalidatesTags: ["Portfolio"]
        }),
        getPortfolioItems: builder.query({
            query: (params) => ({
                url: "/portfolio/get",
                method: "GET",
                params
            }),
            providesTags: ["Portfolio"],
        }),
        addPortfolioItem: builder.mutation({
            query: (body) => ({
                url: "/portfolio/add",
                method: "POST",
                body,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Portfolio item successfully added!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to add portfolio item.");
                }
            },
            invalidatesTags: ["Portfolio"],
        }),
        updatePortfolioItem: builder.mutation({
            query: ({id, ...body}) => ({
                url: "/portfolio/update",
                method: "PATCH",
                params: { id },
                body,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Portfolio item successfully updated!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to update portfolio item.");
                }
            },
            invalidatesTags: ["Portfolio"],
        }),
        deletePortfolioItem: builder.mutation({
            query: ({itemId, cloudinaryPublicId}) => ({
                url: "/portfolio/delete",
                method: "DELETE",
                params: { id: itemId, cloudinaryPublicId },
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Portfolio item successfully deleted!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to delete portfolio item.");
                }
            },
            invalidatesTags: ["Portfolio"],
        }),
    })
});

export const {
    useGetCategoriesQuery,
    useSyncCategoriesMutation,
    useGetPortfolioItemsQuery,
    useAddPortfolioItemMutation,
    useUpdatePortfolioItemMutation,
    useDeletePortfolioItemMutation
} = adminApiSlice;