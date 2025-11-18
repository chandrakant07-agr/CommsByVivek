import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserShield, FaEnvelope } from 'react-icons/fa';
import { MdSecurity, MdDescription, MdPrivacyTip, MdCookie } from 'react-icons/md';
import { useGetContactDetailsQuery } from '../../store/api/contactDetailsApiSlice';
import styles from './styles/PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
    const { data: getContactDetails } = useGetContactDetailsQuery();
    const lastUpdated = "November 17, 2025";

    const sections = [
        {
            icon: <MdDescription />,
            title: "Information We Collect",
            content: [
                {
                    subtitle: "Personal Information",
                    text: "When you interact with our website through the contact form or provide testimonials/ratings, we collect:"
                },
                {
                    list: [
                        "Your full name",
                        "Email address",
                        "Phone number (optional)",
                        "Project details and requirements",
                        "Feedback, ratings, and testimonials",
                        "Any other information you choose to provide"
                    ]
                },
                {
                    subtitle: "Automatic Information",
                    text: "We may automatically collect certain technical information such as browser type, device information, and IP address for analytics and security purposes."
                }
            ]
        },
        {
            icon: <MdPrivacyTip />,
            title: "How We Use Your Information",
            content: [
                {
                    text: "We use the collected information solely for the following purposes:"
                },
                {
                    list: [
                        "To respond to your inquiries and communicate about projects",
                        "To provide quotes, proposals, and project updates",
                        "To showcase client testimonials and feedback on our portfolio (with your consent)",
                        "To improve our services and website experience",
                        "To send important notifications about your projects",
                        "To maintain business records and project documentation"
                    ]
                },
                {
                    highlight: "We do NOT sell, rent, or share your personal information with third parties for marketing purposes."
                }
            ]
        },
        {
            icon: <FaShieldAlt />,
            title: "Data Protection & Security",
            content: [
                {
                    text: "We take the security of your personal information seriously and implement appropriate measures to protect it:"
                },
                {
                    list: [
                        "Secure data transmission using industry-standard encryption",
                        "Limited access to personal information by authorized personnel only",
                        "Regular security assessments and updates",
                        "Secure storage of client data and project files"
                    ]
                },
                {
                    text: "While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but maintain best practices to safeguard your data."
                }
            ]
        },
        {
            icon: <MdCookie />,
            title: "Cookies & Tracking Technologies",
            content: [
                {
                    text: "Our website may use cookies and similar technologies to enhance your browsing experience:"
                },
                {
                    list: [
                        "Essential cookies for website functionality",
                        "Analytics cookies to understand website usage and improve services",
                        "Preference cookies to remember your settings (e.g., dark/light mode)"
                    ]
                },
                {
                    text: "You can control cookie preferences through your browser settings. Note that disabling certain cookies may affect website functionality."
                }
            ]
        },
        {
            icon: <FaUserShield />,
            title: "Your Rights & Choices",
            content: [
                {
                    text: "You have the following rights regarding your personal information:"
                },
                {
                    list: [
                        "Access: Request a copy of the personal information we hold about you",
                        "Correction: Request correction of inaccurate or incomplete information",
                        "Deletion: Request deletion of your personal information (subject to legal obligations)",
                        "Opt-out: Unsubscribe from marketing communications at any time",
                        "Testimonial Removal: Request removal of your testimonial from our portfolio"
                    ]
                }
            ]
        },
        {
            icon: <FaEnvelope />,
            title: "Third-Party Services",
            content: [
                {
                    text: "Our website may use third-party services for specific functionalities:"
                },
                {
                    list: [
                        "Cloud storage providers for media hosting (e.g., Cloudinary)",
                        "Analytics services to understand website traffic",
                        "Email service providers for communication"
                    ]
                },
                {
                    text: "These services have their own privacy policies, and we encourage you to review them. We ensure that all third-party providers maintain appropriate data protection standards."
                }
            ]
        },
        {
            icon: <MdSecurity />,
            title: "Client Testimonials & Portfolio Display",
            content: [
                {
                    text: "When you provide testimonials or ratings:"
                },
                {
                    list: [
                        "Your feedback may be displayed on our website and marketing materials",
                        "We will use your name and company name (if provided) alongside your testimonial",
                        "Project images may be showcased in our portfolio (with your explicit consent)",
                        "You can request removal or modification of your testimonial at any time"
                    ]
                },
                {
                    highlight: "We respect your privacy and will not display any sensitive or confidential project information without your explicit permission."
                }
            ]
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="heroSection">
                <motion.div
                    className="heroContent"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <motion.div
                        className={styles.heroIcon}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <MdSecurity />
                    </motion.div>

                    <motion.h1
                        className="heroTitle"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        Privacy Policy
                    </motion.h1>
                    <div className="separatorHeroTitle"></div>

                    <motion.p
                        className="heroDescription"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Your privacy matters to us. Learn how we collect, use, and protect your personal information.
                    </motion.p>

                    <motion.p
                        className={styles.lastUpdated}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        Last Updated: {lastUpdated}
                    </motion.p>
                </motion.div>
            </section>

            {/* Introduction */}
            <section className={styles.introSection}>
                <motion.div
                    className={styles.introContent}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <p>
                        Welcome to <strong>CommsByVivek</strong>. We are committed to protecting your privacy and ensuring transparency about how we handle your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights regarding your information.
                    </p>
                    <p>
                        As a professional filmmaker and photographer, we work closely with clients and value the trust you place in us. This policy applies to all visitors and clients who interact with our website, services, and portfolio.
                    </p>
                </motion.div>
            </section>

            {/* Policy Sections */}
            <section className={styles.policySections}>
                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        className={styles.policyCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <div className={styles.cardHeader}>
                            <div className={styles.cardIcon}>
                                {section.icon}
                            </div>
                            <h2>{section.title}</h2>
                        </div>

                        <div className={styles.cardContent}>
                            {section.content.map((item, idx) => (
                                <div key={idx} className={styles.contentBlock}>
                                    {item.subtitle && (
                                        <h3 className={styles.subtitle}>{item.subtitle}</h3>
                                    )}
                                    {item.text && (
                                        <p className={styles.text}>{item.text}</p>
                                    )}
                                    {item.list && (
                                        <ul className={styles.list}>
                                            {item.list.map((listItem, listIdx) => (
                                                <li key={listIdx}>{listItem}</li>
                                            ))}
                                        </ul>
                                    )}
                                    {item.highlight && (
                                        <div className={styles.highlight}>
                                            <MdSecurity className={styles.highlightIcon} />
                                            <p>{item.highlight}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Data Retention Section */}
            <section className={styles.dataRetentionSection}>
                <motion.div
                    className={styles.retentionCard}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2>Data Retention</h2>
                    <p>
                        We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy or as required by law. Client project data and communication records are typically retained for:
                    </p>
                    <ul>
                        <li>Active projects: Duration of the project plus 2 years for portfolio and reference purposes</li>
                        <li>Inquiries without engagement: Up to 1 year for potential future collaboration</li>
                        <li>Testimonials: Indefinitely (unless you request removal)</li>
                    </ul>
                    <p>
                        You may request deletion of your information at any time by contacting us.
                    </p>
                </motion.div>
            </section>

            {/* Changes to Policy */}
            <section className={styles.changesSection}>
                <motion.div
                    className={styles.changesCard}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2>Changes to This Privacy Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by:
                    </p>
                    <ul>
                        <li>Updating the "Last Updated" date at the top of this policy</li>
                        <li>Sending an email notification to active clients (for significant changes)</li>
                        <li>Displaying a prominent notice on our website</li>
                    </ul>
                    <p>
                        We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
                    </p>
                </motion.div>
            </section>

            {/* Contact Section */}
            <section className={styles.contactSection}>
                <motion.div
                    className={styles.contactCard}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.contactHeader}>
                        <FaEnvelope className={styles.contactIcon} />
                        <h2>Questions About Privacy?</h2>
                    </div>
                    <p>
                        If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal information, please don't hesitate to contact us:
                    </p>
                    <div className={styles.contactDetails}>
                        <div className={styles.contactItem}>
                            <strong>Email:</strong>
                            <a href={`mailto:${getContactDetails?.data.contactDetails?.email}`}>
                                {getContactDetails?.data.contactDetails?.email || 'contact@commsbyvivek.com'}
                            </a>
                        </div>
                        <div className={styles.contactItem}>
                            <strong>Phone:</strong>
                            <a href={`tel:${getContactDetails?.data.contactDetails?.phone}`}>
                                {getContactDetails?.data.contactDetails?.phone || '+91 XXX XXX XXXX'}
                            </a>
                        </div>
                    </div>
                    <p className={styles.responseTime}>
                        We will respond to all privacy-related inquiries within 48 hours.
                    </p>
                </motion.div>
            </section>

            {/* Footer Note */}
            <section className={styles.footerNote}>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    By using our website and services, you acknowledge that you have read and understood this Privacy Policy.
                </motion.p>
            </section>
        </>
    );
};

export default PrivacyPolicy;
