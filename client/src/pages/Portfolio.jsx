import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaRegEye, FaRegPlayCircle } from 'react-icons/fa';
import { IoImagesOutline } from 'react-icons/io5';
import { FaRegCirclePause } from 'react-icons/fa6';
import {
    useGetHeroBannerQuery
} from '../../store/api/bannerApiSlice';
import {
    useGetCategoriesQuery, useGetGalleryInfiniteQuery
} from '../../store/api/galleryApiSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import PortfolioModal from '../components/PortfolioModal';
import { generateThumbnailUrl } from '../../utils/cloudinaryUtils';
import styles from './styles/Portfolio.module.css';

const Portfolio = () => {
    const videoPlayerRef = useRef(null);

    const inViewRef = useRef(null);
    const isInView = useInView(inViewRef);

    const [currentPage, setCurrentPage] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchItemsLimit = currentPage === 1 ? 12 : 6;

    const { data: fetchHeroBanner, isLoading: isFetchingHeroBanner } = useGetHeroBannerQuery();
    const { data: fetchCategories, isLoading: isFetchingCategory } = useGetCategoriesQuery();

    const {
        data: fetchGallery, isLoading: isLoadingGallery, isFetching: isFetchingGallery
    } = useGetGalleryInfiniteQuery({
        category: activeFilter,
        pageLocation: "portfolio",
        pageNo: currentPage,
        limit: fetchItemsLimit,
        initialSkip: currentPage === 1 ? 0 : fetchItemsLimit
    });

    const paginationData = fetchGallery?.data.pagination;
    const hasNextPage = paginationData?.currentPage < paginationData?.totalPages;

    // console.log(fetchCategories)
    // console.log(fetchGallery)
    // console.log(isLoadingGallery, isFetchingGallery, hasNextPage)
    // console.log(currentPage, isInView, paginationData)

    const handlePlayPause = () => {
        if(videoPlayerRef.current) {
            if(videoPlayerRef.current.paused || videoPlayerRef.current.ended) {
                videoPlayerRef.current.play();
                setIsPlaying(true);
            } else {
                videoPlayerRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleCategoryChange = (categoryId) => {
        if(categoryId === activeFilter) return;
        setActiveFilter(categoryId);
        setCurrentPage(1);
    };

    useEffect(() => {
        if(isInView && hasNextPage) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }, [isInView, hasNextPage]);

    return (
        <>
            {/* Master Showreel Section */}
            <section className="mb-8 text-center">
                <motion.h1
                    className="heroTitle"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    Our Work
                </motion.h1>
                <div className="separatorHeroTitle"></div>
            </section>

            <section className="mb-8">
                {isFetchingHeroBanner ? (
                    <LoadingSpinner
                        size="lg"
                        color="var(--accent-color)"
                        text="video loading..."
                    />
                ) : (
                    <motion.div
                        className={styles.showreelVideo}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <video
                            controls
                            ref={videoPlayerRef}
                            poster={generateThumbnailUrl(
                                fetchHeroBanner?.data?.cloudinaryData.secure_url,
                                fetchHeroBanner?.data?.cloudinaryData.resource_type,
                                800,
                                450
                            )}
                            className={styles.showreelVideoPlayer}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => setIsPlaying(false)}
                            onContextMenu={(e) => e.preventDefault()}
                        >
                            <source
                                src={fetchHeroBanner?.data?.cloudinaryData.secure_url}
                                type="video/mp4"
                            />
                            Your browser does not support the video tag.
                        </video>
                        <button aria-label={isPlaying ? "Pause showreel" : "Play showreel"}
                            className={`${styles.playButton} ${isPlaying && "opacity-0"}`}
                            onClick={handlePlayPause}
                        >
                            {isPlaying ? <FaRegCirclePause /> : <FaRegPlayCircle />}
                        </button>
                    </motion.div>
                )}
            </section>

            {/* Portfolio Grid */}
            <section className="px-6 px-lg-10">
                <motion.h1
                    className="heroTitle text-center"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    Featured Projects
                </motion.h1>
                <div className="separatorShowReelTitle"></div>

                {/* Filter Tabs */}
                <motion.div
                    className={styles.filterTabs}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <button key="all" className={`${styles.filterTab}
                        ${activeFilter === "all" && styles.active}`}
                        onClick={() => handleCategoryChange("all")}
                    >
                        All
                    </button>
                    {isFetchingCategory ? (
                        <LoadingSpinner size="sm" color="var(--accent-color)" />
                    ) : (
                        fetchCategories?.data.map((filter) => (
                            <button key={filter._id} className={`${styles.filterTab}
                            ${activeFilter === filter._id && styles.active}`}
                                onClick={() => handleCategoryChange(filter._id)}
                            >
                                {filter.name}
                            </button>
                        ))
                    )}
                </motion.div>

                {/* Projects Grid */}
                {isLoadingGallery ? (
                    <LoadingSpinner size="lg" color="var(--accent-color)" />
                ) : fetchGallery?.data.galleryItems.length === 0 ? (
                    <div className="projectEmptyState">
                        <IoImagesOutline />
                        <h4>No portfolio items found</h4>
                    </div>
                ) : (
                    <div className={styles.projectsGrid}>
                        {fetchGallery?.data.galleryItems.map((item, index) => (
                            <motion.div
                                key={item._id}
                                className={styles.projectCard}
                                // layout
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className={styles.projectThumbnail}>
                                    <img
                                        src={generateThumbnailUrl(
                                            item.cloudinaryData.secure_url,
                                            item.cloudinaryData.resource_type,
                                            600,
                                            337
                                        )}
                                        alt={item.title}
                                        loading="lazy"
                                        className={styles.projectImage}
                                    />
                                    <div className={styles.projectOverlay}>
                                        <FaRegEye /> View
                                    </div>
                                </div>

                                <div className={styles.projectContent}>
                                    <h3 className={styles.projectTitle}>
                                        {item.title}
                                    </h3>
                                    <h6 className={styles.projectCategory}>
                                        {item.category.name}
                                    </h6>
                                    <p className={styles.projectDescription}>
                                        {item.shortDescription}
                                    </p>

                                    <div className={styles.projectMeta}>
                                        <span className={styles.projectYear}>
                                            {item.year}
                                        </span>
                                        <div className={styles.projectTags}>
                                            {item.subTags?.map((tag) => (
                                                <span key={tag} className={styles.projectTag}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Load More */}
                <div ref={inViewRef} className={`text-center mt-4 ${!hasNextPage && 'd-none'}`}>
                    {isFetchingGallery && (
                        <div className="inViewTriggerElement">
                            <LoadingSpinner size="lg" color="var(--accent-color)" />
                        </div>
                    )}
                    load more...
                </div>
            </section>

            {/* Portfolio Modal */}
            {selectedItem && (
                <PortfolioModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </>
    );
};

export default Portfolio;