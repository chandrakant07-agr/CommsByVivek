import crypto from "crypto";
import Rating from "../models/rating.model.js";
import Gallery from "../models/gallery.model.js";
import Category from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import sanitizeInput from "../utils/sanitizeInputField.js";
import { ApiError, ApiResponse } from "../utils/responseHandler.js";

// fetch all ratings
const fetchAllRatings = asyncHandler(async (req, res) => {
    const { search, status, sortBy, pageNo, limit, initialSkip = 0 } = req.query;
    // console.log(req.query);

    const query = {};

    // search by project title
    if (search) {
        const projects = await Gallery.find({ title: { $regex: search, $options: "i" } }).select("_id");
        const projectIds = projects.map(proj => proj._id);
        query.project = { $in: projectIds };
    }

    // filter by status
    if (status && status !== "all") query.status = status;

    // Sorting
    const sortCriteria = { createdAt: -1 }; // default sort by newest
    if (sortBy === "newest") sortCriteria.createdAt = -1;
    else if (sortBy === "oldest") sortCriteria.createdAt = 1;
    else if (sortBy === "lowest") sortCriteria.overallRating = 1;
    else if (sortBy === "highest") sortCriteria.overallRating = -1;

    // Pagination
    const page = parseInt(pageNo, 10) > 0 ? parseInt(pageNo, 10) : 1;
    const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const skip = (page - 1) * pageSize + parseInt(initialSkip, 10);

    // Fetch ratings with pagination and sorting
    const totalItems = await Rating.countDocuments(query);
    const ratings = await Rating.find(query)
        .populate({
            path: 'project',
            select: 'title category',
            populate: {
                path: 'category',
                select: 'name'
            }
        })
        .select("-__v -updatedAt -token")
        .sort(sortCriteria)
        .skip(skip)
        .limit(pageSize);

    const pagination = {
        totalItems,
        currentPage: page,
        pageLimit: pageSize,
        totalPages: Math.ceil(totalItems / pageSize)
    };

    return ApiResponse.sendSuccess(res, {
        ratings,
        pagination
    }, "Ratings successfully fetched.");
});

// get total ratings items count and overall average rating
const fetchTotalRatingsCount = asyncHandler(async (req, res) => {
    const totalItems = await Rating.countDocuments();
    const aggregateResult = await Rating.aggregate([
        { $match: { status: "approved" } },
        { $group: {
            _id: null,
            averageRating: { $avg: "$overallRating" }
        }}
    ]);

    const overallRating = aggregateResult.length > 0 ? aggregateResult[0].averageRating : 0;

    return ApiResponse.sendSuccess(res, {
        totalItems,
        overallRating: parseFloat(overallRating.toFixed(2))
    }, "Total ratings count and overall average rating fetched successfully.");
});

// fetch a rating by Token
const fetchRatingByToken = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        throw new ApiError(400, "Rating token is required.");
    }

    const rating = await Rating.findOne({ token })
        .select("project status").populate('project', 'title');

    if (!rating) {
        throw new ApiError(404, "Rating not found for the provided token.");
    }

    return ApiResponse.sendSuccess(res, rating, "Rating fetched successfully.");
});

// client submit rating
const submitRating = asyncHandler(async (req, res) => {
    const { token, overallRating, parameterRatings, testimonial, clientName, clientCompany } = req.body;

    // client company is optional
    if (!token || !overallRating || !testimonial || !clientName) {
        throw new ApiError(400, "Token, Overall Rating, Testimonial, and Client Name are required.");
    }

    const ratingEntry = await Rating.findOne({ token });
    if (!ratingEntry) {
        throw new ApiError(404, "Invalid rating token.");
    }

    if (ratingEntry.status !== "pending") {
        throw new ApiError(400, "This rating has already been submitted.");
    }

    ratingEntry.status = "submitted";
    ratingEntry.submittedAt = new Date();
    ratingEntry.overallRating = overallRating;
    ratingEntry.parameterRatings = parameterRatings;
    ratingEntry.clientName = sanitizeInput(clientName);
    ratingEntry.testimonial = sanitizeInput(testimonial);
    ratingEntry.clientCompany = sanitizeInput(clientCompany);

    await ratingEntry.save();

    return ApiResponse.sendSuccess(res, ratingEntry, "Rating successfully submitted.");
});

// admin generate new rating link
const generateRatingLink = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate required fields
    if (!id) {
        throw new ApiError(400, "Project ID is required.");
    }

    // Check if project exists
    const project = await Gallery.findById(id);
    if (!project) {
        throw new ApiError(404, "Project not found.");
    }

    var rating;
    var message;

    const existProject = await Rating.findOne({ project: id }).populate('project', 'title');

    if (!existProject) {
        // Generate unique token
        const token = crypto.randomBytes(32).toString("hex");

        // Create new rating link
        rating = await Rating.create({ project: id, token });
        rating = await rating.populate('project', 'title');
        message = "New rating link successfully generated.";
    } else {
        rating = existProject;
        message = "Rating link already exists for this project.";
    }

    return ApiResponse.sendSuccess(res, rating, message);
});

// admin update rating status (single/bulk)
const updateRatingStatus = asyncHandler(async (req, res) => {
    const { ids, status } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Please provide an array of rating IDs to update.");
    }

    if (status !== "approved") {
        throw new ApiError(400, "Invalid status value. Allowed values are: approved.");
    }

    const updateResult = await Rating.updateMany({
        _id: { $in: ids } },
        { $set: { status, approvedAt: new Date() }
    });

    if (updateResult.matchedCount === 0) {
        throw new ApiError(404, "No ratings found with the provided ID(s).");
    }

    return ApiResponse.sendSuccess(res, updateResult, "Rating statuses successfully updated.");
});

// admin delete ratings (single/bulk)
const deleteRating = asyncHandler(async (req, res) => {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Please provide an array of rating IDs to delete.");
    }

    const deleteResult = await Rating.deleteMany({ _id: { $in: ids } });

    if (deleteResult.deletedCount === 0) {
        throw new ApiError(404, "No ratings found with the provided ID(s).");
    }

    return ApiResponse.sendSuccess(res, "", "Ratings successfully deleted.");
});

export {
    fetchRatingByToken,
    generateRatingLink,
    updateRatingStatus,
    fetchTotalRatingsCount,
    fetchAllRatings,
    submitRating,
    deleteRating
};