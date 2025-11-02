import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import ReactPaginate from "react-paginate";
import { format } from "date-fns";
import { MdOutlineCleaningServices } from "react-icons/md";
import { LuMailSearch, LuMessageSquareText } from "react-icons/lu";
import { useGetProjectTypesQuery } from "../../../store/api/projectTypeApiSlice";
import {
    useDeleteMessageMutation,
    useGetMessagesQuery,
    useUpdateStatusMutation
} from "../../../store/api/messageApiSlice";
import styles from "./styles/Message.module.css"
import { toast } from "react-toastify";

const Messages = () => {
    const { status: urlStatus } = useParams();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { register: filterRegister, watch: filterWatch } = useForm();
    const { register: selectRegister, watch: selectWatch, reset: resetSelect } = useForm({
        defaultValues: { selectAllMessages: false, selectedCheckIds: [] }
    });

    const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
    const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();
    const { data: fetchProjectTypes } = useGetProjectTypesQuery();
    const { data: fetchMessages, isLoading: isMgsLoading, isError: isMsgError } = useGetMessagesQuery({
        search: filterWatch("search") || "",
        status: filterWatch("status") || urlStatus || "all",
        prType: filterWatch("prType") || "all",
        sortBy: filterWatch("sortBy") || "newest",
        pageNo: currentPage || 1,
        limit: itemsPerPage
    });

    const selectMsgLength = selectWatch("selectedCheckIds").length;

    const handleAllSelectMessages = () => {
        const allIds = fetchMessages?.data.msgList.map(m => m._id) || [];

        if(selectMsgLength === allIds.length) {
            resetSelect({selectedCheckIds: []});         // Uncheck all
        } else {
            resetSelect({selectedCheckIds: allIds});     // Check all
        }
    }

    const handleBulkMarkAsRead = (isRead) => updateStatus({ 
        ids: selectWatch("selectedCheckIds"), isRead
     });

    const handleMarkAsRead = (id, isRead) => updateStatus({ ids: [id], isRead });

    const handleDeleteMessage = async(id) => {
        if (window.confirm("Are you sure you want to delete this message?")) {
            try {
                await deleteMessage({ ids: [id] }).unwrap();
            } catch (error) {
                toast.error("Failed to delete message. Please try again.");
            }
        }
    }

    const handleBulkDelete = async() => {
        if (window.confirm("Are you sure you want to delete the selected messages?")) {
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

    // set selectedCheckIds to empty array when messages change
    useEffect(() => {
        resetSelect({
            selectAllMessages: false,
            selectedCheckIds: []
        });
    }, [fetchMessages, resetSelect]);

    if(isMgsLoading) {
        return <p>Loading...</p>
    }

    if(isMsgError) {
        return <p>Something went wrong. Please try again later.</p>
    }

    return (
        <>
            {/* Header */}
            <section className={styles.messagesHeader}>
                <div>
                    <h1>Messages</h1>
                    <p>Manage all contact form submissions</p>
                </div>
                <div className={styles.messagesMark}>
                    <span>
                        {fetchMessages?.data.pagination.totalMsg || 0} total messages
                    </span>
                    <div className={styles.markActions}>
                        <span>
                            {selectMsgLength} selected
                        </span>
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
                        <button className={`${styles.unreadMarkBtn}
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
            <section className={styles.filterSearch}>
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

                        <select {...filterRegister("prType")} className={styles.filterByType}>
                            <option value="all">All Project Types</option>
                            {fetchProjectTypes?.data.map((type) => (
                                <option key={type._id} value={type._id}>{type.name}</option>
                            ))}
                        </select>

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
            <section className={styles.messagesList}>
                {fetchMessages?.data.msgList.length === 0 ? (
                    <div className={`${styles.msgNotFound} px-6 py-12 text-center`}>
                        <LuMessageSquareText />
                        <h3>Messages not found</h3>
                        <p>Messages from your contact form will appear here.</p>
                    </div>
                ) : (<>
                    {/* Table Header */}
                    <div className={styles.msgSelectAll}>
                        <div className="d-flex a-center">
                            <input type="checkbox"
                                {...selectRegister("selectAllMessages", {
                                    onChange: handleAllSelectMessages
                                })}
                            />
                            <span>Select All</span>
                        </div>
                    </div>

                    {/* Messages */}
                    {fetchMessages?.data.msgList.map((message) => (
                        <div key={message._id} className={styles.msgContainer}>
                            <div className="d-flex a-start">
                                {/* Checkbox */}
                                <input type="checkbox" value={message._id}
                                    {...selectRegister("selectedCheckIds")}
                                />

                                {/* Read status indicator */}
                                <div className={styles.readStatus}>
                                    <div className={`${styles.msgIsRead}
                                            ${message.isRead ? styles.yes : styles.no}`
                                    } />
                                </div>

                                {/* Message Content */}
                                <div className={styles.msgContent}>
                                    <div className="d-flex a-center justify-between">
                                        <div className="d-flex a-center">
                                            <h3>{message.name}</h3>
                                            <span className={styles.statusBadge}>
                                                {message.isRead ? 'Read' : 'Unread'}
                                            </span>
                                        </div>
                                        <div className="d-flex a-center">
                                            <span className={styles.receiveDate}>
                                                {format(new Date(message.createdAt),
                                                    'MMM dd, yyyy')}
                                            </span>
                                            <span className={styles.receiveTime}>
                                                {format(new Date(message.createdAt),
                                                    'h:mm a')}
                                            </span>
                                        </div>
                                    </div>

                                    <p className={styles.senderEmail}>{message.email}</p>
                                    <p className={styles.emailMessage}>
                                        {createSnippet(message.message, 100)}
                                    </p>

                                    {/* Action buttons */}
                                    <div className={`${styles.mailActionBtn} mt-3 d-flex a-center`}>
                                        <Link
                                            to={`../messageView/${message._id}`}
                                            className={styles.mailView}
                                        >
                                            View Details
                                        </Link>

                                        <button className={styles.markReadBtn}
                                            onClick={() => 
                                                handleMarkAsRead(message._id, !message.isRead)}
                                        >
                                            {message.isRead ? "Mark as Unread" : "Mark as Read"}
                                        </button>

                                        <button className={styles.mailDeleteBtn}
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
                <section className={styles.pagination}>
                    <div className="d-flex a-center justify-between">
                        <div className={styles.totalPages}>
                            {`Showing ${((currentPage - 1) * 10) + 1} 
                            to ${Math.min(currentPage * 10, fetchMessages?.data.pagination.totalMsg)} 
                            of ${fetchMessages?.data.pagination.totalMsg} results`}
                        </div>

                        <ReactPaginate
                            previousLabel="Previous"
                            nextLabel="Next"
                            breakLabel="..."
                            pageCount={fetchMessages?.data.pagination.totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={(data) => {
                                setCurrentPage(data.selected + 1);
                            }}
                            containerClassName={"d-flex a-center"}
                            pageClassName={styles.pageItem}
                            pageLinkClassName={styles.pageLink}
                            // previousClassName={styles.prevItem}
                            previousLinkClassName={styles.prevLink}
                            nextClassName="ml-3"
                            nextLinkClassName={styles.nextLink}
                            // breakClassName={}
                            breakLinkClassName={styles.ellipsis}
                            activeClassName={styles.activePage}
                            disabledLinkClassName={styles.disabledLink}
                            forcePage={currentPage - 1} // To keep the selected page in sync
                        />
                    </div>
                </section>
            )}
        </>
    )
}

export default Messages;