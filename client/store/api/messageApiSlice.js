import { baseApiSlice } from "./baseApiSlice";
import { toast } from "react-toastify";

export const messageApiSlice = baseApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: (sendData) => ({
                url: "/message/send",
                method: "POST",
                body: sendData
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Message successfully sent");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err?.message || "Send Message Failed");
                }
            }
        }),
        getMessages: builder.query({
            query: (params) => ({
                url: "/message/getAllMessages",
                method: "GET",
                params
            }),
            providesTags: (result) =>
                result
                    ? [...result.data.msgList.map(({ _id }) => ({ type: 'Message', id: _id })),
                        { type: 'Message', id: 'LIST' }]
                    : [{ type: 'Message', id: 'LIST' }]
        }),
        getMessageById: builder.query({
            query: (id) => ({
                url: `/message/getMessage/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => [{ type: 'Message', id }]
        }),
        getTodayMsgStats: builder.query({
            query: () => ({
                url: "/message/getTodayMessageAndStats",
                method: "GET"
            }),
            providesTags: ["Message"]
        }),
        updateStatus: builder.mutation({
            query: (messageIdArray) => ({
                url: "/message/updateStatus",
                method: "PATCH",
                body: messageIdArray
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Status successfully updated");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err?.message || "Status update failed");
                }
            },
            invalidatesTags: (result, error, messageIdArray) =>
                messageIdArray.ids.map((id) => ({ type: 'Message', id })),
        }),
        deleteMessage: builder.mutation({
            query: (messageIdArray) => ({
                url: "/message/delete",
                method: "DELETE",
                body: messageIdArray
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    toast.success(data.message || "Message successfully deleted");
                } catch (error) {
                    const err = error.error?.data;
                    toast.error(err?.message || "Message deletion failed");
                }
            },
            invalidatesTags: ["Message"]
        }),
    })
});

export const {
    useSendMessageMutation,
    useGetMessagesQuery,
    useGetMessageByIdQuery,
    useGetTodayMsgStatsQuery,
    useUpdateStatusMutation,
    useDeleteMessageMutation
} = messageApiSlice;