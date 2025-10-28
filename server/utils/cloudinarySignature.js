import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from './responseHandler.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const cloudinarySignature = (timestamp, folder) => {
    const signature = cloudinary.utils.api_sign_request({
        timestamp,
        folder
    }, process.env.CLOUDINARY_API_SECRET);

    return signature;
};

const cloudinaryDelete = async (publicId) => {
    const resource_type = publicId.split('/')[0] === "portfolio_videos" ? "video" : "image";
    try {
        return await cloudinary.uploader.destroy(publicId, {
            resource_type
        });
    } catch (error) {
        throw new ApiError(500, `Cloudinary deletion error: ${error.message}`);
    }
};

export { cloudinarySignature, cloudinaryDelete };