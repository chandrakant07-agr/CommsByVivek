import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { LiaMailBulkSolid } from 'react-icons/lia';
import { BsCalendar4Week, BsEnvelopeOpen } from 'react-icons/bs';
import { LuMessageSquareMore, LuMessageSquareText, LuUserRound } from 'react-icons/lu';
import { MdOutlineCalendarMonth, MdOutlineMarkUnreadChatAlt, MdOutlineToday } from 'react-icons/md';
import { useGetTodayMsgStatsQuery } from '../../../store/api/messageApiSlice';
import styles from "./styles/Dashboard.module.css"

const Dashboard = () => {

    const { data: messageStats, isLoading, error } = useGetTodayMsgStatsQuery();

    const statCards = [
        {
            title: 'Read Messages',
            value: messageStats?.data.readMsg || 0,
            icon: <BsEnvelopeOpen />,
            bgColor: 'bg-red-50',
        },
        {
            title: 'Unread Messages',
            value: messageStats?.data.unreadMsg || 0,
            icon: <MdOutlineMarkUnreadChatAlt />,
            bgColor: 'bg-red-50',
        },
        {
            title: 'Total Messages',
            value: messageStats?.data.totalMsg || 0,
            icon: <LiaMailBulkSolid />,
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Today',
            value: messageStats?.data.todayMsg || 0,
            icon: <MdOutlineToday />,
            bgColor: 'bg-green-50',
        },
        {
            title: 'This Week',
            value: messageStats?.data.thisWeekMsg || 0,
            icon: <BsCalendar4Week />,
            bgColor: 'bg-purple-50',
        },
        {
            title: 'This Month',
            value: messageStats?.data.thisMonthMsg || 0,
            icon: <MdOutlineCalendarMonth />,
            bgColor: 'bg-green-50',
        },
    ];

    if(isLoading) {
        return <div>Loading...</div>;
    }

    if(error) {
        return <div>Error loading data</div>;
    }

    return (
        <div>
            {/* Header */}
            <section className={styles.dashboardHeader}>
                <h1>Dashboard</h1>
                <p>Overview of your contact form activity</p>
            </section>

            {/* Status Grid */}
            <section className={styles.statusCards}>
                {statCards.map((stat, index) => (
                    <div key={index} className={styles.statusCard}>
                        <div className={`d-flex a-center`}>
                            <div className={`${stat.bgColor} ${styles.statIcon}`}>
                                {stat.icon}
                            </div>
                            <div className={`${styles.statContent} ml-4`}>
                                <p className={styles.title}>{stat.title}</p>
                                <p className={styles.value}>{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Recent Messages */}
            <section className={styles.recentMsg}>
                <div className={styles.recentMsgHeader}>
                    <h2>Recent Messages</h2>
                </div>
                <div>
                    {messageStats?.data.todayMsgList.length === 0 ? (
                        <div className={`${styles.msgNotFound} px-6 py-8 text-center`}>
                            <LuMessageSquareText />
                            <h3>No messages found</h3>
                            <p>Messages from your contact form will appear here.</p>
                        </div>
                    ) : (<>
                        {messageStats?.data.todayMsgList.map((message) => (
                            <div key={message._id} className={`${styles.receivedMsg} px-6 py-4`}>
                                <div className="d-flex a-center justify-between">
                                    <div className="d-flex a-center">
                                        <div className={`${styles.msgIsRead}
                                            ${message.isRead ? styles.yes : styles.no}`}
                                        />
                                        <div className="ml-3">
                                            <p className={styles.senderName}>{message.name}</p>
                                            <p className={styles.senderEmail}>{message.email}</p>
                                        </div>
                                    </div>
                                    <div className={styles.textRight}>
                                        <p className={styles.sendDate}>
                                            {format(new Date(message.createdAt), 'MMM dd, yyyy')}
                                        </p>
                                        <p className={styles.sendTime}>
                                            {format(new Date(message.createdAt), 'h:mm a')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className={styles.viewAllMsg}>
                            <Link to="../messages">
                                View all messages →
                            </Link>
                        </div>
                    </>
                    )}
                </div>
                {/* {recentMessages.length > 0 && (
                    <div className={styles.viewAllMsg}>
                        <Link to="../messages">
                            View all messages →
                        </Link>
                    </div>
                )} */}
            </section>

            {/* Quick Actions */}
            <section className={styles.quickActions}>
                <div className={styles.quickActionsHeader}>
                    <h2>Quick Actions</h2>
                </div>
                <div className={styles.quickCards}>
                    <Link to="../messages" className={styles.quickCard}>
                        <LuMessageSquareMore />
                        <div>
                            <p className={styles.title}>View Messages</p>
                            <p className={styles.subTitle}>Manage all contact form submissions</p>
                        </div>
                    </Link>

                    <Link to="../messages/unread" className={styles.quickCard}>
                        <MdOutlineMarkUnreadChatAlt />
                        <div>
                            <p className={styles.title}>Unread Messages</p>
                            <p className={styles.subTitle}>View messages that need attention</p>
                        </div>
                    </Link>

                    <Link to="../profile" className={styles.quickCard}>
                        <LuUserRound />
                        <div>
                            <p className={styles.title}>Profile Settings</p>
                            <p className={styles.subTitle}>Update your account information</p>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default Dashboard;