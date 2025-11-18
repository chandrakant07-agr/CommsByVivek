import { baseApiSlice } from "./baseApiSlice";
import { toast } from "react-toastify";

export const adminApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRatingByToken: builder.query({
            query: (token) => ({
                url: `/rating/get-by-token/${token}`,
                method: "GET"
            }),
            staleTime: 600000,  // 10 minutes
            providesTags: ["Rating"]
        }),
        getTotalRatings: builder.query({
            query: () => ({
                url: "/rating/total-items",
                method: "GET"
            }),
            staleTime: 86400000,  // 1 day
            providesTags: ["Rating"],
        }),
        getRatingsPaginated: builder.query({
            query: (params) => ({
                url: "/rating/getAll",
                method: "GET",
                params,
            }),
            staleTime: 600000,  // 10 minutes
            providesTags: ["Rating"],
        }),
        getRatingInfinite: builder.query({
            query: (params) => ({
                url: "/rating/getAll",
                method: "GET",
                params
            }),
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                const { pageNo, limit, initialSkip, ...restArgs } = queryArgs;
                return `${endpointName}-${JSON.stringify(restArgs)}`;
            },
            forceRefetch: ({ currentArg, previousArg }) => {
                return currentArg?.pageNo !== previousArg?.pageNo ||
                    currentArg?.search !== previousArg?.search ||
                    currentArg?.status !== previousArg?.status;
            },
            merge: (currentCache, newItems) => {
                const isFirstPage = newItems.data.pagination.currentPage === 1;

                if(isFirstPage) {
                    currentCache.data.ratings = newItems.data.ratings;
                } else {
                    currentCache.data.ratings.push(...newItems.data.ratings);
                }

                currentCache.data.pagination = newItems.data.pagination;
            },
            staleTime: 600000,  // 10 minutes
            providesTags: ["Rating"],
        }),
        generateRatingLink: builder.mutation({
            query: (itemId) => ({
                url: `/rating/generate-link/${itemId}`,
                method: "POST"
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Rating link successfully generated!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to generate rating link.");
                }
            }
        }),
        updateRatingStatus: builder.mutation({
            query: ({ ids, status }) => ({
                url: "/rating/update-status",
                method: "PUT",
                body: { ids, status },
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Rating status successfully updated!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to update rating status.");
                }
            },
            invalidatesTags: ["Rating"],
        }),
        rejectRating: builder.mutation({
            query: (ids) => ({
                url: "/rating/reject",
                method: "DELETE",
                body: ids,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Rating(s) successfully rejected!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to reject rating(s).");
                }
            },
            invalidatesTags: ["Rating"],
        }),
        submitRating: builder.mutation({
            query: (body) => ({
                url: "/rating/submit",
                method: "POST",
                body,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Rating successfully submitted!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to submit rating.");
                }
            },
            invalidatesTags: ["Rating"],
        }),
    })
});

export const {
    useGetRatingByTokenQuery,
    useGetTotalRatingsQuery,
    useGetRatingInfiniteQuery,
    useGetRatingsPaginatedQuery,
    useGenerateRatingLinkMutation,
    useUpdateRatingStatusMutation,
    useRejectRatingMutation,
    useSubmitRatingMutation,
} = adminApiSlice;