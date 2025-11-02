import { baseApiSlice } from "./baseApiSlice";
import { toast } from "react-toastify";

export const cloudinaryApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        generateSignature: builder.mutation({
            query: (body) => ({
                url: '/cloudinary/generate/signature',
                method: 'POST',
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || 'Cloudinary signature obtained successfully!');
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err?.message || 'Failed to obtain Cloudinary signature.');
                }
            },
            keepUnusedDataFor: 0,
        }),
    }),
});

export const { useGenerateSignatureMutation } = cloudinaryApiSlice;