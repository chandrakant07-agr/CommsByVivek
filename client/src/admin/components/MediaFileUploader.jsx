import { useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import styles from "./styles/MediaFileUploader.module.css";

const MediaFileUploader = ({
    name,
    label,
    required = false,
    uploadFileType,
    mediaFileControl,
    uploadFilePreview,
    handleMediaRemove,
    handleUploadFilePreview,
}) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Handle drag events for cover image
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <>
            <label htmlFor={`${label}_media`}>
                {label}{required && <span className="fromRequiredStar">*</span>}
            </label>
            {uploadFilePreview ? (
                <div className={styles.imagePreviewContainer}>
                    {uploadFileType === "gallery_videos" ? (
                        <video controls className={styles.imagePreview}>
                            <source src={uploadFilePreview} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img src={uploadFilePreview} alt="Cover preview"
                            className={styles.imagePreview} />
                    )}
                    <button type="button" className={styles.removeImageButton}
                        onClick={handleMediaRemove}
                    >
                        <MdDelete /> Remove
                    </button>
                </div>
            ) : (
                <Controller
                    name={name}
                    control={mediaFileControl}
                    render={({ field }) => (
                        <div
                            className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''}`}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={(e) => (
                                e.preventDefault(),
                                e.stopPropagation(),
                                setIsDragging(false),
                                field.onChange(e.dataTransfer.files[0]),
                                handleUploadFilePreview(e.dataTransfer.files[0])
                            )}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <IoCloudUploadOutline />
                            <h3>Drag & Drop Cover Media</h3>
                            <p>or click to browse</p>
                            <small>JPG, PNG, GIF, WEBP</small>
                            <small>MP4, AVI, MOV</small>
                            <input type="file" id="media"
                                ref={fileInputRef}
                                accept="image/*, video/*"
                                onChange={(e) => (
                                    field.onChange(e.target.files[0]),
                                    handleUploadFilePreview(e.target.files[0])
                                )}
                                className="d-none"
                            />
                        </div>
                    )}
                />
            )}
        </>
    );
};

export default MediaFileUploader;