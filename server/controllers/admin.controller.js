import Admin from "../models/admin.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError, ApiResponse } from "../utils/responseHandler.js";
import { clearCookieOptions, sessionCookieOptions } from "../config/cookieConfig.js";
import { jwtGenerateAccessToken, jwtGenerateRefreshToken } from "../utils/jwtUtils.js";

const generateAccessToken = (admin) => {
    try {
        const payload = {
            id: admin._id,
            fullName: admin.fullName,
            email: admin.email,
            role: admin.role
        };

        const accessToken = jwtGenerateAccessToken(payload);

        return accessToken;
    } catch (error) {
        throw new ApiError(500, "Access Token generation failed");
    }
}

const generateRefreshToken = (admin) => {
    try {
        const payload = {
            id: admin._id,
        };

        const refreshToken = jwtGenerateRefreshToken(payload);

        return refreshToken;
    } catch (error) {
        throw new ApiError(500, "Refresh Token generation failed");
    }
}

const createAdmin = asyncHandler(async (_, res) => {
    const adminName = process.env.ADMIN_NAME || "Admin";
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if(!adminEmail || !adminPassword) {
        throw new ApiError(500, "Admin email or password not set in environment variables.");
    }

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if(existingAdmin) {
        throw new ApiError(400, "Admin user already exists.", [], "Admin user creation attempted but user already exists.");
    }

    await Admin.create({
        fullName: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "Admin"
    });

    const newAdmin = await Admin.findOne({ email: adminEmail }).select('-password -refreshToken -__v -createdAt -updatedAt');

    if(!newAdmin) {
        throw new ApiError(500, "Failed to create default admin user.");
    }

    return ApiResponse.sendSuccess(res, "", "Default admin user created successfully.", 201);
});

const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        throw new ApiError(400, "Email and password are required.");
    }

    const admin = await Admin.findOne({ email });
    if(!admin) {
        throw new ApiError(401, "Invalid email or password.");
    }

    const isPasswordValid = await admin.checkPassword(password);
    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password.");
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    admin.refreshToken = refreshToken; // Store refresh token in database
    admin.lastLogin = new Date(); // Update last login time

    await admin.save();

    const adminData = {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
    };

    res
        .cookie("accessToken", accessToken, sessionCookieOptions)
        .cookie("refreshToken", refreshToken, sessionCookieOptions);

    return ApiResponse.sendSuccess(res, adminData, "Admin logged in successfully.");
});

const logoutAdmin = asyncHandler(async (req, res) => {
    const adminId = req.admin._id;

    await Admin.findByIdAndUpdate(adminId, {
        $unset: { refreshToken: 1 }
    }, { new: true });

    res
        .clearCookie("accessToken", clearCookieOptions)
        .clearCookie("refreshToken", clearCookieOptions);

    return ApiResponse.sendSuccess(res, "", "Admin logged out successfully.");
});

const reLoginAdmin = asyncHandler(async (req, res) => {
    const admin = req.admin;

    const accessToken = generateAccessToken(admin);
    const refreshToken = req.admin.refreshToken; // Reuse existing refresh token

    // Update last login time
    admin.lastLogin = new Date();
    await admin.save();

    const adminData = {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin
    };

    res
        .cookie("accessToken", accessToken, sessionCookieOptions)
        .cookie("refreshToken", refreshToken, sessionCookieOptions);

    return ApiResponse.sendSuccess(res, adminData, "Admin logged in refresh successfully.");
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
    const admin = req.admin;

    const adminData = {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
        passwordUpdatedAt: admin.passwordUpdatedAt
    };

    return ApiResponse.sendSuccess(res, adminData, "Current admin info retrieved successfully.");
});

const updateAdminProfile = asyncHandler(async (req, res) => {
    const adminId = req.admin._id;
    const { fullName, email } = req.body;

    // Update only the available fields
    const updatedFields = {};

    if(fullName) updatedFields.fullName = fullName;
    if(email) updatedFields.email = email;

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, {
        $set: updatedFields
    }, { new: true }).select('-password -refreshToken -__v -createdAt -updatedAt');

    if(!updatedAdmin) {
        throw new ApiError(404, "Admin user not found.");
    }

    const adminData = {
        id: updatedAdmin._id,
        fullName: updatedAdmin.fullName,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        lastLogin: updatedAdmin.lastLogin
    };

    return ApiResponse.sendSuccess(res, adminData, "Admin profile updated successfully.");
});

const changeAdminPassword = asyncHandler(async (req, res) => {
    const adminId = req.admin._id;
    const { currentPassword, newPassword } = req.body;

    if(!currentPassword || !newPassword) {
        throw new ApiError(400, "Current password and new password are required.");
    }

    const admin = await Admin.findById(adminId);
    if(!admin) {
        throw new ApiError(404, "Admin user not found.");
    }

    const isPasswordValid = await admin.checkPassword(currentPassword);
    if(!isPasswordValid) {
        throw new ApiError(401, "Current password is incorrect.");
    }

    admin.password = newPassword;
    await admin.save();

    return ApiResponse.sendSuccess(res, "", "password changed successfully.");
});


export {
    createAdmin,
    loginAdmin,
    logoutAdmin,
    reLoginAdmin,
    getCurrentAdmin,
    updateAdminProfile,
    changeAdminPassword
};