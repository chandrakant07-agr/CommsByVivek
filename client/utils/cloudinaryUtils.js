import axios from "axios";
import { toast } from "react-toastify";

const generateThumbnailUrl = (secureUrl, resourceType, width, height) => {
    if(!secureUrl) return '';

    const baseUrl = secureUrl.split('/upload/');
    const publicPart = baseUrl[1].split('.')[0];
    const transformation = resourceType === 'image'
        ? `w_${width},h_${height},c_fill,f_auto,q_auto`
        : `w_${width},h_${height},c_fill,f_auto,q_auto`;

    return `${baseUrl[0]}/upload/${transformation}/${publicPart}.png`;
}

/**
 * Uploads a file to Cloudinary.
 *
 * @param {File} file The file object to upload.
 * @param {object} signatureData The signature data from the backend.
 * @param {string} uploadFileType The folder name in Cloudinary.
 * @param {function} setUploadCancelToken State setter for the cancel token source.
 * @param {function} setUploadProgress State setter for the upload progress (0-100).
 * @returns {Promise<object | null>} 
 *      The response data from Cloudinary on success, or null on failure/cancellation.
 */

const uploadFileCloudinary = async (
    file, signatureData, uploadFileType, setUploadProgress, setUploadCancelToken
) => {
    if(!file) return null;

    const source = axios.CancelToken.source();
    setUploadCancelToken(source);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("resource_type", "auto");
    formData.append("folder", uploadFileType);
    formData.append("api_key", signatureData.api_Key);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);
    formData.append("eager", signatureData.eager);

    try {
        const responseUpload = await axios.post(signatureData.uploadUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);

                setUploadProgress(progress);

                // Reset progress after a short delay
                if(progress === 100) setTimeout(() => setUploadProgress(0), 1000);
                // console.log(`Upload Progress: ${progress}%`);
            },
            cancelToken: source.token
        })

        return responseUpload.data;

    } catch (error) {
        if(axios.isCancel(error)) toast.error(error.message);
        else toast.error("File upload failed. Please try again.");

        throw error;
    }
}

export { generateThumbnailUrl, uploadFileCloudinary };