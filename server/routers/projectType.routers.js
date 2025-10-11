import express from "express";
import { authorization } from "../middleware/auth.middleware.js";
import {
    addProjectType,
    fetchProjectTypes,
    updateProjectType
} from "../controllers/projectType.controller.js";

const router = express.Router();

// admin add project types
router.route("/add").post(authorization, addProjectType);

// admin update project types
router.route("/update").put(authorization, updateProjectType);

// fetch project types (for public use)
router.route("/get").get(fetchProjectTypes);

export default router;