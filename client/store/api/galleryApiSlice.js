import { baseApiSlice } from "./baseApiSlice";
import { toast } from "react-toastify";

export const galleryApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({
                url: "/gallery/categories/get",
                method: "GET"
            }),
            staleTime: 600000,  // 10 minutes
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
        getGalleryPaginated: builder.query({
            query: (params) => ({
                url: "/gallery/get",
                method: "GET",
                params
            }),
            staleTime: 600000,  // 10 minutes
            providesTags: ["Gallery"],
        }),
        getGalleryInfinite: builder.query({
            query: (params) => ({
                url: "/gallery/get",
                method: "GET",
                params
            }),
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                const { pageNo, limit, initialSkip, ...restArgs } = queryArgs;
                return `${endpointName}-${JSON.stringify(restArgs)}`;
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg?.pageNo !== previousArg?.pageNo ||
                    currentArg?.category !== previousArg?.category;
            },
            merge: (currentCache, newItems) => {
                const isFirstPage = newItems.data.pagination.currentPage === 1;

                if (isFirstPage) {
                    currentCache.data.galleryItems = newItems.data.galleryItems;
                } else {
                    currentCache.data.galleryItems.push(...newItems.data.galleryItems);
                }

                currentCache.data.pagination = newItems.data.pagination;
            },
            staleTime: 600000,  // 10 minutes
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
            query: ({ id, ...body }) => ({
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
            query: (itemIds) => ({
                url: "/gallery/delete",
                method: "DELETE",
                body: itemIds
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
    useGetGalleryPaginatedQuery,
    useGetGalleryInfiniteQuery,
    useAddGalleryItemMutation,
    useUpdateGalleryItemMutation,
    useDeleteGalleryItemMutation
} = galleryApiSlice;