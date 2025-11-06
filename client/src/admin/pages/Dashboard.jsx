import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { LiaMailBulkSolid } from 'react-icons/lia';
import {
    BsEnvelopeOpen,
    BsCalendar4Week
} from 'react-icons/bs';
import {
    LuUserRound,
    LuMessageSquareMore,
    LuMessageSquareText
} from 'react-icons/lu';
import {
    MdOutlineToday,
    MdOutlineCalendarMonth,
    MdOutlineMarkUnreadChatAlt
} from 'react-icons/md';
import { TbMessage2Plus } from 'react-icons/tb';
import { VscGithubAction } from 'react-icons/vsc';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useGetTodayMsgStatsQuery } from '../../../store/api/messageApiSlice';
import styles from "./styles/Dashboard.module.css"

const Dashboard = () => {

    const { data: messageStats, isLoading, error } = useGetTodayMsgStatsQuery();

    const statCards = [
        {
            title: 'Read Messages',
            value: messageStats?.data.readMsg || 0,
            icon: <BsEnvelopeOpen />,
            iconColor: styles.readStatIconColor,
        },
        {
            title: 'Unread Messages',
            value: messageStats?.data.unreadMsg || 0,
            icon: <MdOutlineMarkUnreadChatAlt />,
            iconColor: styles.unreadStatIconColor,
        },
        {
            title: 'Total Messages',
            value: messageStats?.data.totalMsg || 0,
            icon: <LiaMailBulkSolid />,
            iconColor: styles.totalStatIconColor,
        },
        {
            title: 'Today',
            value: messageStats?.data.todayMsg || 0,
            icon: <MdOutlineToday />,
            iconColor: styles.todayStatIconColor,
        },
        {
            title: 'This Week',
            value: messageStats?.data.thisWeekMsg || 0,
            icon: <BsCalendar4Week />,
            iconColor: styles.thisWeekStatIconColor,
        },
        {
            title: 'This Month',
            value: messageStats?.data.thisMonthMsg || 0,
            icon: <MdOutlineCalendarMonth />,
            iconColor: styles.thisMonthStatIconColor,
        },
    ];

    if(error) {
        return <div>Error loading data</div>;
    }

    return (
        <>
            {/* Header */}
            <section className="pageHeader">
                <h1>Dashboard</h1>
                <p>Overview of your contact form activity</p>
            </section>

            {/* Status Grid */}
            <section className={styles.statusCards}>
                {statCards.map((stat, index) => (
                    <div key={index} className={styles.statusCard}>
                        <div className={styles.statusCardContent}>
                            <div className={`${stat.iconColor} ${styles.statIcon}`}>
                                {stat.icon}
                            </div>
                            <div className={styles.statContent}>
                                <p className={styles.title}>{stat.title}</p>
                                <p className={styles.value}>{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Recent Messages */}
            <section className="cardContainer">
                <div className="sectionHeader">
                    <div className="sectionHeading">
                        <TbMessage2Plus className="sectionIcon" />
                        <h2>Recent Messages</h2>
                    </div>
                </div>
                <div>
                    {isLoading && <LoadingSpinner size="lg" />}
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
            </section>

            {/* Quick Actions */}
            <section className="cardContainer">
                <div className="sectionHeader">
                    <div className="sectionHeading">
                        <VscGithubAction className="sectionIcon" />
                        <h2>Quick Actions</h2>
                    </div>
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
        </>
    )
}

export default Dashboard;