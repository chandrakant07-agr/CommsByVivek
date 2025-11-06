import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { IoImagesOutline } from 'react-icons/io5';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateThumbnailUrl } from '../../utils/cloudinaryUtils';
import { useGetGalleryInfiniteQuery } from '../../store/api/galleryApiSlice';
import styles from './styles/FilmedByVivek.module.css';

const FilmedByVivek = () => {
    const inViewRef = useRef(null);
    const isInView = useInView(inViewRef);

    const [currentPage, setCurrentPage] = useState(1);

    const fetchItemsLimit = 6;

    const {
        data: fetchGallery, isLoading: isLoadingGallery, isFetching: isFetchingGallery
    } = useGetGalleryInfiniteQuery({
        pageLocation: "filmedByVivek",
        pageNo: currentPage,
        limit: fetchItemsLimit
    });

    // console.log("FilmedByVivek Gallery Data:", fetchGallery);

    const paginationData = fetchGallery?.data.pagination;
    const hasNextPage = paginationData?.currentPage < paginationData?.totalPages;

    useEffect(() => {
        if (isInView && hasNextPage) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    }, [isInView, hasNextPage]);

    return (
        <div id="filmed-by-vivek">
            {/* Hero Section */}
            <section className="heroSection">
                <motion.div
                    className="heroContent"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: false }}
                >
                    <motion.h1
                        className="heroTitle"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        viewport={{ once: false }}
                    >
                        FilmedByVivek
                    </motion.h1>
                    <div className="separatorHeroTitle"></div>

                    <motion.p
                        className={styles.heroSubtitle}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        "The creative laboratory where stories find their soul"
                    </motion.p>

                    <motion.p
                        className="heroDescription"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.9 }}
                    >
                        This is where artistry transcends commerce. Where experimental narratives,
                        documentary truths, and personal explorations converge to create films
                        that challenge, inspire, and transform both creator and audience.
                    </motion.p>
                </motion.div>
            </section>

            {/* Projects Section */}
            <section className="px-6 pt-6">
                {isLoadingGallery ? (
                    <LoadingSpinner size="lg" color="var(--accent-color)" />
                ) : fetchGallery?.data.galleryItems.length === 0 ? (
                    <div className="projectEmptyState">
                        <IoImagesOutline />
                        <h4>No projects found under FilmedByVivek</h4>
                    </div>
                ) : (
                    <>
                        {fetchGallery?.data.galleryItems.map((item, index) => (
                            <motion.div
                                key={item._id}
                                className={styles.projectItem}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                viewport={{ once: false }}
                            >
                                <motion.div
                                    className={styles.projectVisual}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
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
                                </motion.div>

                                <div className={styles.projectContent}>
                                    <h2 className={styles.projectTitle}>
                                        {item.title}
                                    </h2>
                                    <h5 className={styles.projectType}>
                                        {item.category.name}
                                    </h5>
                                    <p className={styles.projectDescription}>
                                        {item.shortDescription}
                                    </p>

                                    <div className={styles.projectMeta}>
                                        <span className={styles.projectYear}>
                                            Released {item.year}
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
                    </>
                )}
                <div ref={inViewRef} className={`text-center mt-4 ${!hasNextPage && 'd-none'}`}>
                    {isFetchingGallery && (
                        <div className="inViewTriggerElement">
                            <LoadingSpinner size="lg" color="var(--accent-color)" />
                        </div>
                    )}
                    load more...
                </div>
            </section>

        </div>
    );
};

export default FilmedByVivek;