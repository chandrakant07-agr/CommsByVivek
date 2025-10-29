import Category from "../models/category.model.js";
import Gallery from "../models/gallery.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import sanitizeInput from "../utils/sanitizeInputField.js";
import { ApiError, ApiResponse } from "../utils/responseHandler.js";
import { cloudinaryDelete } from "../utils/cloudinarySignature.js";

// fetch gallery items (for public use)
const fetchGalleryItems = asyncHandler(async (req, res) => {
    const { search, category, pageNo, limit } = req.query;
    
    const query = {};

    // search by title
    if(search) query.title = { $regex: search, $options: "i" };

    // filter by category
    if(category && category !== "all") query.category = category;

    // Pagination
    const page = parseInt(pageNo, 10) > 0 ? parseInt(pageNo, 10) : 1;
    const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const skip = (page - 1) * pageSize;

    // Fetch gallery items with pagination
    const totalItems = await Gallery.countDocuments(query);
    const galleryItems = await Gallery.find(query)
        .populate('category', 'name _id')
        .select("-__v -createdAt -updatedAt")
        .sort({ year: -1, title: 1 })
        .skip(skip)
        .limit(pageSize);

    return ApiResponse.sendSuccess(res, {
        galleryItems,
        pagination: {
            totalItems,
            currentPage: page,
            pageLimit: pageSize,
            totalPages: Math.ceil(totalItems / pageSize)
        }
    }, "Gallery items successfully fetched.");
});

// admin: add new gallery item
const addGalleryItem = asyncHandler(async (req, res) => {
    const { title, category, cloudinaryData, shortDescription, year, subTags } = req.body;

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
        subTags: Array.isArray(subTags) ? subTags.map(tag => sanitizeInput(tag)).filter(Boolean) : []
    });

    await newGalleryItem.save();

    return ApiResponse.sendSuccess(res, "newGalleryItem", "Gallery item successfully added.");
});

// admin: update gallery item
const updateGalleryItem = asyncHandler(async (req, res) => {
    const { id } = req.query;
    const { title, category, cloudinaryData, shortDescription, year, subTags } = req.body;

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

// admin: delete gallery item
const deleteGalleryItem = asyncHandler(async (req, res) => {
    const { id } = req.query;

    const deletedGalleryItem = await Gallery.findByIdAndDelete(id);

    await cloudinaryDelete(deletedGalleryItem.cloudinaryData.public_id);

    if (!deletedGalleryItem) {
        throw new ApiError(404, "Gallery item not found.");
    }

    return ApiResponse.sendSuccess(res, "", "Gallery item successfully deleted.");
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
    updateGalleryItem,
    deleteGalleryItem,
    syncGalleryCategory,
    fetchGalleryCategories
};