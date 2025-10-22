import ContactDetails from "../models/contactDetails.model.js";
import SocialMedia from "../models/SocialMedia.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError, ApiResponse } from "../utils/responseHandler.js";

// Update contact details (admin)
const updateContactDetails = asyncHandler(async (req, res) => {
    const { email, phone, address } = req.body;

    if(!email && !phone && !address) {
        throw new ApiError(400,
            "At least one contact detail (email, phone, address) must be provided for update.");
    }

    let contactDetails = await ContactDetails.findOne().sort({ createdAt: -1 });

    if(contactDetails) {
        // Update existing contact details
        contactDetails.email = email || contactDetails.email;
        contactDetails.phone = phone || contactDetails.phone;
        contactDetails.address = address || contactDetails.address;

        await contactDetails.save();
    } else {
        // Create new contact details
        contactDetails = new ContactDetails({
            email,
            phone,
            address
        });
        await contactDetails.save();
    }

    return ApiResponse.sendSuccess(res, { contactDetails }, "Contact details successfully updated.");
});

// Update and sync social media handles (admin send platform and url array)
const updateSocialMediaHandles = asyncHandler(async (req, res) => {
    const { socialLinks } = req.body;

    if(!Array.isArray(socialLinks)) {
        throw new ApiError(400, "Social media links must be an array.");
    }

    // Trim whitespace, filter out empty social links and remove duplicates platforms
    const cleanedList = [...new Map(socialLinks.map(link =>
        [link.platform.trim(), { platform: link.platform.trim(), url: link.url.trim() }])).values()]
        .filter(link => link.platform && link.url);

    // existing social media document
    const existingSocialMedia = await SocialMedia.find().sort({ createdAt: -1 });
    const existingPlatforms = existingSocialMedia.map(link => link.platform);

    // Find platforms what to add
    const existingPlatformsSet = new Set(existingPlatforms);
    const platformsToAdd = cleanedList.filter(link => !existingPlatformsSet.has(link.platform));

    // Find platforms what to remove
    const socialLinksSet = new Set(cleanedList.map(link => link.platform));
    const platformsToRemove = existingPlatforms.filter(platform => !socialLinksSet.has(platform));

    // Update existing social media links
    const updateLinks = cleanedList.map(link => ({
        updateOne: {
            filter: { platform: link.platform, url: { $ne: link.url } },
            update: { $set: { url: link.url } }
        }
    }));

    // Update existing social media links
    const result = await Promise.all([
        updateLinks.length > 0
            ? SocialMedia.bulkWrite(updateLinks) : Promise.resolve({ modifiedCount: 0 }),
        platformsToAdd.length > 0
            ? SocialMedia.insertMany(platformsToAdd) : Promise.resolve(),
        platformsToRemove.length > 0
            ? SocialMedia.deleteMany({ platform: { $in: platformsToRemove } }) : Promise.resolve()
    ]);

    const [updateResult, insertCount, deleteCount] = result;
    var message;

    if(!!updateResult.modifiedCount === false && !!insertCount === false && !!deleteCount === false) {
        message = "No changes made. All provided social links already exist.";
    } else {
        const messageParts = [];

        if(!!updateResult.modifiedCount) {
            messageParts.push(`${updateResult.modifiedCount} url(s) updated`);
        }

        if(!!insertCount) {
            messageParts.push(`${insertCount.length} added`);
        }

        if(!!deleteCount) {
            messageParts.push(`${deleteCount.deletedCount} removed`);
        }

        message = `Social links successfully updated: ${messageParts.join(", ")}.`;
    }

    return ApiResponse.sendSuccess(res, "", message);
});

// Fetch contact details (public)
const fetchContactAndSocialDetails = asyncHandler(async (req, res) => {
    const contactDetails = await ContactDetails.findOne().select("-_id -__v -createdAt -updatedAt");
    const socialMediaLinks = await SocialMedia.find().select("-__v -createdAt -updatedAt");

    if (!contactDetails) {
        return ApiError.sendNotFound(res, "Contact details not found.");
    }

    return ApiResponse.sendSuccess(res, { contactDetails, socialMediaLinks }, "Contact and social media details successfully fetched.");
});

export {
    updateContactDetails,
    updateSocialMediaHandles,
    fetchContactAndSocialDetails
};