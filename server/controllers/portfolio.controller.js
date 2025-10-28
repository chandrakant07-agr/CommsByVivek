import Category from "../models/category.model.js";
import Portfolio from "../models/portfolio.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import sanitizeInput from "../utils/sanitizeInputField.js";
import { ApiError, ApiResponse } from "../utils/responseHandler.js";
import { cloudinaryDelete } from "../utils/cloudinarySignature.js";

// fetch portfolio items (for public use)
const fetchPortfolioItems = asyncHandler(async (req, res) => {
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

    // Fetch portfolio items with pagination
    const totalItems = await Portfolio.countDocuments(query);
    const portfolioItems = await Portfolio.find(query)
        .populate('category', 'name _id')
        .select("-__v -createdAt -updatedAt")
        .sort({ year: -1, title: 1 })
        .skip(skip)
        .limit(pageSize);

    return ApiResponse.sendSuccess(res, {
        portfolioItems,
        pagination: {
            totalItems,
            currentPage: page,
            pageLimit: pageSize,
            totalPages: Math.ceil(totalItems / pageSize)
        }
    }, "Portfolio items successfully fetched.");
});

// admin: add new portfolio item
const addPortfolioItem = asyncHandler(async (req, res) => {
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

    // create new portfolio item
    const newPortfolioItem = new Portfolio({
        category,
        cloudinaryData,
        year: Number(year),
        title: sanitizeInput(title),
        shortDescription: sanitizeInput(shortDescription),
        subTags: Array.isArray(subTags) ? subTags.map(tag => sanitizeInput(tag)).filter(Boolean) : []
    });

    await newPortfolioItem.save();

    return ApiResponse.sendSuccess(res, "newPortfolioItem", "Portfolio item successfully added.");
});

// admin: update portfolio item
const updatePortfolioItem = asyncHandler(async (req, res) => {
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

    const updatedPortfolioItem = await Portfolio.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!updatedPortfolioItem) {
        throw new ApiError(404, "Portfolio item not found.");
    }

    return ApiResponse.sendSuccess(res, updatedPortfolioItem, "Portfolio item successfully updated.");
});

// admin: delete portfolio item
const deletePortfolioItem = asyncHandler(async (req, res) => {
    const { id } = req.query;

    const deletedPortfolioItem = await Portfolio.findByIdAndDelete(id);
    
    await cloudinaryDelete(deletedPortfolioItem.cloudinaryData.public_id);

    if (!deletedPortfolioItem) {
        throw new ApiError(404, "Portfolio item not found.");
    }

    return ApiResponse.sendSuccess(res, "", "Portfolio item successfully deleted.");
});

// admin sends a new portfolio category array to sync the existing portfolio categories
const syncPortfolioCategory = asyncHandler(async (req, res) => {
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

// fetch portfolio categories (for public use)
const fetchPortfolioCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().select("-__v -createdAt -updatedAt").sort({ name: 1 });
    return ApiResponse.sendSuccess(res, categories, "Portfolio categories fetched successfully.");
});

export {
    addPortfolioItem,
    fetchPortfolioItems,
    updatePortfolioItem,
    deletePortfolioItem,
    syncPortfolioCategory,
    fetchPortfolioCategories
};