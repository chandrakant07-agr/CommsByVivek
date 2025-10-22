import express from "express";
import { authorization } from "../middlewares/auth.middleware.js";
import {
    addProjectType,
    syncProjectType,
    fetchProjectTypes
} from "../controllers/projectType.controller.js";

const router = express.Router();

// admin: add project types to the database
// router.route("/add").post(authorization, addProjectType);

// admin: sync project type to the database
router.route("/syncProjectType").put(authorization, syncProjectType);

// fetch project types (for public use)
router.route("/get").get(fetchProjectTypes);

export default router;