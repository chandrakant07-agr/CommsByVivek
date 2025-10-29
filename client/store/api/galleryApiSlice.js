import { baseApiSlice } from "./baseApiSlice";
import { toast } from "react-toastify";

export const galleryApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: "/gallery/categories/get",
                method: "GET"
            }),
            providesTags: ["Gallery"]
        }),
        syncCategories: builder.mutation({
            query: (categories) => ({
                url: "/gallery/categories/sync",
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
            invalidatesTags: ["Gallery"]
        }),
        getGalleryItems: builder.query({
            query: (params) => ({
                url: "/gallery/get",
                method: "GET",
                params
            }),
            providesTags: ["Gallery"],
        }),
        addGalleryItem: builder.mutation({
            query: (body) => ({
                url: "/gallery/add",
                method: "POST",
                body,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Gallery item successfully added!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to add gallery item.");
                }
            },
            invalidatesTags: ["Gallery"],
        }),
        updateGalleryItem: builder.mutation({
            query: ({id, ...body}) => ({
                url: "/gallery/update",
                method: "PATCH",
                params: { id },
                body,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Gallery item successfully updated!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to update gallery item.");
                }
            },
            invalidatesTags: ["Gallery"],
        }),
        deleteGalleryItem: builder.mutation({
            query: ({itemId, cloudinaryPublicId}) => ({
                url: "/gallery/delete",
                method: "DELETE",
                params: { id: itemId, cloudinaryPublicId },
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Gallery item successfully deleted!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to delete gallery item.");
                }
            },
            invalidatesTags: ["Gallery"],
        }),
    })
});

export const {
    useGetCategoriesQuery,
    useSyncCategoriesMutation,
    useGetGalleryItemsQuery,
    useAddGalleryItemMutation,
    useUpdateGalleryItemMutation,
    useDeleteGalleryItemMutation
} = galleryApiSlice;