import express from 'express';
import { authorization } from '../middlewares/auth.middleware.js';
import { generateSignature } from '../controllers/cloudinary.controller.js';

const router = express.Router();

//admin: generate cloudinary upload signature
router.route('/generate/signature').post(authorization, generateSignature);

export default router;