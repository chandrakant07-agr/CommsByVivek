import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { MdAlternateEmail } from 'react-icons/md';
import { FaPhone, FaClock, FaLocationArrow, } from 'react-icons/fa';
import { useSendMessageMutation } from '../../store/api/messageApiSlice';
import { useGetProjectTypesQuery } from '../../store/api/projectTypeApiSlice';
import { useGetContactDetailsQuery } from '../../store/api/contactDetailsApiSlice';
import socialPlatforms from '../constants/socialPlatforms';
import FormInputError from '../components/FormInputError';
import TinyEditor from '../components/TinyEditor';
import styles from './styles/Contact.module.css';

const Contact = () => {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm();

    const { data: projectTypes } = useGetProjectTypesQuery();
    const { data: getContactDetails } = useGetContactDetailsQuery();
    const [sendMessage, { isLoading: isMessageSending, isSuccess }] = useSendMessageMutation();

    // Clear the form if the message is successfully sent
    useEffect(() => {
        if(isSuccess) {
            reset({
                name: "",
                email: "",
                projectTypeId: "",
                message: ""
            });
        }
    }, [isSuccess, reset]);

    const contactDetails = [
        {
            label: "Email",
            icon: <MdAlternateEmail />,
            value: getContactDetails?.data.contactDetails.email
        },
        {
            label: "Phone",
            icon: <FaPhone />,
            value: getContactDetails?.data.contactDetails.phone
        },
        {
            label: "Address",
            icon: <FaLocationArrow />,
            value: getContactDetails?.data.contactDetails.address
        },
        {
            label: "Response Time",
            icon: <FaClock />,
            value: "Within 24 hours"
        }
    ];

    const platformIcons = useMemo(() => {
        return getContactDetails?.data.socialMediaLinks?.map((media) => (
            <Link to={media.url} key={media._id} target='_blank' className={`${styles.socialLink} iconStyle`}>
                {socialPlatforms.find(platform => platform.name === media.platform)?.icon}
            </Link>
        ));
    }, [getContactDetails?.data.socialMediaLinks]);

    return (
        <div className={styles.contactPage}>
            {/* Contact Content */}
            <section className={styles.contactContent}>
                <div className={styles.sectionHeader} data-aos="fade-up">
                    <h1 className="heroTitle">Contact</h1>
                    <div className="separatorHeroTitle"></div>
                </div>
                <div className={styles.contentContainer}>
                    {/* Contact Information */}
                    <motion.div
                        className={styles.contactInfo}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className={styles.infoTitle}>Let's Connect</h2>
                        <p className={styles.infoText}>
                            Whether you're looking to elevate your brand with compelling
                            commercial content or explore artistic storytelling through FilmedByVivek,
                            we're here to bring your vision to life with cinematic excellence.
                        </p>

                        <div className={styles.contactDetails}>
                            {contactDetails.map((detail, index) => (
                                <motion.div
                                    key={index}
                                    className={styles.contactItem}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className={`${styles.contactIcon} iconStyle`}>
                                        {detail.icon}
                                    </div>
                                    <div className={styles.contactText}>
                                        <h6 className={styles.contactLabel}>{detail.label}</h6>
                                        <h6 className={styles.contactValue}>{detail.value}</h6>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className={styles.socialSection}>
                            <h5 className={styles.socialTitle}>Follow Our Journey</h5>
                            <div className={styles.socialLinks}>
                                {platformIcons}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        className={styles.contactForm}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className={styles.formTitle}>Tell Us Your Story</h2>

                        <form onSubmit={handleSubmit(sendMessage)} noValidate>
                            <div className="h-18 mb-6">
                                <label htmlFor="name" className={styles.formLabel}>Full Name
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <input type="text" id="name"
                                    className={
                                        `${styles.formInput} ${errors.name && "formInputErrorBorder"}`
                                    }
                                    placeholder="Enter your full name"
                                    {
                                    ...register("name", {
                                        required: "Full name is required"
                                    })
                                    }
                                />
                                <FormInputError message={errors.name?.message} />
                            </div>

                            <div className="h-18 mb-6">
                                <label htmlFor="email" className={styles.formLabel}>Email ID
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <input type="email" id="email"
                                    className={
                                        `${styles.formInput} ${errors.email && "formInputErrorBorder"}`
                                    }
                                    placeholder="your.email@example.com"
                                    {
                                    ...register("email", {
                                        required: "Email id is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Invalid email address"
                                        }
                                    })
                                    }
                                />
                                <FormInputError message={errors.email?.message} />
                            </div>

                            <div className="h-18 mb-7">
                                <label htmlFor="projectType" className={styles.formLabel}>Project Type
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <select id="projectType"
                                    className={
                                        `${styles.formSelect} ${errors.projectTypeId && "formInputErrorBorder"}`
                                    }
                                    {
                                    ...register("projectTypeId", {
                                        required: "Selecting a project type is required"
                                    })
                                    }
                                >
                                    <option value="">Select a project type</option>
                                    {projectTypes?.data.map((type, index) => (
                                        <option key={index} value={type._id}>{type.name}</option>
                                    ))}
                                </select>
                                <FormInputError message={errors.projectTypeId?.message} />
                            </div>

                            <div className={`h-100 mb-6
                                ${styles.formSelect} ${errors.message && "error-message"}`
                            }>
                                <label htmlFor="message" className={styles.formLabel}>Message
                                    <span className="fromRequiredStar">*</span>
                                </label>
                                <Controller
                                    name="message"
                                    control={control}
                                    rules={{
                                        required: "Message is required"
                                    }}
                                    render={({ field }) => (
                                        <TinyEditor
                                            id="message"
                                            key={isDarkMode ? "dark" : "light"}
                                            height="22rem"
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Tell us about your project, vision, timeline,
                                                and any specific requirements..."
                                            customConfig={{
                                                skin: isDarkMode ? 'oxide-dark' : 'oxide',
                                                content_css: isDarkMode ? 'dark' : 'default'
                                            }}
                                        />
                                    )}
                                />
                                <FormInputError message={errors.message?.message} />
                            </div>

                            <motion.button
                                type="submit" disabled={isMessageSending}
                                className={styles.submitButton}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isMessageSending ? "Sending..." : "Start a Story"}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Contact;