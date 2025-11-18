import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { TbFilterSearch } from "react-icons/tb";
import { IoSearchOutline } from "react-icons/io5";
import { FaCheck, FaTimes } from "react-icons/fa";
import { RiCheckDoubleFill } from "react-icons/ri";
import { MdRateReview, MdClose, MdDelete } from "react-icons/md";
import {
    useRejectRatingMutation,
    useGetRatingsPaginatedQuery,
    useUpdateRatingStatusMutation
} from "../../../store/api/ratingApiSlice";
import Pagination from "../components/Pagination";
import StarRating from '../../components/StarRating';
import CheckboxInput from "../components/CheckboxInput";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from "./styles/ReviewManagement.module.css";

const ReviewManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modelReviewData, setModelReviewData] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { register: filterRegister, watch: filterWatch } = useForm();
    const { register: selectRegister, watch: selectWatch, reset: resetSelect } = useForm({
        defaultValues: {
            selectedRatings: [],
            selectAllRatings: false
        }
    });

    const { data: fetchRatings, isLoading: isLoadingRatings } = useGetRatingsPaginatedQuery({
        search: filterWatch('search') || "",
        status: filterWatch('status') || "all",
        sortBy: filterWatch('sortBy') || "newest",
        pageNo: currentPage,
        limit: itemsPerPage
    });

    const [rejectRating, { isLoading: isRejectingRating }] = useRejectRatingMutation();
    const [updateRatingStatus, { isLoading: isUpdatingStatus }] = useUpdateRatingStatusMutation();

    const selectedRatingsLength = selectWatch('selectedRatings')?.length || 0;

    // console.log("Ratings Data:", fetchRatings, "Loading:", isLoadingRatings);

    // Create snippet for table
    const createSnippet = (text, length = 50) => {
        if(!text) return;
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    // Handle Approve review
    const handleApprove = async (reviewId) => {
        if(window.confirm('Are you sure you want to approve this review?')) {
            try {
                await updateRatingStatus({ ids: [reviewId], status: 'approved' }).unwrap();
                toast.success('Review approved successfully!');
            } catch (error) {
                toast.error('Failed to approve review. Please try again.');
            }
        }
    };

    // Handle Reject (Delete)
    const handleReject = async (reviewId) => {
        if(window.confirm('Are you sure you want to reject and delete this review?')) {
            try {
                await rejectRating({ ids: [reviewId] }).unwrap();
                toast.success('Review rejected and deleted successfully!');
            } catch (error) {
                toast.error('Failed to reject review. Please try again.');
            }
        }
    };

    // Handle Approve selected reviews
    const handleApproveSelectedReviews = async () => {
        if(window.confirm("Are you sure you want to approve the selected reviews?")) {
            try {
                await updateRatingStatus({ ids: selectWatch("selectedRatings"), status: 'approved' }).unwrap();
                resetSelect({ selectedRatings: [], selectAllRatings: false });
            } catch (error) {
                toast.error("Failed to approve selected reviews. Please try again.");
            }
        }
    };

    // Handle Reject selected reviews
    const handleRejectSelectedReviews = async () => {
        if(window.confirm("Are you sure you want to delete the selected reviews?")) {
            try {
                await rejectRating({ ids: selectWatch("selectedRatings") }).unwrap();
                resetSelect({ selectedRatings: [], selectAllRatings: false });
            } catch (error) {
                toast.error("Failed to delete selected reviews. Please try again.");
            }
        }
    };

    // Select All / Unselect All Gallery Items
    const handleSelectAllRating = () => {
        const allItemIds = fetchRatings?.data.ratings.map(item => item._id) || [];

        if(selectedRatingsLength === allItemIds.length) {
            resetSelect({ selectedRatings: [], selectAllRatings: false });          // Uncheck all
        } else {
            resetSelect({ selectedRatings: allItemIds, selectAllRatings: true });   // Check all
        }
    };

    // Open modal with full review details
    const handleOpenReviewModal = (review) => {
        setModelReviewData(review);
        setIsModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModelReviewData(null);
    };

    useEffect(() => {
        resetSelect({
            selectedRatings: [],
            selectAllRatings: false
        });
    }, [fetchRatings, resetSelect]);

    return (
        <>
            {/* Header */}
            <section className="pageHeader">
                <h1>Review Management</h1>
                <p>Manage client reviews and testimonials</p>
            </section>

            {/* Filters */}
            <section className="cardContainer">
                <div className="sectionHeader flex-row a-center">
                    <div className="sectionHeading">
                        <TbFilterSearch className="sectionIcon" />
                        <h2>Filter/Sort</h2>
                    </div>
                    <span className={styles.totalCount}>
                        Total: {fetchRatings?.data.ratings.length} reviews
                    </span>
                </div>
                <div className={styles.filtersBar}>
                    <div className={styles.searchBox}>
                        <IoSearchOutline className={styles.searchIcon} />
                        <input type="text" className={styles.searchInput}
                            placeholder="Search by title..."
                            {...filterRegister("search", {
                                onChange: () => setCurrentPage(1)
                            })}
                        />
                    </div>
                    <select id="status" className={styles.filterSelect}
                        {...filterRegister("status", {
                            onChange: () => setCurrentPage(1)
                        })}
                    >
                        <option value="all">All Reviews</option>
                        <option value="pending">Pending</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                    </select>

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
                </div>
            </section>

            {/* Reviews Table */}
            <section className="cardContainer">
                {fetchRatings?.data.ratings.length === 0 ? (
                    <div className="emptyState">
                        <MdRateReview />
                        <h3>No reviews found</h3>
                        <p>Reviews will appear here once clients submit feedback</p>
                    </div>
                ) : (
                    <div className={styles.tableContainer}>
                        <table className={styles.reviewTable}>
                            <thead>
                                <tr>
                                    <th>Client Name</th>
                                    <th>Project</th>
                                    <th>Testimonial</th>
                                    <th>Rating</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                    <th className={styles.selectedHeader}>
                                        <p title="Selected Reviews">
                                            {selectedRatingsLength}
                                        </p>
                                        <CheckboxInput
                                            id="selectAllRatings"
                                            title="Select All"
                                            name="selectAllRatings"
                                            register={selectRegister}
                                            onChange={handleSelectAllRating}
                                        />
                                        <button
                                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                                            onClick={handleApproveSelectedReviews}
                                            disabled={selectedRatingsLength === 0 ||
                                                isUpdatingStatus || isRejectingRating
                                            }
                                            title="Approve Selected Review"
                                        >
                                            <FaCheck />
                                        </button>
                                        <button className={`${styles.actionBtn} ${styles.rejectBtn}`}
                                            onClick={handleRejectSelectedReviews}
                                            disabled={selectedRatingsLength === 0 ||
                                                isUpdatingStatus || isRejectingRating
                                            }
                                            title="Delete Selected Review"
                                        >
                                            <MdDelete />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {fetchRatings?.data.ratings.map((rating) => (
                                    <tr key={rating._id}
                                        onClick={() => handleOpenReviewModal(rating)}
                                        title="view"
                                    >
                                        <td>
                                            <div className={styles.clientInfo}>
                                                <strong>{rating.clientName}</strong>
                                                <span className={styles.company}>{rating.clientCompany}</span>
                                            </div>
                                        </td>
                                        <td>{rating.project.title}</td>
                                        <td className={styles.testimonialCell}>
                                            {createSnippet(rating.testimonial)}
                                        </td>
                                        <td>
                                            <StarRating
                                                value={rating.overallRating}
                                                size="xs"
                                                readonly
                                            />
                                        </td>
                                        <td>
                                            <span className={`${styles.statusBadge}
                                                    ${rating.status === "pending"
                                                    ? styles.statusPending
                                                    : rating.status === "submitted"
                                                        ? styles.statusSubmitted
                                                        : styles.statusApproved
                                                }`}
                                            >
                                                {rating.status}
                                            </span>
                                        </td>
                                        <td>{
                                            rating.submittedAt &&
                                            format(new Date(rating.submittedAt), 'PP p')}
                                        </td>
                                        <td>
                                            <div
                                                className={styles.actionButtons}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {rating.status === 'submitted' && (
                                                    <>
                                                        <button
                                                            className={`${styles.actionBtn} ${styles.approveBtn}`}
                                                            onClick={() => handleApprove(rating._id)}
                                                            disabled={isUpdatingStatus || isRejectingRating}
                                                            title="Approve Review"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button className={`${styles.actionBtn}
                                                            ${styles.rejectBtn}`}
                                                            onClick={() => handleReject(rating._id)}
                                                            disabled={isUpdatingStatus || isRejectingRating}
                                                            title="Reject Review"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                )}
                                                {rating.status === 'approved' && (
                                                    <span className={styles.approvedText}>
                                                        <RiCheckDoubleFill />
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}
                                            className="text-center">
                                            <CheckboxInput
                                                id={`selectRating_${rating._id}`}
                                                value={rating._id}
                                                name="selectedRatings"
                                                register={selectRegister}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Pagination */}
            {fetchRatings?.data.pagination.totalPages > 1 && (
                <section className="cardContainer p-4">
                    {isLoadingRatings ? (
                        <LoadingSpinner />
                    ) : (
                        <Pagination
                            pageCount={fetchRatings?.data.pagination.totalPages}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={fetchRatings?.data.pagination.totalItems}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </section>
            )}

            {/* Review Detail Modal */}
            <AnimatePresence>
                {isModalOpen && modelReviewData && (
                    <motion.section
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleCloseModal}
                    >
                        <motion.div
                            className={styles.modalContent}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className={styles.modalHeader}>
                                <h2>Review Details</h2>
                                <button
                                    className={styles.closeButton}
                                    onClick={handleCloseModal}
                                    aria-label="Close modal"
                                >
                                    <MdClose />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className={styles.modalBody}>
                                <div className={styles.modalSection}>
                                    <h3>Client Information</h3>
                                    <p><strong>Name:</strong>{modelReviewData.clientName}</p>
                                    <p><strong>Company:</strong>{modelReviewData.clientCompany}</p>
                                    <p><strong>Project:</strong>{modelReviewData.project.title}</p>
                                    <p><strong>Category:</strong>{modelReviewData.project.category.name}</p>
                                </div>

                                {/* Ratings */}
                                <div className={styles.modalSection}>
                                    <h3>Overall Rating</h3>
                                    <StarRating
                                        value={modelReviewData.overallRating}
                                        readonly
                                    />
                                </div>

                                {/* Parameter Ratings */}
                                <div className={styles.modalSection}>
                                    <h3>Parameter Ratings</h3>
                                    <div className={styles.parameterRatings}>
                                        <div className={styles.parameterItem}>
                                            <span>Creativity & Vision:</span>
                                            <StarRating
                                                value={modelReviewData.parameterRatings?.creativeVision}
                                                size="sm"
                                                readonly
                                            />
                                        </div>
                                        <div className={styles.parameterItem}>
                                            <span>Communication:</span>
                                            <StarRating
                                                value={modelReviewData.parameterRatings?.communication}
                                                size="sm"
                                                readonly
                                            />
                                        </div>
                                        <div className={styles.parameterItem}>
                                            <span>Timely Delivery:</span>
                                            <StarRating
                                                value={modelReviewData.parameterRatings?.timelyDelivery}
                                                size="sm"
                                                readonly
                                            />
                                        </div>
                                        <div className={styles.parameterItem}>
                                            <span>Cinematography:</span>
                                            <StarRating
                                                value={modelReviewData.parameterRatings?.cinematography}
                                                size="sm"
                                                readonly
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial */}
                                <div className={styles.modalSection}>
                                    <h3>Testimonial</h3>
                                    <p className={styles.fullTestimonial}>{modelReviewData.testimonial}</p>
                                </div>

                                {/* Meta Info */}
                                <div className={styles.modalSection}>
                                    <h3>Additional Information</h3>
                                    <p><strong>Status:</strong>
                                        <span className={`${styles.statusBadge}
                                            ${modelReviewData.status === 'approved'
                                                ? styles.statusApproved
                                                : styles.statusSubmitted
                                            }`}
                                        >
                                            {modelReviewData.status}
                                        </span>
                                    </p>
                                    <p><strong>Submitted:</strong>
                                        {modelReviewData.submittedAt ?
                                            format(new Date(modelReviewData.submittedAt), 'PP, p')
                                            : "N/A"
                                        }
                                    </p>
                                    <p><strong>Approved:</strong>
                                        {modelReviewData.approvedAt ?
                                            format(new Date(modelReviewData.approvedAt), 'PP, p')
                                            : "N/A"
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            {modelReviewData.status === "submitted" && (
                                <div className={styles.modalActions}>
                                    <button
                                        className={`${styles.modalActionBtn} ${styles.approveBtn}`}
                                        onClick={() => {
                                            handleApprove(modelReviewData._id);
                                            handleCloseModal();
                                        }}
                                    >
                                        <FaCheck /> Approve Review
                                    </button>
                                    <button
                                        className={`${styles.modalActionBtn} ${styles.rejectBtn}`}
                                        onClick={() => {
                                            handleReject(modelReviewData._id);
                                            handleCloseModal();
                                        }}
                                    >
                                        <FaTimes /> Reject Review
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.section>
                )}
            </AnimatePresence>
        </>
    );
};

export default ReviewManagement;
