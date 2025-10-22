import Admin from "../models/admin.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/responseHandler.js";
import { verifyAccessToken, verifyRefreshToken } from "../utils/jwtUtils.js";

const authorization = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];
    if (!token) {
        throw new ApiError(401, "Unauthorized: please login");
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
        throw new ApiError(401, "Unauthorized: Invalid token");
    }

    const admin = await Admin.findById(decoded.id)
        .select("-password -refreshToken -__v ");
    if (!admin) {
        throw new ApiError(404, "Invalid token: user not found");
    }

    req.admin = admin;
    next();
});

const authentication = asyncHandler(async (req, _, next) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
        throw new ApiError(401, "Unauthorized: No refresh token provided");
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        throw new ApiError(401, "Unauthorized: Invalid refresh token");
    }

    const admin = await Admin.findById(decoded.id)
        .select('-password -__v -createdAt -updatedAt');
    if (!admin) {
        throw new ApiError(404, "Invalid token: user not found");
    }

    if (admin.refreshToken !== refreshToken) {
        throw new ApiError(403, "Forbidden: Token is expired)");
    }

    req.admin = admin;
    next();
});

export { authorization, authentication };