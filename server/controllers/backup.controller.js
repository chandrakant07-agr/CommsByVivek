import Rating from "../models/rating.model.js";
import Message from "../models/message.model.js";
import Gallery from "../models/gallery.model.js";
import Category from "../models/category.model.js";
import HeroBanner from "../models/heroBanner.model.js";
import ProjectType from "../models/projectType.model.js";
import SocialMedia from "../models/SocialMedia.model.js";
import ContactDetails from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const downloadBackup = asyncHandler(async (req, res, next) => {
    const [
       ratings, messages, galleries, categories, heroBanners, socialMedia, projectTypes, contactDetails
    ] = await Promise.all([
        Rating.find(),
        Message.find(),
        Gallery.find(),
        Category.find(),
        HeroBanner.find(),
        SocialMedia.find(),
        ProjectType.find(),
        ContactDetails.find(),
    ]);

    const backupData = {
        metadata: {
            backupDate: new Date().toISOString(),
            version: '1.0',
            collections: ['ratings', 'messages', 'galleries', 'categories', 'heroBanners', 'socialMedia', 'projectTypes', 'contactDetails']
        },
        data: {
            ratings,
            messages,
            galleries,
            categories,
            heroBanners,
            socialMedia,
            projectTypes,
            contactDetails
        }
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=database-backup.json');
    res.status(200).json(backupData);
});

export { downloadBackup };