import Gallery from "../models/gallery.model.js";
import Category from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import sanitizeInput from "../utils/sanitizeInputField.js";
import { cloudinaryDelete } from "../utils/cloudinarySignature.js";
import { ApiError, ApiResponse } from "../utils/responseHandler.js";

// fetch gallery items (for public use)
const fetchGalleryItems = asyncHandler(async (req, res) => {
    const { search, pageLocation, category, pageNo, limit, initialSkip = 0 } = req.query;

    const query = {};

    // search by title
    if (search) query.title = { $regex: search, $options: "i" };

    // filter by page location
    if (pageLocation && pageLocation !== "all") query.pageLocation = pageLocation;

    // filter by category
    if (category && category !== "all") query.category = category;

    // Pagination
    const page = parseInt(pageNo, 10) > 0 ? parseInt(pageNo, 10) : 1;
    const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const skip = (page - 1) * pageSize + parseInt(initialSkip, 10);

    // Fetch gallery items with pagination
    const totalItems = await Gallery.countDocuments(query);
    const galleryItems = await Gallery.find(query)
        .populate('category', 'name _id')
        .select("-__v -createdAt -updatedAt")
        .sort({ year: -1, title: 1 })
        .skip(skip)
        .limit(pageSize);

    const pagination = {
        totalItems,
        currentPage: page,
        pageLimit: pageSize,
        totalPages: Math.ceil(totalItems / pageSize)
    };

    return ApiResponse.sendSuccess(res, {
        galleryItems,
        pagination
    }, "Gallery items successfully fetched.");
});

// fetch total gallery items count
const fetchTotalGallery = asyncHandler(async (req, res) => {
    const totalItems = await Gallery.countDocuments();
    return ApiResponse.sendSuccess(res, { totalItems }, "Total gallery items count fetched successfully.");
});

// admin: add new gallery item
const addGalleryItem = asyncHandler(async (req, res) => {
    const { title, category, cloudinaryData, shortDescription, year, pageLocation, subTags } = req.body;

    if (!title || !category || !shortDescription || !year) {
        throw new ApiError(400, "All required fields must be provided.");
    }

    if (typeof cloudinaryData !== "object" || Object.keys(cloudinaryData).length === 0) {
        throw new ApiError(400, "file upload data is missing or invalid.");
    }

    // check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        throw new ApiError(400, "Provided category does not exist.");
    }

    // create new gallery item
    const newGalleryItem = new Gallery({
        category,
        cloudinaryData,
        year: Number(year),
        title: sanitizeInput(title),
        shortDescription: sanitizeInput(shortDescription),
        pageLocation: pageLocation,
        subTags: Array.isArray(subTags) ? subTags.map(tag => sanitizeInput(tag)).filter(Boolean) : []
    });

    await newGalleryItem.save();

    return ApiResponse.sendSuccess(res, "newGalleryItem", "Gallery item successfully added.");
});

// admin: update gallery item
const updateGalleryItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, category, cloudinaryData, shortDescription, year, pageLocation, subTags } = req.body;

    if (!title || !category || !shortDescription || !year) {
        throw new ApiError(400, "Title, Category, Short Description and Year are required.");
    }

    // check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        throw new ApiError(400, "Provided category does not exist.");
    }

    const updatePayload = {
        category,
        year: Number(year),
        title: sanitizeInput(title),
        shortDescription: sanitizeInput(shortDescription),
        pageLocation: sanitizeInput(pageLocation),
        subTags: Array.isArray(subTags) ? subTags.map(tag => sanitizeInput(tag)).filter(Boolean) : []
    };

    if (typeof cloudinaryData === "object" && Object.keys(cloudinaryData).length > 0) {
        updatePayload.cloudinaryData = cloudinaryData;
        await cloudinaryDelete(req.body.oldCloudinaryPublicId);
    }

    const updatedGalleryItem = await Gallery.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!updatedGalleryItem) {
        throw new ApiError(404, "Gallery item not found.");
    }

    return ApiResponse.sendSuccess(res, updatedGalleryItem, "Gallery item successfully updated.");
});

// admin: delete gallery item (single/bulk)
const deleteGalleryItem = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Please provide at least one gallery item ID to delete.");
    }

    // get cloudinary public ids before deletion
    const galleryPublicIds = await Gallery.find({ _id: { $in: ids } })
        .select("cloudinaryData.public_id");

    if (galleryPublicIds.length === 0) {
        throw new ApiError(404, "No gallery items found with the provided ID(s).");
    }

    // delete gallery items from database
    const deletedGalleryItems = await Gallery.deleteMany({ _id: { $in: ids } });

    if (deletedGalleryItems.deletedCount === 0) {
        throw new ApiError(404, "No gallery items found with the provided ID(s).");
    }

    // delete images from cloudinary
    await Promise.all(galleryPublicIds.map(item => cloudinaryDelete(item.cloudinaryData.public_id)));

    if (!deletedGalleryItems) {
        throw new ApiError(404, "Gallery items not found.");
    }

    return ApiResponse.sendSuccess(res, "", "Gallery items successfully deleted.");
});

// admin sends a new gallery category array to sync the existing gallery categories
const syncGalleryCategory = asyncHandler(async (req, res) => {
    const { categories } = req.body;

    if (!Array.isArray(categories)) {
        throw new ApiError(400, "Categories must be a non-empty array.");
    }

    // Trim whitespace, filter out empty categories and remove duplicates
    const cleanedList = [...new Set(categories.map(cat => cat.trim()).filter(Boolean))];

    // sanitize category names removing any HTML tags
    const sanitizedList = cleanedList.map(cat => sanitizeInput(cat)).filter(Boolean);

    // Find existing categories in the database
    const existingCategories = await Category.find().select("-_id name");
    const existingCategoriesNames = existingCategories.map(cat => cat.name);

    // filter out names what to add
    const existingCategoriesSet = new Set(existingCategoriesNames);
    const categoriesToAdd = sanitizedList.filter(name => !existingCategoriesSet.has(name));

    // filter out names what to remove
    const sanitizedListSet = new Set(sanitizedList);
    const categoriesToRemove = existingCategoriesNames.filter(name => !sanitizedListSet.has(name));

    // update and remove categories in the database
    const [insertCount, deleteCount] = await Promise.all([
        categoriesToAdd.length > 0
            ? Category.insertMany(categoriesToAdd.map(name => ({ name }))) : Promise.resolve(),
        categoriesToRemove.length > 0
            ? Category.deleteMany({ name: { $in: categoriesToRemove } }) : Promise.resolve()
    ]);

    var message;

    if (!!insertCount === false && !!deleteCount === false) {
        message = "No changes made. All provided categories already exist.";
    } else {
        const messageParts = [];

        if (!!insertCount) {
            messageParts.push(`${insertCount.length} added`);
        }

        if (!!deleteCount) {
            messageParts.push(`${deleteCount.deletedCount} removed`);
        }

        message = `Categories successfully updated: ${messageParts.join(", ")}.`;
    }

    return ApiResponse.sendSuccess(res, "", message);
});

// fetch gallery categories (for public use)
const fetchGalleryCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().select("-__v -createdAt -updatedAt").sort({ name: 1 });
    return ApiResponse.sendSuccess(res, categories, "Gallery categories fetched successfully.");
});

export {
    addGalleryItem,
    fetchGalleryItems,
    fetchTotalGallery,
    updateGalleryItem,
    deleteGalleryItem,
    syncGalleryCategory,
    fetchGalleryCategories
};