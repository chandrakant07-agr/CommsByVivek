import { useState, useMemo, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, useInView } from 'framer-motion';
import { IoSearchOutline } from 'react-icons/io5';
import { MdOutlineRateReview } from 'react-icons/md';
import {
    useGetRatingInfiniteQuery
} from '../../store/api/ratingApiSlice';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from './styles/Testimonials.module.css';

const Testimonials = () => {
    const inViewRef = useRef(null);
    const isInView = useInView(inViewRef);

    const [currentPage, setCurrentPage] = useState(1);
    const fetchItemsLimit = currentPage === 1 ? 12 : 6;

    const { register: filterRegister, watch: filterWatch } = useForm();

    const { data: fetchRatings, isLoading: isLoadingRatings, isFetching: isFetchingRatings } = useGetRatingInfiniteQuery({
        status: "approved",
        search: filterWatch('search') || "",
        sortBy: filterWatch('sortBy') || "newest",
        pageNo: currentPage,
        limit: fetchItemsLimit,
        initialSkip: currentPage === 1 ? 0 : fetchItemsLimit
    });

    const paginationData = fetchRatings?.data.pagination;
    const hasNextPage = paginationData?.currentPage < paginationData?.totalPages;

    // console.log("Fetched Ratings:", fetchRatings);

    // Calculate overall rating
    const overallRating = useMemo(() => {
        const total = fetchRatings?.data?.ratings.reduce((sum, t) => sum + t.overallRating, 0);
        return (total / fetchRatings?.data?.ratings.length).toFixed(1);
    }, [fetchRatings]);

    // Load more items when in view
    useEffect(() => {
        if(isInView && hasNextPage) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }, [isInView, hasNextPage]);

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
                        What Our Clients Say
                    </motion.h1>
                    <div className="separatorHeroTitle"></div>
                    <motion.p
                        className="heroDescription"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Real stories from real clients who trusted us with their vision.
                    </motion.p>
                </motion.div>
            </section>

            {/* Overall Rating Summary */}
            <section className={styles.summarySection}>
                <motion.div
                    className={styles.summaryCard}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className={styles.summaryIcon}>
                        <MdOutlineRateReview />
                    </div>
                    <div className={styles.summaryContent}>
                        <h2 className={styles.overallRating}>{overallRating}/5</h2>
                        <StarRating
                            value={parseFloat(overallRating)}
                            color="var(--accent-color)"
                            readonly
                        />
                        <p className={styles.totalReviews}>
                            Based on {fetchRatings?.data?.ratings.length} reviews
                        </p>
                    </div>
                </motion.div>
            </section>

            {/* Filter & Sort Section */}
            <section className="px-6 px-lg-10">
                <motion.div
                    className={styles.filtersContainer}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    {/* Search by title */}
                    <div className={styles.searchBox}>
                        <IoSearchOutline className={styles.searchIcon} />
                        <input type="text" className={styles.searchInput}
                            placeholder="Search by title..."
                            {...filterRegister("search", {
                                onChange: () => setCurrentPage(1)
                            })}
                        />
                    </div>

                    {/* Sort By */}
                    <select id="sortBy" className={styles.filterSelect}
                        {...filterRegister("sortBy", {
                            onChange: () => setCurrentPage(1)
                        })}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                    </select>
                </motion.div>
            </section>

            {/* Testimonials Grid */}
            <section className="px-6 px-lg-10">
                {isLoadingRatings ? (
                    <LoadingSpinner size="lg" color="var(--accent-color)" />
                ) : fetchRatings?.data?.ratings.length === 0 ? (
                    <motion.div
                        className="projectEmptyState"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <MdOutlineRateReview />
                        <h4>No testimonials found</h4>
                    </motion.div>
                ) : (
                    <div className={styles.testimonialsGrid}>
                        {fetchRatings?.data?.ratings.map((rating, index) => (
                            <motion.div
                                key={rating._id}
                                className={styles.testimonialCard}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Star Rating */}
                                <div className={styles.cardRating}>
                                    <StarRating
                                        value={rating.overallRating}
                                        color="var(--accent-color)"
                                        readonly
                                    />
                                    <span className={styles.ratingNumber}>
                                        {rating.overallRating}
                                    </span>
                                </div>

                                {/* Testimonial Text */}
                                <p className={styles.testimonialText}>
                                    "{rating.testimonial}"
                                </p>

                                {/* Client Info */}
                                <div>
                                    <h4 className={styles.clientName}>
                                        {rating.clientName}
                                    </h4>
                                    <p className={styles.clientCompany}>
                                        {rating.clientCompany}
                                    </p>
                                </div>

                                {/* Project Info */}
                                <div className={styles.projectInfo}>
                                    <span className={styles.projectName}>
                                        {rating.project.title}
                                    </span>
                                    <span className={styles.projectCategory}>
                                        {rating.project.category.name}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Load More */}
                <div ref={inViewRef} className={`text-center mt-4 ${!hasNextPage && 'd-none'}`}>
                    {isFetchingRatings && (
                        <div className="inViewTriggerElement">
                            <LoadingSpinner size="lg" color="var(--accent-color)" />
                        </div>
                    )}
                    load more...
                </div>
            </section>
        </>
    );
};

export default Testimonials;
