import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { IoArrowBack } from "react-icons/io5";
import { MdDelete, MdOutlineMail } from "react-icons/md";
import { HiOutlineExclamation } from "react-icons/hi";
// import TinyEditor from "../../../components/TinyEditor";
import {
    useDeleteMessageMutation,
    useGetMessageByIdQuery,
    useUpdateStatusMutation
} from "../../../store/api/messageApiSlice";
import styles from "./styles/MessageDetail.module.css";

const MessageDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
    const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

    const { data: messageData, isLoading, isError, error } = useGetMessageByIdQuery(id);

    // const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    //     defaultValues: {
    //         replyMessage: ""
    //     }
    // });

    // Mark as read when viewing message
    useEffect(() => {
        if(messageData && !messageData.data.isRead) updateStatus({ ids: [id], isRead: true });
    }, []);

    const handleMarkAsUnread = () => updateStatus({ ids: [id], isRead: false });

    const handleDelete = async () => {
        try {
            await deleteMessage({ ids: [id] });
            navigate("/admin/messages");
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    // const onSubmit = (data) => {
    //     console.log("Reply data:", data);
    //     // Here you would implement the API call to send the reply
    //     // For example: sendReply({ messageId: id, content: data.replyMessage });
    //     reset();
    // };

    if(isLoading) {
        return <p>Loading message details...</p>;
    }

    // Show error if message not found or other error
    if(isError || !messageData) {
        return (
            <div className={styles.messageDetailContainer}>
                <div className={styles.messageHeader}>
                    <div>
                        <h1>Message Details</h1>
                        <p>View and respond to contact messages</p>
                    </div>
                    <Link to="/admin/messages" className={styles.backButton}>
                        <IoArrowBack /> Back to Messages
                    </Link>
                </div>

                <div className={styles.messageNotFound}>
                    <HiOutlineExclamation />
                    <h2>Message Not Found</h2>
                    <p>The message you're looking for doesn't exist or has been deleted.</p>
                    <Link to="/admin/messages" className={styles.backButton}>
                        <IoArrowBack /> Return to Messages
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className={styles.messageHeader}>
                <div>
                    <h1>Message Details</h1>
                    <p>View and respond to contact messages</p>
                </div>
                <button className={styles.backButton} onClick={() => navigate(-1)}>
                    <IoArrowBack /> Back to Messages
                </button>
            </section>

            <section className={styles.messageContent}>
                <div className={styles.messageMetadata}>
                    <div className={styles.metadataItem}>
                        <h3>From</h3>
                        <p>{messageData?.data.name}</p>
                    </div>

                    <div className={styles.metadataItem}>
                        <h3>Email</h3>
                        <p>{messageData?.data.email}</p>
                    </div>

                    <div className={styles.metadataItem}>
                        <h3>
                            Status
                        </h3>
                        <p className={`${styles.messageReadStatus}
                            ${!messageData?.data.isRead ? styles.unread : ""}`}>
                            {messageData?.data.isRead ? "Read" : "Unread"}
                        </p>

                    </div>

                    <div className={styles.metadataItem}>
                        <h3>Project Type</h3>
                        <div className={styles.messageProject}>
                            {messageData?.data.projectType.name}
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <div className={styles.messageTitle}>
                        <h3>Message</h3>
                        <p>Received on {
                            format(new Date(messageData?.data.createdAt),
                                "MMMM dd, yyyy h:mm a")
                        }
                        </p>
                    </div>
                    <div
                        className={styles.messageText}
                        dangerouslySetInnerHTML={{ __html: messageData?.data.message }}
                    />
                </div>

                <div className={styles.messageActions}>
                    <button
                        className={styles.markButton}
                        onClick={handleMarkAsUnread}
                        disabled={isUpdating}
                    >
                        <MdOutlineMail /> Mark as Unread
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        <MdDelete /> Delete Message
                    </button>
                </div>

                <div className={styles.replyForm}>
                    <h3>Reply to this message</h3>
                    <p>
                        Your reply will be sent directly to {messageData?.data.name}'s email address.
                    </p>

                    {/* <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.replyEditor}>
                            <Controller
                                name="replyMessage"
                                control={control}
                                rules={{ required: "Reply message is required" }}
                                render={({ field }) => (
                                    <TinyEditor
                                        id="reply-message"
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Type your reply here..."
                                        height={250}
                                    />
                                )}
                            />
                            {errors.replyMessage && (
                                <p className="formErrorMessage mt-1">{errors.replymessageData?.data.message}</p>
                            )}
                        </div>

                        <div className={styles.replyActions}>
                            <button type="submit" className={styles.sendButton}>
                                <MdOutlineMail /> Send Reply
                            </button>
                        </div>
                    </form> */}
                </div>
            </section>
        </>
    );
};

export default MessageDetail;