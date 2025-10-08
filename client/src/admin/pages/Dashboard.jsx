import { format } from 'date-fns';
import styles from "./styles/Dashboard.module.css"

const Dashboard = () => {

    const stats = {
        total: 120,
        unread: 15,
        monthly: 30,
        weekly: 10,
    };

    const recentMessages = [
        {
            _id: '1',
            name: 'John Doe',
            email: 'hello@gial.com',
            isRead: false,
            createdAt: '2024-06-20T10:30:00Z',
        },
        {
            _id: '2',
            name: 'Jane Smith',
            email: 'djsj@dks.ds`',
            isRead: true,
            createdAt: '2024-06-21T12:00:00Z',
        },
    ];

    const statCards = [
        {
            title: 'Total Messages',
            value: stats.total || 0,
            icon: (
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Unread Messages',
            value: stats.unread || 0,
            icon: (
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            ),
            bgColor: 'bg-red-50',
        },
        {
            title: 'This Month',
            value: stats.monthly || 0,
            icon: (
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            bgColor: 'bg-green-50',
        },
        {
            title: 'This Week',
            value: stats.weekly || 0,
            icon: (
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            bgColor: 'bg-purple-50',
        },
    ];

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
                <div className={styles.header}>
                    <h2>Recent Messages</h2>
                </div>
                <div>
                    {recentMessages.length === 0 ? (
                        <div className={`${styles.msgNotFound} px-6 py-8 text-center`}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <h3>No messages found</h3>
                            <p>
                                Messages from your contact form will appear here.
                            </p>
                        </div>
                    ) : (
                        recentMessages.map((message) => (
                            <div key={message._id} className={`${styles.receivedMsg} px-6 py-4`}>
                                <div className="d-flex a-center justify-between">
                                    <div className="d-flex a-center">
                                        <div className={`${styles.msgIsRead} ${message.isRead ? styles.yes : styles.no}`} />
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
                        ))
                    )}
                </div>
                {recentMessages.length > 0 && (
                    <div className={styles.viewAllMsg}>
                        <a href="/messages">
                            View all messages →
                        </a>
                    </div>
                )}
            </section>

            {/* Quick Actions */}
            <section className={`${styles.quickActions} p-6`}>
                <h2>Quick Actions</h2>
                <div className={styles.quickCards}>
                    <a href="/messages" className={styles.quickCard}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                            <p className={styles.title}>View Messages</p>
                            <p className={styles.subTitle}>Manage all contact form submissions</p>
                        </div>
                    </a>

                    <a href="/messages?status=unread" className={styles.quickCard}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <p className={styles.title}>Unread Messages</p>
                            <p className={styles.subTitle}>View messages that need attention</p>
                        </div>
                    </a>

                    <a href="/profile" className={styles.quickCard}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                            <p className={styles.title}>Profile Settings</p>
                            <p className={styles.subTitle}>Update your account information</p>
                        </div>
                    </a>
                </div>
            </section>
        </div>
    )
}

export default Dashboard;