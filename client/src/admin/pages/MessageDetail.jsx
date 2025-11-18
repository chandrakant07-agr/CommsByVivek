import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { Editor } from "primereact/editor";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { HiOutlineExclamation } from "react-icons/hi";
import { MdDelete, MdMarkAsUnread } from "react-icons/md";
import {
    useDeleteMessageMutation,
    useGetMessageByIdQuery,
    useUpdateStatusMutation
} from "../../../store/api/messageApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./styles/MessageDetail.module.css";

const MessageDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
    const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

    const {
        data: fetchMessageData,
        isLoading: isMessageLoading,
        isSuccess: isMessageSuccess,
        isError: isMessageError,
        error: fetchMessageError
    } = useGetMessageByIdQuery(id);

    const handleMarkAsUnread = async () => {
        try {
            await updateStatus({ ids: [id], isRead: false }).unwrap();
        } catch (error) {
            toast.error("Failed to update message status. Please try again.");
        }
    }

    const handleDelete = async () => {
        try {
            await deleteMessage({ ids: [id] }).unwrap();
            navigate("/admin/messages");
        } catch (error) {
            toast.error("Failed to delete message. Please try again.");
        }
    };

    // Mark as read when viewing message
    useEffect(() => {
        if(isMessageSuccess && !fetchMessageData?.data.isRead) {
            (async () => {
                try {
                    await updateStatus({ ids: [id], isRead: true }).unwrap();
                } catch (error) {
                    toast.error("Failed to update message status. Please try again.");
                }
            })();
        }
    }, [isMessageSuccess]);

    return (
        <>
            <section className={`${styles.messageHeader} pageHeader`}>
                <div>
                    <h1>Message Details</h1>
                    <p>View and respond to contact messages</p>
                </div>
                <button className={styles.backButton} onClick={() => navigate(-1)} title="Back">
                    <IoMdArrowRoundBack />
                </button>
            </section>

            <section className="cardContainer">
                {isMessageLoading ? (
                    <LoadingSpinner size="lg" />
                ) : isMessageError || !fetchMessageData ? (
                    <div className={styles.messageNotFound}>
                        <div className={styles.warning}>
                            <HiOutlineExclamation />
                        </div>
                        <h4>Message Not Found</h4>
                        <p>The message you're looking for doesn't exist or has been deleted.</p>
                        <Link to="/admin/messages" className={styles.notFoundBackButton}>
                            <IoMdArrowRoundBack /> Back
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="sectionHeader flex-row">
                            <div className="sectionHeading">
                                <FaEnvelopeOpenText className="sectionIcon" />
                                <h2>Message</h2>
                            </div>
                            <div className={styles.messageActions}>
                                <button
                                    className={styles.markButton}
                                    onClick={handleMarkAsUnread}
                                    disabled={isUpdating}
                                    title="Mark as Unread"
                                >
                                    <MdMarkAsUnread />
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    title="Delete this Message"
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        </div>

                        <div className={styles.senderInfoContainer}>
                            <div className="d-flex a-center gap-2">
                                <div className={styles.profileLogo}>
                                    <span className={styles.profileIcon}>
                                        {fetchMessageData?.data.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <div className="d-flex a-center gap-2">
                                        <h3 className={styles.profileName}>
                                            {fetchMessageData?.data.name}
                                        </h3>
                                        <p className={`${styles.statusBadge}
                                        ${!fetchMessageData?.data.isRead && styles.unread}`}
                                        >
                                            {fetchMessageData?.data.isRead ? "Read" : "Unread"}
                                        </p>
                                    </div>
                                    <p className={styles.profileEmail}>
                                        {fetchMessageData?.data.email}
                                    </p>
                                </div>
                            </div>

                            <div className={styles.receiveDetails}>
                                {fetchMessageData?.data.createdAt
                                    ? <>
                                        <span>
                                            {format(new Date(
                                                fetchMessageData?.data.createdAt),
                                                "PP"
                                            )}
                                        </span>
                                        <span>
                                            {format(new Date(
                                                fetchMessageData?.data.createdAt),
                                                "h:mm a"
                                            )}
                                        </span>
                                    </>
                                    : "Not available"}
                            </div>
                        </div>

                        <div className={styles.messageContainer}>
                            <h5 className={styles.messageTitle}>
                                {fetchMessageData?.data.projectType?.name}
                            </h5>
                            {/* <div className={styles.messageBody}
                                dangerouslySetInnerHTML={{ __html: fetchMessageData?.data.message }}
                            /> */}
                            <Editor
                                value={fetchMessageData?.data.message}
                                readOnly={true}
                                header={null}
                                style={{ border: 'none' }}
                            />
                        </div>
                    </>
                )}
            </section>
        </>
    );
};

export default MessageDetail;