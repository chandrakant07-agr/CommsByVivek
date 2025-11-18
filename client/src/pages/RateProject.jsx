import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { MdRateReview } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import {
    useGetRatingByTokenQuery, useSubmitRatingMutation
} from '../../store/api/ratingApiSlice';
import Ripples from '../components/Ripples';
import StarRating from '../components/StarRating';
import FormInputError from '../components/FormInputError';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from './styles/RateProject.module.css';

const RateProject = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    // Form state for ratings
    const [overallRating, setOverallRating] = useState(0);
    const [deliveryRating, setDeliveryRating] = useState(0);
    const [creativityRating, setCreativityRating] = useState(0);
    const [communicationRating, setCommunicationRating] = useState(0);
    const [cinematographyRating, setCinematographyRating] = useState(0);

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();

    const {
        data: fetchRatingByToken, isLoading: isRatingLoading, isError: isRatingError, error
    } = useGetRatingByTokenQuery(token);

    const [submitRating, {
        isLoading: isSubmitting, isSuccess: isSubmitSuccess
    }] = useSubmitRatingMutation();

    const onSubmitRating = async (data) => {
        // Validate overall rating
        if(overallRating === 0) {
            toast.error('Please provide an overall rating');
            return;
        }

        const ratingData = {
            token,
            overallRating,
            parameterRatings: {
                timelyDelivery: deliveryRating,
                creativeVision: creativityRating,
                communication: communicationRating,
                cinematography: cinematographyRating
            },
            testimonial: data.testimonial,
            clientName: data.clientName,
            clientCompany: data.clientCompany || "N/A"
        };

        try {
            const response = await submitRating(ratingData).unwrap();
            // console.log('Submission response:', response);

            toast.success('Thank you for your feedback!');

            // Reset form
            reset();
            setOverallRating(0);
            setDeliveryRating(0);
            setCreativityRating(0);
            setCommunicationRating(0);
            setCinematographyRating(0);
        } catch (error) {
            toast.error('Failed to submit rating. Please try again.');
        }
    };

    if(isRatingLoading) {
        return (
            <LoadingSpinner
                size="lg"
                color="var(--accent-color)"
                text="Loading rating information..."
            />
        );
    }

    if(isRatingError) {
        toast.error(error?.data?.message || "Failed to load rating information.");
    }

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
                    <motion.h1
                        className="heroTitle"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        Rate Your Experience
                    </motion.h1>
                    <div className="separatorHeroTitle"></div>
                    <motion.p
                        className="heroDescription"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Your feedback helps us deliver excellence
                    </motion.p>
                </motion.div>
            </section>

            {/* Rating Form Section */}
            <section className={styles.ratingSection}>
                <AnimatePresence mode="wait">
                    {fetchRatingByToken?.data.status !== "pending" && !isSubmitSuccess ? (
                        <motion.div
                            key="submitted"
                            className={styles.submittedContainer}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className={styles.submittedTitle}>
                                Already Submitted or Expired Rating Link
                            </h2>
                            <p className={styles.submittedMessage}>
                                The rating link you used is either expired or has already been used.
                                Please contact us if you believe this is an error.
                            </p>
                            <Ripples size={100}>
                                <button
                                    onClick={() => navigate('/')}
                                    className={styles.homeButton}
                                >
                                    Back to Home
                                </button>
                            </Ripples>
                        </motion.div>
                    ) : (
                        !isSubmitSuccess ? (
                            <motion.div
                                key="form"
                                className={styles.ratingContainer}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Project Name */}
                                <div className={styles.projectHeader}>
                                    <div className={styles.projectHeading}>
                                        <MdRateReview className={styles.projectIcon} />
                                        <h2 className={styles.projectTitle}>Rating for:</h2>
                                    </div>
                                    <span>{fetchRatingByToken?.data.project.title}</span>
                                </div>

                                {/* Rating Form */}
                                <form onSubmit={handleSubmit(onSubmitRating)}
                                    className={styles.ratingForm}
                                >
                                    {/* Overall Rating */}
                                    <div className={styles.formSection}>
                                        <div>
                                            <label className={styles.sectionLabel}>
                                                Overall Rating
                                                <span className="formRequiredStar">*</span>
                                            </label>
                                            <p className={styles.sectionHint}>
                                                How would you rate your overall experience?
                                            </p>
                                        </div>
                                        <StarRating
                                            size="lg"
                                            value={overallRating}
                                            color="var(--accent-color)"
                                            onChange={setOverallRating}
                                        />
                                    </div>

                                    {/* Parameter Ratings */}
                                    <div className={styles.formSection}>
                                        <label className={styles.sectionLabel}>
                                            Rate Specific Aspects
                                            <sup className="formOptional">(optional)</sup>
                                        </label>

                                        <div className={styles.parameterRatings}>
                                            {/* Creativity */}
                                            <div className={styles.parameterItem}>
                                                <span className={styles.parameterLabel}>
                                                    Creativity & Vision
                                                </span>
                                                <StarRating
                                                    size="sm"
                                                    value={creativityRating}
                                                    color="var(--accent-color)"
                                                    onChange={setCreativityRating}
                                                />
                                            </div>

                                            {/* Communication */}
                                            <div className={styles.parameterItem}>
                                                <span className={styles.parameterLabel}>
                                                    Communication
                                                </span>
                                                <StarRating
                                                    size="sm"
                                                    value={communicationRating}
                                                    color="var(--accent-color)"
                                                    onChange={setCommunicationRating}
                                                />
                                            </div>

                                            {/* Timely Delivery */}
                                            <div className={styles.parameterItem}>
                                                <span className={styles.parameterLabel}>
                                                    Timely Delivery
                                                </span>
                                                <StarRating
                                                    size="sm"
                                                    value={deliveryRating}
                                                    color="var(--accent-color)"
                                                    onChange={setDeliveryRating}
                                                />
                                            </div>

                                            {/* Cinematography */}
                                            <div className={styles.parameterItem}>
                                                <span className={styles.parameterLabel}>
                                                    Cinematography
                                                </span>
                                                <StarRating
                                                    size="sm"
                                                    value={cinematographyRating}
                                                    color="var(--accent-color)"
                                                    onChange={setCinematographyRating}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Testimonial */}
                                    <div className={styles.formSection}>
                                        <div>
                                            <label htmlFor="testimonial"
                                                className={styles.sectionLabel}
                                            >
                                                Your Feedback
                                                <span className="formRequiredStar">*</span>
                                            </label>
                                            <p className={styles.sectionHint}>
                                                Share your experience working with us
                                                <sup><i>(min 20 and max 200 characters)</i></sup>
                                            </p>
                                        </div>
                                        <textarea id="testimonial" rows="6"
                                            placeholder="Tell us about your experience, what you liked, and how we can improve..."
                                            className={`${styles.testimonialInput}
                                            ${errors.testimonial && "formInputErrorBorder"}`}
                                            {...register("testimonial", {
                                                required: "Feedback is required",
                                                minLength: {
                                                    value: 20,
                                                    message: "Please provide at least 20 characters"
                                                },
                                                maxLength: {
                                                    value: 200,
                                                    message: "Feedback cannot exceed 200 characters"
                                                }
                                            })}
                                        />
                                        <span className={styles.testimonialCharCount}>
                                            {watch("testimonial")?.length || 0}/200
                                        </span>
                                        <FormInputError message={errors.testimonial?.message} />
                                    </div>

                                    {/* Client Name */}
                                    <div className={styles.formSection}>
                                        <label htmlFor="clientName" className={styles.sectionLabel}>
                                            Your Name
                                            <span className="formRequiredStar">*</span>
                                        </label>
                                        <input type="text" id="clientName" placeholder="Enter your name"
                                            className={`${styles.nameInput}
                                            ${errors.clientName && "formInputErrorBorder"}`}
                                            {...register("clientName", {
                                                required: "Name is required",
                                                minLength: {
                                                    value: 2,
                                                    message: "Name must be at least 2 characters"
                                                }
                                            })}
                                        />
                                        <FormInputError message={errors.clientName?.message} />
                                    </div>

                                    {/* Client Company */}
                                    <div className={styles.formSection}>
                                        <label htmlFor="clientCompany" className={styles.sectionLabel}>
                                            Your Company
                                            <sup className="formOptional">(optional)</sup>
                                        </label>
                                        <input
                                            type="text"
                                            id="clientCompany"
                                            placeholder="Enter your company name"
                                            className={styles.companyInput}
                                            {...register("clientCompany")}
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className={styles.formActions}>
                                        <Ripples duration={0.8} size={200}>
                                            <button
                                                type="submit"
                                                className={styles.submitButton}
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? (
                                                    <LoadingSpinner color="var(--white)" />
                                                ) : (
                                                    <>
                                                        <MdRateReview />
                                                        Submit Feedback
                                                    </>
                                                )}
                                            </button>
                                        </Ripples>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                className={styles.successContainer}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div
                                    className={styles.successIcon}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        delay: 0.2,
                                        type: 'spring',
                                        stiffness: 200
                                    }}
                                >
                                    <FaCheckCircle />
                                </motion.div>
                                <h2 className={styles.successTitle}>
                                    Thank You for Your Feedback!
                                </h2>
                                <p className={styles.successMessage}>
                                    We truly appreciate you taking the time to share your experience.
                                    Your feedback helps us continue delivering exceptional work.
                                </p>
                                <Ripples size={100}>
                                    <button
                                        onClick={() => navigate('/')}
                                        className={styles.homeButton}
                                    >
                                        Back to Home
                                    </button>
                                </Ripples>
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </section>
        </>
    );
};

export default RateProject;
