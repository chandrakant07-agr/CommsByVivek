import { baseApiSlice } from "./baseApiSlice";
import { toast } from "react-toastify";

export const adminApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getContactDetails: builder.query({
            query: () => ({
                url: "/contact-details/get",
                method: "GET"
            }),
            providesTags: ["ContactDetails"]
        }),
        updateContactDetails: builder.mutation({
            query: (contactData) => ({
                url: "/contact-details/update",
                method: "PUT",
                body: contactData
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success("Contact details successfully updated");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err?.message || "Failed to update contact details");
                }
            },
            invalidatesTags: ["ContactDetails"]
        }),
        updateSocialHandles: builder.mutation({
            query: (socialLinks) => ({
                url: "/contact-details/update-social-handles",
                method: "PUT",
                body: socialLinks
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Social media links successfully updated");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err?.message || "Failed to update social media links");
                }
            },
            invalidatesTags: ["ContactDetails"]
        }),
    }),
});

export const {
    useGetContactDetailsQuery,
    useUpdateContactDetailsMutation,
    useUpdateSocialHandlesMutation
} = adminApiSlice;