import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { MdAlternateEmail } from 'react-icons/md';
import { FaPhone, FaClock, FaLocationArrow, } from 'react-icons/fa';
import { useSendMessageMutation } from '../../store/api/messageApiSlice';
import { useGetProjectTypesQuery } from '../../store/api/projectTypeApiSlice';
import { useGetContactDetailsQuery } from '../../store/api/contactDetailsApiSlice';
import PrimeReactEditor from '../components/PrimeReactEditor';
import socialPlatforms from '../constants/socialPlatforms';
import FormInputError from '../components/FormInputError';
import LoadingSpinner from '../components/LoadingSpinner';
import Ripples from '../components/Ripples';
import styles from './styles/Contact.module.css';

const Contact = () => {
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm();

    const {
        data: fetchProjectTypes, isLoading: isProjectLoading, isError: isProjectError
    } = useGetProjectTypesQuery();

    const {
        data: fetchContactDetails, isLoading: isContactLoading, isError: isContactError
    } = useGetContactDetailsQuery();

    const [sendMessage, { isLoading: isMessageSending, isSuccess }] = useSendMessageMutation();

    const contactDetails = [
        {
            label: "Email",
            icon: <MdAlternateEmail />,
            value: fetchContactDetails?.data.contactDetails?.email
        },
        {
            label: "Phone",
            icon: <FaPhone />,
            value: fetchContactDetails?.data.contactDetails?.phone
        },
        {
            label: "Address",
            icon: <FaLocationArrow />,
            value: fetchContactDetails?.data.contactDetails?.address
        },
        {
            label: "Response Time",
            icon: <FaClock />,
            value: "Within 24 hours"
        }
    ];

    const onSubmitMessage = async (data) => {
        try {
            await sendMessage(data).unwrap();
        } catch (error) {
            toast.error("Failed to send message:", error);
        }
    };

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

    const platformIcons = useMemo(() => {
        return fetchContactDetails?.data.socialMediaLinks?.map((media) => (
            <Link to={media.url} key={media._id} target='_blank'
                className="socialLink"
            >
                {socialPlatforms.find(platform => platform.name === media.platform)?.icon}
            </Link>
        ));
    }, [fetchContactDetails?.data.socialMediaLinks]);

    return (
        <>
            {/* Contact Content */}
            <section className="mb-8 text-center" data-aos="fade-up">
                <h1 className="heroTitle">Contact</h1>
                <div className="separatorHeroTitle"></div>
            </section>

            <section className={styles.contentContainer}>
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
                        {isContactLoading ? (
                            <LoadingSpinner color="var(--accent-color)" />
                        ) : isContactError ? (
                            <p>Error loading contact details.</p>
                        ) : (
                            contactDetails.map((detail, index) => (
                                <motion.div
                                    key={index}
                                    className={styles.contactItem}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="iconStyle">
                                        {detail.icon}
                                    </div>
                                    <div className={styles.contactText}>
                                        <h6 className={styles.contactLabel}>{detail.label}</h6>
                                        <h6 className={styles.contactValue}>{detail.value}</h6>
                                    </div>
                                </motion.div>
                            )))}
                    </div>

                    <div className={styles.socialSection}>
                        <h5 className={styles.socialTitle}>Follow Our Journey</h5>
                        <div className="socialLinks">
                            {isContactLoading ? (
                                <LoadingSpinner color="var(--accent-color)" />
                            ) : isContactError ? (
                                <p>Error loading social media links.</p>
                            ) : (
                                platformIcons
                            )}
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

                    <form onSubmit={handleSubmit(onSubmitMessage)} noValidate>
                        <div className="h-18 mb-6">
                            <label htmlFor="name" className={styles.formLabel}>Full Name
                                <span className="formRequiredStar">*</span>
                            </label>
                            <input type="text" id="name" className={`${styles.formInput}
                                ${errors.name && "formInputErrorBorder"}`}
                                placeholder="Enter your full name"
                                {...register("name", {
                                    required: "Full name is required"
                                })}
                            />
                            <FormInputError message={errors.name?.message} />
                        </div>

                        <div className="h-18 mb-6">
                            <label htmlFor="email" className={styles.formLabel}>Email ID
                                <span className="formRequiredStar">*</span>
                            </label>
                            <input type="email" id="email" className={`${styles.formInput}
                                ${errors.email && "formInputErrorBorder"}`}
                                placeholder="your.email@example.com"
                                {...register("email", {
                                    required: "Email id is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            <FormInputError message={errors.email?.message} />
                        </div>

                        <div className="h-18 mb-7">
                            <label htmlFor="projectType" className={styles.formLabel}>Project Type
                                <span className="formRequiredStar">*</span>
                            </label>
                            {isProjectLoading ? (
                                <LoadingSpinner size="sm" color="var(--accent-color)" />
                            ) : isProjectError ? (
                                <p>Error loading project types.</p>
                            ) : (
                                <select id="projectType" className={`${styles.formSelect}
                                    ${errors.projectTypeId && "formInputErrorBorder"}`}
                                    {...register("projectTypeId", {
                                        required: "Selecting a project type is required"
                                    })}
                                >
                                    <option value="">Select a project type</option>
                                    {fetchProjectTypes?.data.map((type) => (
                                        <option key={type._id} value={type._id}>{type.name}</option>
                                    ))}
                                </select>
                            )}
                            <FormInputError message={errors.projectTypeId?.message} />
                        </div>

                        <div className={`h-100 mb-6
                                ${styles.formSelect} ${errors.message && "error-message"}`
                        }>
                            <label htmlFor="message" className={styles.formLabel}>Message
                                <span className="formRequiredStar">*</span>
                            </label>
                            <Controller
                                name="message"
                                control={control}
                                rules={{
                                    required: "Message is required"
                                }}
                                render={({ field }) => (
                                    <PrimeReactEditor
                                        id="message"
                                        height={300}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Tell us about your project, vision, timeline, and any specific requirements..."
                                    />
                                )}
                            />
                            <FormInputError message={errors.message?.message} />
                        </div>

                        <Ripples className="w-100" duration={0.8} size={120}>
                            <motion.button
                                type="submit" disabled={isMessageSending}
                                className={styles.submitButton}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.8 }}
                            >
                                {isMessageSending ?
                                    <LoadingSpinner size="sm" color="var(--text-color)" />
                                    : <div className="py-4">Send Message</div>
                                }
                            </motion.button>
                        </Ripples>
                    </form>
                </motion.div>
            </section>
        </>
    );
};

export default Contact;