import React from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import styles from "./styles/Message.module.css"

const Messages = () => {

    const pagination = { totalPages: 5, total: 42 }; // Example pagination data
    const currentPage = 1; // Example current page
    const filteredMessages = []; // Example filtered messages
    const selectedMessages = []; // Example selected messages
    const searchTerm = ""; // Example search term
    const statusFilter = "all"; // Example status filter
    const sortBy = "newest"; // Example sort by

    const message = {
        _id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        message: "Hello, I would like to inquire about your services.",
        createdAt: "2023-03-15T12:34:56Z",
        isRead: false,
        isReplied: true
    }; // Example message object

    const markAsReadMutation = { isLoading: false }; // Example mutation state
    const deleteMessageMutation = { isLoading: false }; // Example mutation state

    const handleBulkMarkAsRead = (isRead) => {
        // Handle bulk mark as read/unread
    };

    const handleSearchChange = (value) => {
        // Handle search input change
    };

    const handleStatusChange = (value) => {
        // Handle status filter change
    };

    const handleSortChange = (value) => {
        // Handle sort by change
    };

    const handleSelectAll = () => {
        // Handle select all messages
    };

    const handleSelectMessage = (id) => {
        // Handle select individual message
    };

    const getStatusBadge = (message) => {
        if (message.isReplied) {
            return <span className={styles.statusBadge}>Replied</span>;
        } else if (!message.isRead) {
            return <span className={styles.statusBadge}>Unread</span>;
        } else {
            return <span className={styles.statusBadge}>Read</span>;
        }
    };

    const handleMarkAsRead = (id, isRead) => {
        // Handle mark as read/unread for individual message
    };

    const handleDeleteMessage = (id) => {
        // Handle delete message
    };

    const updateFilters = (newFilters) => {
        // Update filters and fetch messages
    };

    return (
        <div>
            {/* Header */}
            <section className={styles.messagesHeader}>
                <div>
                    <h1>Messages</h1>
                    <p>Manage all contact form submissions</p>
                </div>
                <div className={styles.messagesMark}>
                    <span>
                        {pagination.total || 0} total messages
                    </span>
                    {selectedMessages.length > 0 && (
                        <div className={styles.markActions}>
                            <span>
                                {selectedMessages.length} selected
                            </span>
                            <button
                                onClick={() => handleBulkMarkAsRead(true)}
                                className={styles.readMarkBtn}
                            >
                                Mark as Read
                            </button>
                            <button
                                onClick={() => handleBulkMarkAsRead(false)}
                                className={styles.unreadMarkBtn}
                            >
                                Mark as Unread
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Filters and Search */}
            <section className={styles.filterSearch}>
                <div className={styles.filterSearchContainer}>
                    {/* Search */}
                    <div className={`${styles.search} flex-1 max-w-lg`}>
                        <div className="relative">
                            <div className={styles.searchIcon}>
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search messages by name, email, or content..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className={styles.filter}>
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className={styles.filterByRead}
                        >
                            <option value="all">All Messages</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className={styles.filterByType}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name A-Z</option>
                            <option value="email">Email A-Z</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Messages List */}
            <section className={styles.messagesList}>
                {filteredMessages.length !== 0 ? (
                    <div className={`${styles.msgNotFound} px-6 py-12 text-center`}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3>No messages found</h3>
                        <p>
                            Messages from your contact form will appear here.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className={styles.msgSelectAll}>
                            <div className="d-flex a-center">
                                <input
                                    type="checkbox"
                                    checked={selectedMessages.length === filteredMessages.length}
                                    onChange={handleSelectAll}
                                />
                                <span>
                                    Select All
                                </span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div>
                            {/* {filteredMessages.map((message) => ( */}
                            <div key={message._id} className={styles.msgContainer}>
                                <div className="d-flex a-start">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selectedMessages.includes(message._id)}
                                        onChange={() => handleSelectMessage(message._id)}
                                    />

                                    {/* Read status indicator */}
                                    <div className={styles.readStatus}>
                                        <div className={`${styles.msgIsRead} ${message.isRead ? styles.yes : styles.no}`} />
                                    </div>

                                    {/* Message Content */}
                                    <div className={styles.msgContent}>
                                        <div className="d-flex a-center justify-between">
                                            <div className="d-flex a-center">
                                                <h3>{message.name}</h3>
                                                {getStatusBadge(message)}
                                            </div>
                                            <div className="d-flex a-center">
                                                <span className={styles.receiveDate}>
                                                    {format(new Date(message.createdAt), 'MMM dd, yyyy')}
                                                </span>
                                                <span className={styles.receiveTime}>
                                                    {format(new Date(message.createdAt), 'h:mm a')}
                                                </span>
                                            </div>
                                        </div>

                                        <p className={styles.senderEmail}>{message.email}</p>
                                        <p className={styles.emailMessage}>{message.message}</p>

                                        {/* Action buttons */}
                                        <div className={`${styles.mailActionBtn} mt-3 d-flex a-center`}>
                                            <Link
                                                to={`/messages/${message._id}`}
                                                className={styles.mailView}
                                            >
                                                View Details
                                            </Link>

                                            <button
                                                onClick={() => handleMarkAsRead(message._id, !message.isRead)}
                                                className={styles.markReadBtn}
                                                disabled={markAsReadMutation.isLoading}
                                            >
                                                {message.isRead ? 'Mark as Unread' : 'Mark as Read'}
                                            </button>

                                            <button
                                                onClick={() => handleDeleteMessage(message._id)}
                                                className={styles.mailDeleteBtn}
                                                disabled={deleteMessageMutation.isLoading}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ))} */}
                        </div>
                    </>
                )}
            </section>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <section className={styles.pagination}>
                    <div className="d-flex a-center justify-between">
                        <div className={styles.totalPages}>
                            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.total)} of {pagination.total} results
                        </div>

                        <div className={`${styles.paginationBtns} d-flex a-center`}>
                            <button
                                onClick={() => {
                                    const newPage = currentPage - 1;
                                    setCurrentPage(newPage);
                                    updateFilters({ search: searchTerm, status: statusFilter, sortBy, page: newPage });
                                }}
                                disabled={currentPage === 1}
                                className={styles.prevBtn}
                            >
                                Previous
                            </button>

                            {/* Page numbers */}
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                .filter(page => {
                                    if (pagination.totalPages <= 7) return true;
                                    if (page === 1 || page === pagination.totalPages) return true;
                                    if (Math.abs(page - currentPage) <= 1) return true;
                                    return false;
                                })
                                .map((page, index, array) => {
                                    const prevPage = array[index - 1];
                                    const showEllipsis = prevPage && page - prevPage > 1;

                                    return (
                                        <React.Fragment key={page}>
                                            {showEllipsis && (
                                                <span className={styles.ellipsis}>...</span>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setCurrentPage(page);
                                                    updateFilters({ search: searchTerm, status: statusFilter, sortBy, page });
                                                }}
                                                className={`${styles.pageBtn} ${page === currentPage
                                                    ? 'bg-primary-500 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        </React.Fragment>
                                    );
                                })}

                            <button
                                onClick={() => {
                                    const newPage = currentPage + 1;
                                    setCurrentPage(newPage);
                                    updateFilters({ search: searchTerm, status: statusFilter, sortBy, page: newPage });
                                }}
                                disabled={currentPage === pagination.totalPages}
                                className={styles.nextBtn}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default Messages;