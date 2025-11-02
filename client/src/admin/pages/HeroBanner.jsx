import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { IoImagesOutline, IoSave } from "react-icons/io5";
import FormInputError from "../../components/FormInputError";
import LoadingSpinner from "../../components/LoadingSpinner";
import UploadProgressBar from "../components/UploadProgressBar";
import MediaFileUploader from "../components/MediaFileUploader";
import { uploadFileCloudinary } from "../../../utils/cloudinaryUtils";
import { useGenerateSignatureMutation } from "../../../store/api/cloudinaryApiSlice";
import { useGetHeroBannerQuery, useSyncHeroBannerMutation } from "../../../store/api/bannerApiSlice";
import styles from "./styles/HeroBanner.module.css";

const HeroBanner = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadFileType, setUploadFileType] = useState(null);
    const [uploadFilePreview, setUploadFilePreview] = useState(null);
    const [uploadCancelToken, setUploadCancelToken] = useState(null);

    const {
        reset: resetBanner,
        control: bannerControl,
        handleSubmit: bannerSubmit,
        formState: { errors: bannerErrors }
    } = useForm();

    const { data: fetchHeroBanner, isLoading: isFetchingHeroBanner } = useGetHeroBannerQuery();
    const [syncHeroBanner, { isSuccess: isHeroBannerSynced }] = useSyncHeroBannerMutation();

    const [generateSignature] = useGenerateSignatureMutation();

    // console.log("Fetched Hero Banner:", fetchHeroBanner);

    // Submit banner form
    const onSubmitBanner = async (data) => {
        try {
            setIsUploading(true);

            if(data.bannerFile && data.bannerFile instanceof File) {
                const signatureData = await generateSignature({ folder: uploadFileType }).unwrap();
                const responseUpload = await uploadFileCloudinary(
                    data.bannerFile, signatureData.data,
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

                // Now sync with backend
                await syncHeroBanner({ cloudinaryData }).unwrap();
            }
        } catch (error) {
            toast.error("Failed to upload and sync hero banner.");
        } finally {
            setIsUploading(false);
            setUploadFilePreview(null);
        }
    }

    const handleUploadFilePreview = (file) => {
        if(file) {
            setUploadFilePreview(URL.createObjectURL(file));
            setUploadFileType(file.type.startsWith("image/") ? "banner_images" : "banner_videos");
        }
    };

    const handleMediaRemove = () => {
        setUploadFilePreview(null);
        resetBanner({ bannerFile: null });
    };

    const handleCancelUpload = () => {
        if(uploadCancelToken) uploadCancelToken.cancel("Upload canceled by user.");
        setUploadProgress(0);
    };

    useEffect(() => {
        setUploadFilePreview(fetchHeroBanner?.data?.cloudinaryData.secure_url || null);
        setUploadFileType(fetchHeroBanner?.data?.cloudinaryData.resource_type === "video"
            ? "banner_videos" : "banner_images"
        );
    }, [fetchHeroBanner, isHeroBannerSynced]);

    return (
        <>
            <section className={styles.pageHeader}>
                <h1>Hero Banner Management</h1>
                <p>Manage your hero banners and their settings</p>
            </section>

            <section className={styles.cardContainer}>
                <div className={styles.sectionHeader}>
                    <IoImagesOutline className={styles.sectionIcon} />
                    <h2>Manage Hero Banner</h2>
                </div>
                <div className="p-6">
                    {isFetchingHeroBanner && <LoadingSpinner size="lg" />}
                    <form onSubmit={bannerSubmit(onSubmitBanner)}>
                        <div className="mb-6">
                            <MediaFileUploader
                                name="bannerFile"
                                label="Banner Media"
                                labelClass={styles.mediaLabel}
                                required={true}
                                uploadFileType={uploadFileType}
                                mediaFileControl={bannerControl}
                                uploadFilePreview={uploadFilePreview}
                                handleMediaRemove={handleMediaRemove}
                                handleUploadFilePreview={handleUploadFilePreview}
                            />
                            <FormInputError message={bannerErrors.bannerFile?.message} />
                        </div>

                        <div className={styles.formActions}>
                            <button type="submit" className={styles.submitButton}
                                disabled={isUploading}
                            >
                                <IoSave />
                                {(isUploading
                                    ? "Saving..." : "Save New Banner")}
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
        </>
    )
}

export default HeroBanner;