import { baseApiSlice } from "./baseApiSlice";
import { toast } from "react-toastify";

export const bannerApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getHeroBanner: builder.query({
            query: () => ({
                url: "/hero-banner/get",
                method: "GET"
            }),
            providesTags: ["Banner"],
        }),
        syncHeroBanner: builder.mutation({
            query: (body) => ({
                url: "/hero-banner/sync",
                method: "POST",
                body,
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Hero Banner successfully synchronized!");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err.message || "Failed to synchronize hero banner.");
                }
            },
            invalidatesTags: ["Banner"],
        }),
    })
});

export const {
    useGetHeroBannerQuery,
    useSyncHeroBannerMutation,
} = bannerApiSlice;