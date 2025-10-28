import asyncHandler from "../utils/asyncHandler.js";
import { cloudinarySignature } from "../utils/cloudinarySignature.js";
import { ApiError, ApiResponse } from "../utils/responseHandler.js";

// admin: generate cloudinary signature for secure upload
const generateSignature = asyncHandler(async (req, res) => {
    const { folder } = req.body;

    if(!folder) {
        throw new ApiError(400, "Folder is required.");
    }

    const api_Key = process.env.CLOUDINARY_API_KEY;
    const timestamp = Math.round((new Date).getTime() / 1000);
    const signature = cloudinarySignature(timestamp, folder);
    const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`;

    return ApiResponse.sendSuccess(res, {
        api_Key,
        timestamp,
        signature,
        uploadUrl
    }, "Cloudinary upload signature successfully generated.");
});

export {
    generateSignature
};