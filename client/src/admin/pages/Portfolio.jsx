import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { TagsInput } from "react-tag-input-component";
import { toast } from "react-toastify";
import {
    IoSave,
    IoCloseOutline,
    IoImagesOutline,
    IoSearchOutline,
    IoAddCircleOutline,
} from "react-icons/io5";
import { MdEdit, MdDelete, MdCategory } from "react-icons/md";
import {
    useGetCategoriesQuery,
    useGetPortfolioItemsQuery,
    useSyncCategoriesMutation,
    useAddPortfolioItemMutation,
    useUpdatePortfolioItemMutation,
    useDeletePortfolioItemMutation
} from "../../../store/api/portfolioApiSlice";
import {
    useGenerateSignatureMutation
} from "../../../store/api/cloudinaryApiSlice";
import Pagination from "../components/Pagination";
import FormInputError from "../../components/FormInputError";
import LoadingSpinner from "../../components/LoadingSpinner";
import UploadProgressBar from "../components/UploadProgressBar";
import MediaFileUploader from "../components/MediaFileUploader";
import { generateThumbnailUrl, uploadFileCloudinary } from "../../../utils/cloudinaryUtils";
import styles from "./styles/Portfolio.module.css";

const Portfolio = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [editingItem, setEditingItem] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [uploadFileType, setUploadFileType] = useState(null);
    const [uploadFilePreview, setUploadFilePreview] = useState(null);
    const [uploadCancelToken, setUploadCancelToken] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const { register: filterRegister, watch: filterWatch } = useForm();
    const { control: categoryControl, handleSubmit: categorySubmit, reset: resetCategory } = useForm();

    const {
        reset: resetPortfolio,
        control: portfolioControl,
        register: portfolioRegister,
        handleSubmit: portfolioSubmit,
        formState: { errors: portfolioErrors }
    } = useForm();

    const { data: fetchCategories, isLoading: isFetchingCategory } = useGetCategoriesQuery();
    const [syncCategories, { isLoading: isSyncing }] = useSyncCategoriesMutation();

    const { data: fetchPortfolio, isLoading: isFetchingPortfolio } = useGetPortfolioItemsQuery({
        search: filterWatch("searchQuery") || "",
        category: filterWatch("categoryFilter") || "all",
        pageNo: currentPage,
        limit: itemsPerPage
    });

    const [
        addPortfolioItem, { isLoading: isAdding, isSuccess: isAddSuccess }
    ] = useAddPortfolioItemMutation();

    const [
        updatePortfolioItem, { isLoading: isUpdating, isSuccess: isUpdateSuccess }
    ] = useUpdatePortfolioItemMutation();

    const [deletePortfolioItem, { isLoading: isDeleting }] = useDeletePortfolioItemMutation();

    const [generateSignature] = useGenerateSignatureMutation();

    // console.log(fetchPortfolio);
    // console.log(fetchCategories);

    // Submit portfolio form (only file upload part shown)
    const onSubmitPortfolio = async (data) => {
        try {
            setIsUploading(true);

            if(data.coverFile && data.coverFile instanceof File) {
                const signatureData = await generateSignature({ folder: uploadFileType }).unwrap();
                const responseUpload = await uploadFileCloudinary(
                    data.coverFile, signatureData.data,
                    uploadFileType, setUploadProgress, setUploadCancelToken
                );

                // extract necessary fields from responseUpload
                const {
                    bytes, width, height, format, version, duration,
                    created_at, public_id, secure_url, resource_type,
                } = responseUpload || {};

                const cloudinaryData = {
                    bytes, width, height, format, version,
                    public_id, secure_url, created_at, resource_type,
                    duration: resource_type === 'video' ? duration : undefined
                };

                // add cloudinaryData to form data
                data.cloudinaryData = cloudinaryData;

                // add old cloudinary public_id for deletion
                if(!!editingItem) data.oldCloudinaryPublicId = editingItem.cloudinaryData.public_id;
            } else {
                data.cloudinaryData = {};
            }

            // remove coverFile from form data
            delete data.coverFile;

            if(!!editingItem) await updatePortfolioItem({ id: editingItem._id, ...data }).unwrap();
            else await addPortfolioItem(data).unwrap();

        } catch (error) {
            setIsUploading(false);
            toast.error("Failed to save portfolio item. Please try again.");
        }
    };

    // Open modal for adding new item
    const handleAddNewItem = () => {
        resetPortfolio();
        setIsModalOpen(true);
        setEditingItem(null);
        setUploadFilePreview(null);
    };

    // Open modal for editing
    const handleUpdateItem = (item) => {
        setIsModalOpen(true);
        setEditingItem(item);
        resetPortfolio({
            year: item.year,
            title: item.title,
            subTags: item.subTags || [],
            category: item.category._id,
            shortDescription: item.shortDescription
        }, { keepDefaultValues: true });
        setUploadFilePreview(item.cloudinaryData.secure_url);
        if(item.cloudinaryData.resource_type === "image") setUploadFileType("portfolio_images");
        if(item.cloudinaryData.resource_type === "video") setUploadFileType("portfolio_videos");
    };

    const handleDeleteItem = async (itemId) => {
        if(window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deletePortfolioItem({ itemId }).unwrap();
            } catch (error) {
                toast.error("Failed to delete portfolio item. Please try again.");
            }
        }
    };

    const handleUploadFilePreview = (file) => {
        if(file) {
            setUploadFilePreview(URL.createObjectURL(file));
            if(file.type.startsWith("image/")) setUploadFileType("portfolio_images");
            if(file.type.startsWith("video/")) setUploadFileType("portfolio_videos");
        }
    };

    const handleMediaRemove = () => {
        setUploadFilePreview(null);
        resetPortfolio({ coverFile: null });
    };

    const handleCancelUpload = () => {
        if(uploadCancelToken) uploadCancelToken.cancel("Upload canceled by user.");
        setUploadProgress(0);
    };

    // Load categories from API
    useEffect(() => {
        resetCategory({ categories: fetchCategories?.data.map(cat => cat.name) || [] });
    }, [fetchCategories, resetCategory]);

    useEffect(() => {
        resetPortfolio();
        setEditingItem(null);
        setIsModalOpen(false);
        setIsUploading(false);
        setUploadFilePreview(null);
    }, [isAddSuccess, isUpdateSuccess, resetPortfolio]);

    return (
        <>
            <section className={styles.pageHeader}>
                <h1>Portfolio Management</h1>
                <p>Manage your portfolio items and categories</p>
            </section>

            {/* Category Management Section */}
            <section className={styles.cardContainer}>
                <div className={styles.sectionHeader}>
                    <MdCategory className={styles.sectionIcon} />
                    <h2>Manage Categories</h2>
                </div>
                {isFetchingCategory ? (
                    <LoadingSpinner />
                ) : (
                    <form onSubmit={categorySubmit(async (data) => await syncCategories(data))}
                        className="p-6"
                    >
                        <div className={styles.tagsInputWrapper}>
                            <Controller
                                name="categories"
                                control={categoryControl}
                                render={({ field }) => (
                                    <TagsInput
                                        value={field.value || []}
                                        onChange={field.onChange}
                                        placeHolder="Type a category and press Enter..."
                                    />
                                )}
                            />
                            <small className={styles.tagsHelperText}>
                                Press Enter to add a new category
                            </small>
                        </div>
                        <div className={styles.formButtons}>
                            <button type="button" className={styles.resetButton}
                                onClick={() => resetCategory()}>
                                Reset
                            </button>
                            <button type="submit"
                                disabled={isSyncing}
                                className={styles.saveButton}>
                                <IoSave />
                                {isSyncing ? "Saving..." : "Save Categories"}
                            </button>
                        </div>
                    </form>
                )}
            </section>

            {/* Portfolio List Section */}
            <section className={styles.cardContainer}>
                <div className={styles.sectionHeader}>
                    <IoImagesOutline className={styles.sectionIcon} />
                    <h2>Portfolio Items</h2>
                    <button className={styles.addNewButton}
                        onClick={handleAddNewItem}
                    >
                        <IoAddCircleOutline />
                        Add New Item
                    </button>
                </div>

                <div className="p-6">
                    {/* Search and Filter Bar */}
                    <div className={styles.filterBar}>
                        <div className={styles.searchBox}>
                            <IoSearchOutline className={styles.searchIcon} />
                            <input type="text" className={styles.searchInput}
                                placeholder="Search by title..."
                                {...filterRegister("searchQuery")}
                            />
                        </div>
                        <select className={styles.categoryFilter}
                            {...filterRegister("categoryFilter")}
                        >
                            <option value="">All Categories</option>
                            {fetchCategories?.data.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Portfolio Grid */}
                    {isFetchingPortfolio ? (
                        <LoadingSpinner size="lg" />
                    ) : fetchPortfolio?.data.portfolioItems.length === 0 ? (
                        <div className={styles.portfolioEmptyState}>
                            <IoImagesOutline />
                            <h4>No portfolio items found</h4>
                            <p>Add your first portfolio item to get started</p>
                        </div>
                    ) : (
                        <div className={styles.portfolioGrid}>
                            {fetchPortfolio?.data.portfolioItems.map((item) => (
                                <div key={item._id} className={styles.portfolioCard}>
                                    <div className={styles.cardThumbnail}>
                                        <img src={generateThumbnailUrl(item.cloudinaryData.secure_url,
                                            item.cloudinaryData.resource_type, 300, 200)}
                                            alt={item.title}
                                        />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h3>{item.title}</h3>
                                        <span className={styles.categoryBadge}>{item.category.name}</span>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={styles.actionButton}
                                            onClick={() => handleUpdateItem(item)}
                                            disabled={isUpdating}
                                        >
                                            <MdEdit />
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.deleteAction}`}
                                            onClick={() => handleDeleteItem(item._id)}
                                            disabled={isDeleting}
                                        >
                                            <MdDelete />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Pagination */}
            {fetchPortfolio?.data.pagination.totalPages > 1 && (
                <section className={`${styles.cardContainer} px-6 py-4`}>
                    {isFetchingPortfolio ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="d-flex a-center justify-between">
                            <div className={styles.totalPages}>
                                {`Showing ${((currentPage - 1) * itemsPerPage) + 1} 
                                to ${Math.min(currentPage * itemsPerPage,
                                    fetchPortfolio?.data.pagination.totalItems)} 
                            of ${fetchPortfolio?.data.pagination.totalItems} results`}
                            </div>

                            <Pagination
                                pageCount={fetchPortfolio?.data.pagination.totalPages}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>
                    )}
                </section>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <section className={styles.modalOverlay}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{!!editingItem ? "Edit Portfolio Item" : "Add New Portfolio Item"}</h2>
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsModalOpen(false)}
                            >
                                <IoCloseOutline />
                            </button>
                        </div>

                        <form onSubmit={portfolioSubmit(onSubmitPortfolio)}
                            className="p-6 pb-0" noValidate>

                            {/* Title */}
                            <div className="h-19 mb-4">
                                <label htmlFor="title">
                                    Title<span className="fromRequiredStar">*</span>
                                </label>
                                <input type="text" id="title" className={`${styles.textInput}
                                    ${portfolioErrors.title && "formInputErrorBorder"}
                                `}
                                    placeholder="Enter portfolio title"
                                    {...portfolioRegister("title", {
                                        required: "Title is required"
                                    })}
                                />
                                <FormInputError message={portfolioErrors.title?.message} />
                            </div>

                            {/* Main Category */}
                            <div className="h-19 mb-4">
                                <label htmlFor="category">
                                    Category<span className="fromRequiredStar">*</span>
                                </label>
                                <select id="category" className={`${styles.categorySelect}
                                    ${portfolioErrors.category && "formInputErrorBorder"}`}
                                    {...portfolioRegister("category", {
                                        required: "Category is required"
                                    })}
                                >
                                    <option value="">Select a category</option>
                                    {fetchCategories?.data.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                <FormInputError message={portfolioErrors.category?.message} />
                            </div>

                            {/* Cover Image */}
                            <div className="mb-6">
                                <MediaFileUploader
                                    name="coverFile"
                                    label="Cover Media"
                                    required={true}
                                    uploadFileType={uploadFileType}
                                    portfolioControl={portfolioControl}
                                    uploadFilePreview={uploadFilePreview}
                                    handleMediaRemove={handleMediaRemove}
                                    handleUploadFilePreview={handleUploadFilePreview}
                                />
                            </div>

                            {/* Short Description */}
                            <div className="mb-4">
                                <label htmlFor="shortDescription">
                                    Short Description<span className="fromRequiredStar">*</span>
                                </label>
                                <textarea id="shortDescription" className={`${styles.textAreaInput}
                                    ${portfolioErrors.shortDescription && "formInputErrorBorder"}`}
                                    placeholder="Brief description for the card"
                                    rows="3"
                                    {...portfolioRegister("shortDescription", {
                                        required: "Short description is required"
                                    })}
                                />
                                <FormInputError message={portfolioErrors.shortDescription?.message} />
                            </div>

                            {/* Year */}
                            <div className="h-19 mb-4">
                                <label htmlFor="year">
                                    Year<span className="fromRequiredStar">*</span>
                                </label>
                                <input type="text" id="year" className={`${styles.textInput}
                                    ${portfolioErrors.year && "formInputErrorBorder"}`}
                                    placeholder="e.g., 2024"
                                    {...portfolioRegister("year", {
                                        required: "Year is required"
                                    })}
                                />
                                <FormInputError message={portfolioErrors.year?.message} />
                            </div>

                            {/* Sub Tags */}
                            <div className="h-19 mb-4">
                                <label>Sub Tags</label>
                                <div className={styles.tagsInputWrapper}>
                                    <Controller
                                        name="subTags"
                                        control={portfolioControl}
                                        render={({ field }) => (
                                            <TagsInput
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeHolder="Add tags..."
                                            />
                                        )}
                                    />
                                    <small className={styles.tagsHelperText}>
                                        Press Enter to add tags (e.g., Outdoor, Romantic, etc.)
                                    </small>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelButton}
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isAdding || isUpdating}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitButton}
                                    disabled={isAdding || isUpdating}
                                >
                                    <IoSave />
                                    {(isAdding || isUpdating
                                        ? "Saving..." : (!!editingItem ? "Update" : "Add New"))}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Upload Progress Bar */}
                    {(isUploading) && (
                        <div className={styles.responseInterfaceOverlay}>
                            <div className="absolute z--1">
                                <LoadingSpinner size="xl" text="Processing..."
                                    backgroundColor="var(--bg-primary-color)"
                                />
                            </div>
                            {!!uploadProgress && (<UploadProgressBar
                                progress={uploadProgress} onCancel={handleCancelUpload}
                            />)}
                        </div>
                    )}
                </section>
            )}
        </>
    );
};

export default Portfolio;
