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
    IoLink,
} from "react-icons/io5";
import { TbFilterSearch } from "react-icons/tb";
import { MdEdit, MdDelete, MdCategory } from "react-icons/md";
import { IoCopy, IoCheckmarkDone } from "react-icons/io5";
import {
    useGetCategoriesQuery,
    useAddGalleryItemMutation,
    useSyncCategoriesMutation,
    useGetGalleryPaginatedQuery,
    useUpdateGalleryItemMutation,
    useDeleteGalleryItemMutation
} from "../../../store/api/galleryApiSlice";
import {
    useGenerateSignatureMutation
} from "../../../store/api/cloudinaryApiSlice";
import {
    useGenerateRatingLinkMutation
} from "../../../store/api/ratingApiSlice";
import Pagination from "../components/Pagination";
import RadioInput from "../components/RadioInput";
import CheckboxInput from "../components/CheckboxInput";
import FormInputError from "../../components/FormInputError";
import LoadingSpinner from "../../components/LoadingSpinner";
import UploadProgressBar from "../components/UploadProgressBar";
import MediaFileUploader from "../components/MediaFileUploader";
import { generateThumbnailUrl, uploadFileCloudinary } from "../../../utils/cloudinaryUtils";
import styles from "./styles/Gallery.module.css";

const Gallery = () => {
    const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [isRatingLinkModalOpen, setIsRatingLinkModalOpen] = useState(false);
    const [currentRatingLink, setCurrentRatingLink] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    const [editingItem, setEditingItem] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [uploadFileType, setUploadFileType] = useState(null);
    const [uploadFilePreview, setUploadFilePreview] = useState(null);
    const [uploadCancelToken, setUploadCancelToken] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const { register: filterRegister, watch: filterWatch } = useForm();
    const { control: categoryControl, handleSubmit: categorySubmit, reset: resetCategory } = useForm();

    const { register: selectRegister, watch: selectWatch, reset: resetSelect } = useForm({
        defaultValues: {
            selectedItems: [],
            selectAllItems: false
        }
    });

    const {
        reset: resetGallery,
        control: galleryControl,
        register: galleryRegister,
        handleSubmit: gallerySubmit,
        formState: { errors: galleryErrors }
    } = useForm({
        defaultValues: { pageLocation: "portfolio" }
    });

    const { data: fetchCategories, isLoading: isFetchingCategory } = useGetCategoriesQuery();
    const [syncCategories, { isLoading: isSyncing }] = useSyncCategoriesMutation();

    const { data: fetchGallery, isLoading: isLoadingGallery } = useGetGalleryPaginatedQuery({
        search: filterWatch("searchQuery") || "",
        category: filterWatch("categoryFilter") || "all",
        pageLocation: filterWatch("pageFilter") || "all",
        pageNo: currentPage,
        limit: itemsPerPage
    });

    // console.log(fetchGallery?.data)

    const [
        addGalleryItem, { isSuccess: isAddSuccess }
    ] = useAddGalleryItemMutation();

    const [
        updateGalleryItem, { isLoading: isUpdating, isSuccess: isUpdateSuccess }
    ] = useUpdateGalleryItemMutation();

    const [deleteGalleryItem, { isLoading: isDeleting }] = useDeleteGalleryItemMutation();

    const [generateSignature] = useGenerateSignatureMutation();
    const [generateRatingLink, { isLoading: isGeneratingLink }] = useGenerateRatingLinkMutation();

    const selectedItemsLength = (selectWatch("selectedItems") || []).length;

    // Submit gallery form
    const onSubmitGallery = async (data) => {
        try {
            setIsUploading(true);

            if(data.coverFile && data.coverFile instanceof File) {
                const signatureData = await generateSignature({ folder: uploadFileType }).unwrap();
                const responseUpload = await uploadFileCloudinary(
                    data.coverFile, signatureData.data,
                    uploadFileType, setUploadProgress, setUploadCancelToken
                );

                // console.log("Upload Response:", responseUpload);

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

            if(!!editingItem) await updateGalleryItem({ id: editingItem._id, ...data }).unwrap();
            else await addGalleryItem(data).unwrap();

        } catch (error) {
            toast.error("Failed to save gallery item. Please try again.");
        } finally {
            resetGallery();
            setEditingItem(null);
            setIsGalleryModalOpen(false);
            setIsUploading(false);
            setUploadFilePreview(null);
        }
    };

    // Open modal for adding new item
    const handleAddNewItem = () => {
        resetGallery();
        setIsGalleryModalOpen(true);
        setEditingItem(null);
        setUploadFilePreview(null);
    };

    // Generate Rating Link Handler (Dummy Implementation)
    const handleGenerateRatingLink = async (itemId) => {
        try {
            setIsRatingLinkModalOpen(true);

            const { data } = await generateRatingLink(itemId).unwrap();

            if(data?.status === "pending") {
                const ratingLink = `${window.location.origin}/rate-project/${data?.token}`;

                toast.success(`Rating link generated for "${data?.project.title}"!`);
                setCurrentRatingLink(ratingLink);
            } else {
                toast.info("Rating already submitted for this project.");
                setIsRatingLinkModalOpen(false);
            }
        } catch (error) {
            toast.error("Failed to generate rating link. Please try again.");
            setIsRatingLinkModalOpen(false);
        }
    };

    // Open modal for editing
    const handleUpdateItem = (item) => {
        setIsGalleryModalOpen(true);
        setEditingItem(item);
        resetGallery({
            year: item.year,
            title: item.title,
            subTags: item.subTags || [],
            category: item.category._id,
            pageLocation: item.pageLocation,
            shortDescription: item.shortDescription
        }, { keepDefaultValues: true });
        setUploadFilePreview(item.cloudinaryData.secure_url);
        if(item.cloudinaryData.resource_type === "image") setUploadFileType("gallery_images");
        if(item.cloudinaryData.resource_type === "video") setUploadFileType("gallery_videos");
    };

    // Delete single item
    const handleDeleteItem = async (itemId) => {
        if(window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteGalleryItem({ ids: [itemId] }).unwrap();
            } catch (error) {
                toast.error("Failed to delete gallery item. Please try again.");
            }
        }
    };

    // Delete selected items
    const handleDeleteSelectedItems = async () => {
        if(window.confirm("Are you sure you want to delete the selected items?")) {
            try {
                await deleteGalleryItem({ ids: selectWatch("selectedItems") }).unwrap();
                resetSelect({ selectedItems: [], selectAllItems: false });
            } catch (error) {
                toast.error("Failed to delete selected gallery items. Please try again.");
            }
        }
    };

    // Select All / Unselect All Gallery Items
    const handleSelectAllGalleryItems = () => {
        const allItemIds = fetchGallery?.data.galleryItems.map(item => item._id) || [];

        if(selectedItemsLength === allItemIds.length) {
            resetSelect({ selectedItems: [], selectAllItems: false });          // Uncheck all
        } else {
            resetSelect({ selectedItems: allItemIds, selectAllItems: true });   // Check all
        }
    };

    // Handle file preview and type
    const handleUploadFilePreview = (file) => {
        if(file) {
            setUploadFilePreview(URL.createObjectURL(file));
            if(file.type.startsWith("image/")) setUploadFileType("gallery_images");
            if(file.type.startsWith("video/")) setUploadFileType("gallery_videos");
        }
    };

    // Handle media removal
    const handleMediaRemove = () => {
        setUploadFilePreview(null);
        resetGallery({ coverFile: null });
    };

    // Cancel Upload Handler
    const handleCancelUpload = () => {
        if(uploadCancelToken) uploadCancelToken.cancel("Upload canceled by user.");
        setUploadProgress(0);
    };

    // Copy to Clipboard Handler
    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(currentRatingLink);
            setIsCopied(true);
            toast.success("Link copied to clipboard!");

            // Reset copied state after 2 seconds
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            toast.error("Failed to copy link. Please try again.");
        }
    };

    // Close Rating Link Modal
    const handleCloseRatingLinkModal = () => {
        setIsRatingLinkModalOpen(false);
        setCurrentRatingLink("");
        setIsCopied(false);
    };

    // Load categories from API
    useEffect(() => {
        resetCategory({ categories: fetchCategories?.data.map(cat => cat.name) || [] });
    }, [fetchCategories, resetCategory]);

    useEffect(() => {
        resetSelect({
            selectedItems: [],
            selectAllItems: false
        });
    }, [fetchGallery, resetSelect]);

    return (
        <>
            <section className="pageHeader">
                <h1>Gallery Management</h1>
                <p>Manage your gallery items and categories</p>
            </section>

            {/* Category Management Section */}
            <section className="cardContainer">
                <div className="sectionHeader">
                    <div className="sectionHeading">
                        <MdCategory className="sectionIcon" />
                        <h2>Manage Categories</h2>
                    </div>
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

            {/* Gallery Add/Filter/Search Section */}
            <section className="cardContainer">
                <div className="sectionHeader">
                    <div className="sectionHeading">
                        <TbFilterSearch className="sectionIcon" />
                        <h2>Filter/Search</h2>
                    </div>
                    <button className={styles.addNewButton}
                        onClick={handleAddNewItem}
                    >
                        <IoAddCircleOutline />
                        Add New Item
                    </button>
                </div>

                {/* Search and Filter Bar */}
                <div className={styles.filterBar}>
                    <div className={styles.searchBox}>
                        <IoSearchOutline className={styles.searchIcon} />
                        <input type="text" className={styles.searchInput}
                            placeholder="Search by title..."
                            {...filterRegister("searchQuery", {
                                onChange: () => setCurrentPage(1)
                            })}
                        />
                    </div>
                    <select className={styles.filterSelect}
                        {...filterRegister("pageFilter", {
                            onChange: () => setCurrentPage(1)
                        })}
                    >
                        <option value="all">All</option>
                        <option value="portfolio">Portfolio</option>
                        <option value="filmedByVivek">FilmedByVivek</option>
                    </select>
                    {isFetchingCategory ? (
                        <LoadingSpinner size="sm" />
                    ) : (
                        <select className={styles.filterSelect}
                            {...filterRegister("categoryFilter", {
                                onChange: () => setCurrentPage(1)
                            })}
                        >
                            <option value="">All Categories</option>
                            {fetchCategories?.data.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                        </select>
                    )}
                </div>
            </section>

            {/* Gallery List Section */}
            <section className="cardContainer">
                <div className="sectionHeader flex-row">
                    <div className="sectionHeading">
                        <IoImagesOutline className="sectionIcon" />
                        <h2>Gallery Items</h2>
                    </div>
                    <button
                        className={styles.deleteAllActionButton}
                        onClick={handleDeleteSelectedItems}
                        disabled={isDeleting || selectedItemsLength === 0}
                        title="Delete Selected Items"
                    >
                        <MdDelete />
                    </button>
                </div>
                <div className="p-4 p-sm-6">
                    {/* Select All Gallery Items */}
                    <div className={styles.selectAllContainer}>
                        <div className={styles.selectedItemsInfo}>
                            Selected:
                            <span>{selectedItemsLength} item(s)</span>
                        </div>
                        <CheckboxInput
                            id="selectAllItems"
                            label="Select All"
                            name="selectAllItems"
                            register={selectRegister}
                            onChange={handleSelectAllGalleryItems}
                        />
                    </div>

                    {/* Gallery Grid */}
                    {isLoadingGallery ? (
                        <LoadingSpinner size="lg" />
                    ) : fetchGallery?.data.galleryItems.length === 0 ? (
                        <div className="emptyState">
                            <IoImagesOutline />
                            <h4>No gallery items found</h4>
                            <p>Add your first gallery item to get started</p>
                        </div>
                    ) : (
                        <div className={styles.galleryGrid}>
                            {fetchGallery?.data.galleryItems.map((item) => (
                                <div key={item._id} className={styles.galleryCard}>
                                    <div className={styles.cardCheckbox}>
                                        <CheckboxInput
                                            size="sm"
                                            id={`selectItem_${item._id}`}
                                            value={item._id}
                                            name="selectedItems"
                                            register={selectRegister}
                                        />
                                    </div>
                                    <div className={styles.cardThumbnail}>
                                        <img src={generateThumbnailUrl(item.cloudinaryData.secure_url,
                                            item.cloudinaryData.resource_type, 300, 200)}
                                            alt={item.title}
                                        />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <h3>{item.title}</h3>
                                        <span className={styles.categoryBadge}>
                                            {item.category.name}
                                        </span>
                                    </div>
                                    <div className={styles.cardActions}>
                                        <button
                                            className={`${styles.actionButton} ${styles.ratingLinkAction}`}
                                            onClick={() => handleGenerateRatingLink(item._id)}
                                            title="Get Rating Link"
                                        >
                                            <IoLink />
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.editAction}`}
                                            onClick={() => handleUpdateItem(item)}
                                            disabled={isUpdating}
                                            title="Edit Item"
                                        >
                                            <MdEdit />
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.deleteAction}`}
                                            onClick={() => handleDeleteItem(item._id, item.cloudinaryData.public_id)}
                                            disabled={isDeleting}
                                            title="Delete Item"
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
            {fetchGallery?.data.pagination.totalPages > 1 && (
                <section className="cardContainer p-4">
                    {isLoadingGallery ? (
                        <LoadingSpinner />
                    ) : (
                        <Pagination
                            pageCount={fetchGallery?.data.pagination.totalPages}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={fetchGallery?.data.pagination.totalItems}
                            setCurrentPage={setCurrentPage}
                        />
                    )}
                </section>
            )}

            {/* Add/Edit Modal */}
            {isGalleryModalOpen && (
                <section className={styles.modalOverlay}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{!!editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}</h2>
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsGalleryModalOpen(false)}
                            >
                                <IoCloseOutline />
                            </button>
                        </div>

                        <form onSubmit={gallerySubmit(onSubmitGallery)}
                            className="p-4 p-sm-6 pb-0" noValidate>

                            {/* Title */}
                            <div className="h-19 mb-2">
                                <label htmlFor="title" className={styles.modelLabel}>
                                    Title<span className="formRequiredStar">*</span>
                                </label>
                                <input type="text" id="title" className={`${styles.textInput}
                                    ${galleryErrors.title && "formInputErrorBorder"}
                                `}
                                    placeholder="Enter your project title"
                                    {...galleryRegister("title", {
                                        required: "Title is required"
                                    })}
                                />
                                <FormInputError message={galleryErrors.title?.message} />
                            </div>

                            {/* Main Category */}
                            <div className="h-19 mb-2">
                                <label htmlFor="category" className={styles.modelLabel}>
                                    Category<span className="formRequiredStar">*</span>
                                </label>
                                <select id="category" className={`${styles.categorySelect}
                                    ${galleryErrors.category && "formInputErrorBorder"}`}
                                    {...galleryRegister("category", {
                                        required: "Category is required"
                                    })}
                                >
                                    <option value="">Select a category</option>
                                    {fetchCategories?.data.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                <FormInputError message={galleryErrors.category?.message} />
                            </div>

                            {/* Cover Image */}
                            <div className="mb-4">
                                <MediaFileUploader
                                    name="coverFile"
                                    label="Cover Media"
                                    labelClass={styles.modelLabel}
                                    required={true}
                                    uploadFileType={uploadFileType}
                                    mediaFileControl={galleryControl}
                                    uploadFilePreview={uploadFilePreview}
                                    handleMediaRemove={handleMediaRemove}
                                    handleUploadFilePreview={handleUploadFilePreview}
                                />
                                <FormInputError message={galleryErrors.coverFile?.message} />
                            </div>

                            {/* Short Description */}
                            <div className="mb-2">
                                <label htmlFor="shortDescription" className={styles.modelLabel}>
                                    Short Description<span className="formRequiredStar">*</span>
                                </label>
                                <textarea id="shortDescription" className={`${styles.textAreaInput}
                                    ${galleryErrors.shortDescription && "formInputErrorBorder"}`}
                                    placeholder="Brief description for the card"
                                    rows="3"
                                    {...galleryRegister("shortDescription", {
                                        required: "Short description is required"
                                    })}
                                />
                                <FormInputError message={galleryErrors.shortDescription?.message} />
                            </div>

                            {/* Year */}
                            <div className="h-19 mb-2">
                                <label htmlFor="year" className={styles.modelLabel}>
                                    Year<span className="formRequiredStar">*</span>
                                </label>
                                <input type="number" id="year" className={`${styles.textInput}
                                    ${galleryErrors.year && "formInputErrorBorder"}`}
                                    placeholder="e.g., 2008"
                                    {...galleryRegister("year", {
                                        required: "Year is required",
                                        validate: value =>
                                            (value > 1900 && value <= new Date().getFullYear()) ||
                                            `Year must be between 1901 and ${new Date().getFullYear()}`
                                    })}
                                />
                                <FormInputError message={galleryErrors.year?.message} />
                            </div>

                            {/* Display Location Switch Component */}
                            <div className="mb-2">
                                <RadioInput
                                    name="pageLocation"
                                    label="Display Content on"
                                    labelClass={styles.modelLabel}
                                    register={galleryRegister}
                                />
                                <small className={styles.tagsHelperText}>
                                    The default page is set to Portfolio.
                                </small>
                            </div>

                            {/* Sub Tags */}
                            <div className="mb-2">
                                <label className={styles.modelLabel}>
                                    Sub Tags
                                    <sup className="formOptional">(optional)</sup>
                                </label>
                                <div className={`${styles.tagsInputWrapper} ${styles.modelTags}`}>
                                    <Controller
                                        name="subTags"
                                        control={galleryControl}
                                        rules={{
                                            validate: value =>
                                                ((value?.length || 0) <= 3)
                                                || "You can add up to 3 tags only"
                                        }}
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
                                    <FormInputError message={galleryErrors.subTags?.message} />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelButton}
                                    onClick={() => setIsGalleryModalOpen(false)}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitButton}
                                    disabled={isUploading}
                                >
                                    <IoSave />
                                    {(isUploading
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

            {/* Rating Link Modal */}
            {isRatingLinkModalOpen && (
                <section className={styles.modalOverlay} onClick={handleCloseRatingLinkModal}>
                    <div className={styles.ratingLinkModalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Rating Link Generated</h2>
                            <button className={styles.closeButton}
                                onClick={handleCloseRatingLinkModal}
                            >
                                <IoCloseOutline />
                            </button>
                        </div>

                        <div className="p-4 p-sm-6">
                            {isGeneratingLink ? (
                                <LoadingSpinner size="lg" text="Generating link..." />
                            ) : (
                                <>
                                    <p className={styles.modalDescription}>
                                        Share this unique link with your client to get their feedback and rating for the project:
                                    </p>

                                    <div className={styles.linkDisplayContainer}>
                                        <div className={styles.linkTextBox}>
                                            <IoLink className={styles.linkIcon} />
                                            <input
                                                type="text"
                                                value={currentRatingLink}
                                                readOnly
                                                className={styles.linkInput}
                                            />
                                        </div>
                                        <button className={`${styles.copyButton}
                                            ${isCopied ? styles.copied : ''}`}
                                            onClick={handleCopyToClipboard}
                                        >
                                            {isCopied ? (
                                                <>
                                                    <IoCheckmarkDone />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <IoCopy />
                                                    <span>Copy</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className={styles.infoBox}>
                                        <p>
                                            💡 <strong>Tip:</strong>
                                            This link is unique to this project and can be used by the client to submit their rating and feedback.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default Gallery;
