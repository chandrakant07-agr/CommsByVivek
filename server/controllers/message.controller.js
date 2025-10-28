import sanitize from "sanitize-html";
import Message from "../models/message.model.js";
import ProjectType from "../models/projectType.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError, ApiResponse } from "../utils/responseHandler.js";


// Fetch all messages (admin)
const fetchAllMessages = asyncHandler(async (req, res) => {
    const { search, status, prType, sortBy, pageNo, limit } = req.query;

        

    // Search by name or email
    if(search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];
    }

    // Filter by read/unread status
    if(status === "read") query.isRead = true;
    else if(status === "unread") query.isRead = false;

    // Filter by project type
    if(prType && prType !== "all") {
        query.projectType = prType;
    }

    // Sorting
    const sortCriteria = { createdAt: -1 };   // default sort by newest
    if(sortBy === "oldest") sortCriteria.createdAt = 1;
    else if(sortBy === "nameAsc") sortCriteria.name = 1;
    else if(sortBy === "nameDesc") sortCriteria.name = -1;
    else if(sortBy === "emailAsc") sortCriteria.email = 1;
    else if(sortBy === "emailDesc") sortCriteria.email = -1;

    // Pagination
    const page = parseInt(pageNo, 10) > 0 ? parseInt(pageNo, 10) : 1;
    const pageSize = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const skip = (page - 1) * pageSize;

    // Fetch messages with pagination and sorting
    const totalMsg = await Message.countDocuments(query);
    const msgList = await Message.find(query)
        .populate("projectType", "name")
        .sort(sortCriteria)
        .skip(skip)
        .limit(pageSize);

    return ApiResponse.sendSuccess(res, {
        msgList,
        pagination: {
            totalMsg,
            currentPage: page,
            pageLimit: pageSize,
            totalPages: Math.ceil(totalMsg / pageSize)
        }
    }, "Messages successfully fetched.");
});

// Fetch message by ID (admin)
const fetchMessageById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ID format
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid message ID format.");
    }

    const message = await Message.findById(id).populate("projectType", "name");
    if(!message) {
        throw new ApiError(404, "Message not found.");
    }

    return ApiResponse.sendSuccess(res, message, "Message successfully fetched.");
});

// Fetch message statistics (admin)
const fetchTodayMsgStats = asyncHandler(async (req, res) => {
    const [
        totalMsg, readMsg, thisMonthMsg, thisWeekMsg, todayMsg, todayMsgList
    ] = await Promise.all([
        Message.countDocuments(),
        Message.countDocuments({ isRead: true }),
        Message.countDocuments({
            createdAt: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            }
        }),
        Message.countDocuments({
            createdAt: {
                $gte: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())),
                $lt: new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + 7))
            }
        }),
        Message.countDocuments({
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        }),
        Message.find({
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        }).populate("projectType", "name").sort({ createdAt: -1 })
    ]);

    const unreadMsg = totalMsg - readMsg;

    return ApiResponse.sendSuccess(res, {
        totalMsg, readMsg, unreadMsg, thisMonthMsg, thisWeekMsg, todayMsg, todayMsgList
    }, "Message statistics successfully fetched.");
});

// Update message status to read/unread (single/bulk)
const updateMessageStatus = asyncHandler(async (req, res) => {
    const { ids, isRead } = req.body;

    if(typeof isRead !== "boolean") {
        throw new ApiError(400, "isRead must be a boolean value.");
    }

    if(!Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Please provide at least one message ID to update.");
    }

    // Update the message status
    const results = await Message.updateMany(
        { _id: { $in: ids } },
        { $set: { isRead } }
    );

    if(results.matchedCount === 0) {
        throw new ApiError(404, "No messages found with the provided ID(s).");
    }

    return ApiResponse.sendSuccess(res, "", "Message status successfully updated.");
});

// Delete messages (single/bulk)
const deleteMessageById = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    // console.log("IDs to delete:", ids);

    if(!Array.isArray(ids) || ids.length === 0) {
        throw new ApiError(400, "Please provide at least one message ID to delete.");
    }

    // Delete the message
    const results = await Message.deleteMany({ _id: { $in: ids } });

    if(results.deletedCount === 0) {
        throw new ApiError(404, "No messages found to delete with the provided ID(s).");
    }

    return ApiResponse.sendSuccess(res, "", "Message successfully deleted.");
});

// Send a message (public)
const sendMessage = asyncHandler(async (req, res) => {
    const { name, email, projectTypeId, message } = req.body;

    // Basic validation
    if(!name || !email || !projectTypeId || !message) {
        throw new ApiError(400, "All fields are required.");
    }

    // sanitize name, email, projectTypeId removing any HTML tags
    const sanitizedName = sanitize(name, { allowedTags: [], allowedAttributes: {} });
    const sanitizedEmail = sanitize(email, { allowedTags: [], allowedAttributes: {} });
    const sanitizedProjectTypeId = sanitize(projectTypeId, { allowedTags: [], allowedAttributes: {} });

    // Sanitize message content allowing html tags and preventing XSS
    const sanitizedMessage = sanitize(message, {
        allowedTags: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "sub", "pre"],
        allowedAttributes: {
            "a": ["href"]
        },
        allowedSchemes: ["http", "https", "mailto"]
    });

    if(!sanitizedName || !sanitizedEmail || !sanitizedProjectTypeId || !sanitizedMessage) {
        throw new ApiError(400, "Invalid input provided.");
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if(!emailRegex.test(sanitizedEmail)) {
        throw new ApiError(400, "Please enter a valid email address.");
    }

    // find project type by id
    const projectType = await ProjectType.findById(sanitizedProjectTypeId);
    if(!projectType) {
        throw new ApiError(400, "Selected project type does not exist.");
    }

    // Create and save the message
    const newMessage = await Message.create({
        name: sanitizedName,
        email: sanitizedEmail,
        projectType: sanitizedProjectTypeId,
        message: sanitizedMessage
    });

    if(!newMessage) {
        throw new ApiError(500, "Failed to send message. Please try again later.");
    }

    return ApiResponse.sendSuccess(res, "", "Message successfully sent.", 201);
});

export {
    sendMessage,
    fetchAllMessages,
    fetchMessageById,
    fetchTodayMsgStats,
    deleteMessageById,
    updateMessageStatus
};