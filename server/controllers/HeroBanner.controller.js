import HeroBanner from "../models/HeroBanner.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError, ApiResponse } from "../utils/responseHandler.js";
import { cloudinaryDelete } from "../utils/cloudinarySignature.js";

// fetch hero banners (for public use)
const fetchHeroBanners = asyncHandler(async (req, res) => {
    const heroBanners = await HeroBanner.findOne()
        .select("_id cloudinaryData.public_id cloudinaryData.secure_url cloudinaryData.resource_type");

    return ApiResponse.sendSuccess(res, heroBanners, "Hero banners successfully fetched.");
});

// admin: sync new hero banner
const syncHeroBanner = asyncHandler(async (req, res) => {
    const { cloudinaryData } = req.body;

    if (typeof cloudinaryData !== "object" || Object.keys(cloudinaryData).length === 0) {
        throw new ApiError(400, "file upload data is missing or invalid.");
    }

    // find and delete hero banners and get public_ids to delete images from cloudinary
    const existingBanners = await HeroBanner.findOneAndDelete().select("cloudinaryData.public_id -_id");

    if(existingBanners && existingBanners.cloudinaryData && existingBanners.cloudinaryData.public_id) {
        const publicIdsToDelete = existingBanners.cloudinaryData.public_id;
        await cloudinaryDelete(publicIdsToDelete);
    }

    await HeroBanner.create({ cloudinaryData });

    return ApiResponse.sendSuccess(res, "Success Sync", "Hero banner successfully synced.");
});

export {
    syncHeroBanner,
    fetchHeroBanners
};