import sanitize from "sanitize-html";
import ProjectType from "../models/projectType.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError, ApiResponse } from "../utils/responseHandler.js";

const addProjectType = asyncHandler(async (req, res) => {
    // const { projectTypes } = req.body;

    // if(!Array.isArray(projectTypes) || projectTypes.length === 0) {
    //     throw new ApiError(400, "Project types must be a non-empty array.");
    // }

    // // Trim whitespace, filter out empty types and remove duplicates
    // const cleanedList = [...new Set(projectTypes.map(type => type.trim()).filter(Boolean))];

    // if(cleanedList.length === 0) {
    //     throw new ApiError(400, "Project types list must contain valid non-empty types.");
    // }

    // // sanitize project type names removing any HTML tags
    // const sanitizedList = cleanedList.map(
    //     type => sanitize(type, { allowedTags: [], allowedAttributes: {} })).filter(Boolean);

    // if(sanitizedList.length === 0) {
    //     throw new ApiError(400, "HTML tags are not allowed in Project types.");
    // }

    // // Find existing project types in the database
    // const existingTypes = await ProjectType.find({ name: { $in: sanitizedList } }).select("-_id name");
    // const existingTypesNames = existingTypes.map(type => type.name);

    // // Filter out names that already exist
    // const newTypesNames = sanitizedList.filter(name => !existingTypesNames.includes(name));

    // if(newTypesNames.length === 0) {
    //     throw new ApiError(400, "All provided project types already exist.");
    // }

    // // Prepare documents for insertion
    // const newTypeDocs = newTypesNames.map(name => ({ name }));

    // // Insert new project types
    // const insertedTypes = await ProjectType.insertMany(newTypeDocs);

    // return ApiResponse.sendSuccess(res, insertedTypes, "Project types successfully added.", 201);
});

// admin sends a new project type array to sync the existing project type
const syncProjectType = asyncHandler(async (req, res) => {
    const { projectTypes } = req.body;

    if(!Array.isArray(projectTypes)) {
        throw new ApiError(400, "Project types must be a non-empty array.");
    }

    // Trim whitespace, filter out empty types and remove duplicates
    const cleanedList = [...new Set(projectTypes.map(type => type.trim()).filter(Boolean))];

    // if(cleanedList.length === 0) {
    //     throw new ApiError(400, "Project types list must contain valid non-empty types.");
    // }

    // sanitize project type names removing any HTML tags
    const sanitizedList = cleanedList.map(
        type => sanitize(type, { allowedTags: [], allowedAttributes: {} })).filter(Boolean);

    // if(sanitizedList.length === 0) {
    //     throw new ApiError(400, "HTML tags are not allowed in Project types.");
    // }

    // Find existing project types in the database
    const existingTypes = await ProjectType.find().select("-_id name");
    const existingTypesNames = existingTypes.map(type => type.name);

    // filter out names what to add
    const existingTypesSet = new Set(existingTypesNames);
    const typesToAdd = sanitizedList.filter(name => !existingTypesSet.has(name));

    // filter out names what to remove
    const sanitizedSet = new Set(sanitizedList);
    const typesToRemove = existingTypesNames.filter(name => !sanitizedSet.has(name));

    // update and remove project types in the database
    const results = await Promise.all([
        typesToAdd.length > 0 
            ? ProjectType.insertMany(typesToAdd.map(name => ({ name }))) : Promise.resolve(),
        typesToRemove.length > 0 
            ? ProjectType.deleteMany({ name: { $in: typesToRemove } }) : Promise.resolve()
    ]);

    const [insertCount, deleteCount] = results;
    var message;

    if(!!insertCount === false && !!deleteCount === false) {
        message = "No changes made. All provided project types already exist.";
    } else {
        const messageParts = [];

        if(!!insertCount) {
            messageParts.push(`${insertCount.length} added`);
        }

        if(!!deleteCount) {
            messageParts.push(`${deleteCount.deletedCount} removed`);
        }

        message = `Project types successfully updated: ${messageParts.join(", ")}.`;
    }

    return ApiResponse.sendSuccess(res, "", message);
});

const fetchProjectTypes = asyncHandler(async (_, res) => {
    const projectTypes = await ProjectType.find().select("-__v -createdAt -updatedAt");

    return ApiResponse.sendSuccess(res, projectTypes, "Project types successfully fetched.");
});

export { addProjectType, syncProjectType, fetchProjectTypes };