import express from 'express';
import { authorization, authentication } from '../middleware/auth.middleware.js';
import {
    createAdmin,
    loginAdmin,
    logoutAdmin,
    reLoginAdmin,
    getCurrentAdmin,
    updateAdminProfile,
    changeAdminPassword,
} from '../controllers/admin.controller.js';

const router = express.Router();

// create default admin user
router.route("/seed").get(createAdmin);

// admin login
router.route("/login").post(loginAdmin);

// admin logout
router.route("/logout").post(authorization, logoutAdmin);

// generate new access token using refresh token
router.route("/refresh-login").post(authentication, reLoginAdmin);

// get current admin info
router.route("/me").get(authorization, getCurrentAdmin);

// update admin info
router.route("/updateAdminInfo").patch(authorization, updateAdminProfile);

// change admin password
router.route("/change-password").post(authorization, changeAdminPassword);

export default router;