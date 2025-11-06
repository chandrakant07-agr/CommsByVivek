import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { TiMessages } from "react-icons/ti";
import { MdOutlineCleaningServices } from "react-icons/md";
import { LuMailSearch, LuMessageSquareText } from "react-icons/lu";
import {
    useDeleteMessageMutation,
    useGetMessagesQuery,
    useUpdateStatusMutation
} from "../../../store/api/messageApiSlice";
import { useGetProjectTypesQuery } from "../../../store/api/projectTypeApiSlice";
import Pagination from "../components/Pagination";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./styles/Message.module.css"

const Messages = () => {
    const { status: urlStatus } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { register: filterRegister, watch: filterWatch, reset: resetFilter } = useForm();
    const { register: selectRegister, watch: selectWatch, reset: resetSelect } = useForm({
        defaultValues: { selectAllMessages: false, selectedCheckIds: [] }
    });

    const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
    const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();
    const { data: fetchProjectTypes, isLoading: isLoadingProjectTypes } = useGetProjectTypesQuery();
    const { data: fetchMessages, isLoading: isLoadingMsg, isError: isMsgError } = useGetMessagesQuery({
        search: filterWatch("search") || "",
        status: filterWatch("status") || "all",
        prType: filterWatch("prType") || "all",
        sortBy: filterWatch("sortBy") || "newest",
        pageNo: currentPage || 1,
        limit: itemsPerPage
    });

    const selectMsgLength = selectWatch("selectedCheckIds").length;

    const handleAllSelectMessages = () => {
        const allIds = fetchMessages?.data.msgList.map(m => m._id) || [];

        if(selectMsgLength === allIds.length) {
            resetSelect({ selectedCheckIds: [] });         // Uncheck all
        } else {
            resetSelect({ selectedCheckIds: allIds });     // Check all
        }
    }

    const handleBulkMarkAsRead = async (isRead) => {
        try {
            await updateStatus({ ids: selectWatch("selectedCheckIds"), isRead }).unwrap();
        } catch (error) {
            toast.error("Failed to update message status. Please try again.");
        }
    }

    const handleMarkAsRead = async (id, isRead) => {
        try {
            await updateStatus({ ids: [id], isRead }).unwrap();
        } catch (error) {
            toast.error("Failed to update message status. Please try again.");
        }
    }

    const handleDeleteMessage = async (id) => {
        if(window.confirm("Are you sure you want to delete this message?")) {
            try {
                await deleteMessage({ ids: [id] }).unwrap();
            } catch (error) {
                toast.error("Failed to delete message. Please try again.");
            }
        }
    }

    const handleBulkDelete = async () => {
        if(window.confirm("Are you sure you want to delete the selected messages?")) {
            try {
                await deleteMessage({ ids: selectWatch("selectedCheckIds") }).unwrap();
            } catch (error) {
                toast.error("Failed to delete messages. Please try again.");
            }
        }
    };

    const createSnippet = (htmlText, length) => {
        const plainText = htmlText.replace(/<[^>]+>/g, '');
        return plainText.length > length ? plainText.substring(0, length) + "..." : plainText;
    }

    useEffect(() => {
        resetFilter({
            status: urlStatus
        });
        setCurrentPage(1);
    }, [urlStatus, resetFilter]);

    // set selectedCheckIds to empty array when messages change
    useEffect(() => {
        resetSelect({
            selectAllMessages: false,
            selectedCheckIds: []
        });
    }, [fetchMessages, resetSelect]);

    if(isMsgError) {
        return <p>Something went wrong. Please try again later.</p>
    }

    return (
        <>
            {/* Header */}
            <section className={`${styles.messagesHeader} pageHeader`}>
                <div>
                    <h1>Messages</h1>
                    <p>Manage all contact form submissions</p>
                </div>
                <div className={styles.messagesMark}>
                    <div className={styles.msgCountContainer}>
                        <span className={styles.selectMsg}>
                            {selectMsgLength} selected
                        </span>
                        <span className={styles.totalMsg}>
                            {fetchMessages?.data.pagination.totalMsg || 0} total messages
                        </span>
                    </div>
                    <div className={styles.markActions}>
                        <button className={`${styles.readMarkBtn}
                            ${(selectMsgLength === 0 || isUpdating) && styles.markBtnDisabled}`}
                            onClick={() => handleBulkMarkAsRead(true)}
                            disabled={selectMsgLength === 0 || isUpdating}
                        >
                            Mark as Read
                        </button>
                        <button className={`${styles.unreadMarkBtn}
                            ${(selectMsgLength === 0 || isUpdating) && styles.markBtnDisabled}`}
                            onClick={() => handleBulkMarkAsRead(false)}
                            disabled={selectMsgLength === 0 || isUpdating}
                        >
                            Mark as Unread
                        </button>
                        <button className={`${styles.deleteMarkBtn}
                            ${(selectMsgLength === 0 || isDeleting) && styles.markBtnDisabled}`}
                            onClick={() => handleBulkDelete()}
                            disabled={selectMsgLength === 0 || isDeleting}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </section>

            {/* Filters and Search */}
            <section className={"cardContainer p-4"}>
                <div className={styles.filterSearchContainer}>
                    {/* Search */}
                    <div className={`${styles.searchBox} flex-1 max-w-lg`}>
                        <div className={styles.searchIcon}>
                            <LuMailSearch />
                        </div>
                        <input type="text"
                            placeholder="Search messages by name, email, or content..."
                            {...filterRegister("search")}
                        />
                        <button className={styles.clearIcon}>
                            <MdOutlineCleaningServices />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className={styles.filter}>
                        <select {...filterRegister("status")} className={styles.filterByRead}>
                            <option value="all">All Messages</option>
                            <option value="read">Read</option>
                            <option value="unread">Unread</option>
                            <option value="replied">Replied</option>
                        </select>

                        {isLoadingProjectTypes ? (
                            <div className="w-100 line-height-1">
                                <LoadingSpinner text="Loading project types..." />
                            </div>
                        ) : (
                            <select {...filterRegister("prType")} className={styles.filterByType}>
                                <option value="all">All Project Types</option>
                                {fetchProjectTypes?.data.map((type) => (
                                    <option key={type._id} value={type._id}>{type.name}</option>
                                ))}
                            </select>
                        )}

                        <select {...filterRegister("sortBy")} className={styles.filterByType}>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="nameAsc">Name (A-Z) (a-z)</option>
                            <option value="nameDesc">Name (Z-A) (z-a)</option>
                            <option value="emailAsc">Email (A-Z) (a-z)</option>
                            <option value="emailDesc">Email (Z-A) (z-a)</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Messages List */}
            <section className="cardContainer">
                {isLoadingMsg && <LoadingSpinner size="lg" text="Loading messages..." />}
                {fetchMessages?.data.msgList.length === 0 ? (
                    <div className={`${styles.msgNotFound} px-6 py-12 text-center`}>
                        <LuMessageSquareText />
                        <h3>Messages not found</h3>
                        <p>Messages from your contact form will appear here.</p>
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="sectionHeader">
                            <div className="sectionHeading">
                                <TiMessages className="sectionIcon" />
                                <h2>Messages</h2>
                            </div>
                            <div className={styles.selectAllContainer}>
                                <span>Select All</span>
                                <input type="checkbox"
                                    className={styles.selectAllCheckbox}
                                    {...selectRegister("selectAllMessages", {
                                        onChange: handleAllSelectMessages
                                    })}
                                />
                            </div>
                        </div>

                        {/* Messages */}
                        {fetchMessages?.data.msgList.map((message) => (
                            <div key={message._id} className={styles.messageContainer}>
                                <div className="relative d-flex a-start">
                                    {/* Message Content */}
                                    <div className={styles.singleMessage}>
                                        <div className={styles.messageMeta}>
                                            <div className="d-flex a-center gap-2">
                                                <h3>{message.name}</h3>
                                                <span className={`${styles.statusBadge}
                                                ${!message.isRead && styles.unread}`}
                                                >
                                                    {message.isRead ? 'Read' : 'Unread'}
                                                </span>
                                            </div>
                                            {/* Select Checkbox */}
                                            <input type="checkbox" value={message._id}
                                                className={styles.messageCheckbox}
                                                {...selectRegister("selectedCheckIds")}
                                            />
                                        </div>
                                        <div className={styles.messageMeta}>
                                            <p className={styles.senderEmail}>{message.email}</p>
                                            <span className={styles.receiveTime}>
                                                {format(new Date(message.createdAt),
                                                    'h:mm a')}
                                            </span>
                                        </div>
                                        <div className={styles.messageMeta}>
                                            <p className={styles.messageSnippet}>
                                                {createSnippet(message.message, 100)}
                                            </p>
                                            <span className={styles.receiveDate}>
                                                {format(new Date(message.createdAt),
                                                    'MMM dd, yyyy')}
                                            </span>
                                        </div>

                                        {/* Action buttons */}
                                        <div className={styles.messageActionBtn}>
                                            <Link to={`../messageView/${message._id}`}
                                                className={styles.messageView}
                                            >
                                                View
                                            </Link>

                                            <button className={styles.messageReadBtn}
                                                onClick={() =>
                                                    handleMarkAsRead(message._id, !message.isRead)}
                                            >
                                                {message.isRead ? "Mark as Unread" : "Mark as Read"}
                                            </button>

                                            <button className={styles.messageDeleteBtn}
                                                onClick={() => handleDeleteMessage(message._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </section>

            {/* Pagination */}
            {fetchMessages?.data.pagination.totalPages > 1 && (
                <section className={"cardContainer p-4"}>
                    {isLoadingMsg ? (
                        <LoadingSpinner />
                    ) : (
                        <Pagination
                            pageCount={fetchMessages?.data.pagination.totalPages}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={fetchMessages?.data.pagination.totalMsg}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </section>
            )}
        </>
    )
}

export default Messages;