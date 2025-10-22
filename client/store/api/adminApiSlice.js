import { baseApiSlice } from "./baseApiSlice";
import { toast } from "react-toastify";

export const adminApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: (credentials) => ({
                url: "/admin/login",
                method: "POST",
                body: credentials
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Login successful");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err?.message || "Login failed");
                }
            }
        }),
        getAdminProfile: builder.query({
            query: () => ({
                url: "/admin/me",
                method: "GET"
            }),
            providesTags: ["Admin"]
        }),
        updateAdminProfile: builder.mutation({
            query: (profileData) => ({
                url: "/admin/updateAdminInfo",
                method: "PATCH",
                body: profileData
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success("Profile successfully updated");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err?.message || "Failed to update profile");
                }
            },
            invalidatesTags: ["Admin"]
        }),
        changeAdminPassword: builder.mutation({
            query: (passwordData) => ({
                url: "/admin/change-password",
                method: "PUT",
                body: passwordData
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Password successfully changed");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err?.message || "Failed to change password");
                }
            }
        }),
        adminLogout: builder.mutation({
            query: () => ({
                url: "/admin/logout",
                method: "POST"
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    toast.success("Successfully logged out");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err?.message || "Failed to log out");
                }
            }
        }),
        // admin section endpoints
        
        getContent: builder.query({
            query: () => ({
                url: "/admin/content",
                method: "GET",
            }),
            providesTags: ["Content"],
        }),
        updateContent: builder.mutation({
            query: (contentData) => ({
                url: "/admin/content",
                method: "PUT",
                body: contentData,
            }),
            invalidatesTags: ["Content"],
        }),
        getPortfolioItems: builder.query({
            query: () => ({
                url: "/admin/portfolio",
                method: "GET",
            }),
            providesTags: ["Portfolio"],
        }),
        addPortfolioItem: builder.mutation({
            query: (itemData) => ({
                url: "/admin/portfolio",
                method: "POST",
                body: itemData,
            }),
            invalidatesTags: ["Portfolio"],
        }),
        updatePortfolioItem: builder.mutation({
            query: ({ id, ...itemData }) => ({
                url: `/admin/portfolio/${id}`,
                method: "PUT",
                body: itemData,
            }),
            invalidatesTags: ["Portfolio"],
        }),
        deletePortfolioItem: builder.mutation({
            query: (itemId) => ({
                url: `/admin/portfolio/${itemId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Portfolio"],
        }),
    }),
});

export const {
    useAdminLoginMutation,
    useGetAdminProfileQuery,
    useUpdateAdminProfileMutation,
    useChangeAdminPasswordMutation,
    useAdminLogoutMutation,

    useGetContentQuery,
    useUpdateContentMutation,
    useGetPortfolioItemsQuery,
    useAddPortfolioItemMutation,
    useUpdatePortfolioItemMutation,
    useDeletePortfolioItemMutation,
} = adminApiSlice;