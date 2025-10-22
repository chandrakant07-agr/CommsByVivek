import express from "express";
import { authorization } from "../middlewares/auth.middleware.js";
import {
    updateContactDetails,
    updateSocialMediaHandles,
    fetchContactAndSocialDetails
} from "../controllers/contactDetails.controller.js";

const router = express.Router();

// admin: update contact details
router.route("/update").put(authorization, updateContactDetails);

// admin: update social media handles
router.route("/update-social-handles").put(authorization, updateSocialMediaHandles);

// fetch contact and social media details (for public use)
router.route("/get").get(fetchContactAndSocialDetails);

export default router;