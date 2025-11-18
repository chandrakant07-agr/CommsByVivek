import express from 'express';
import { authorization } from '../middlewares/auth.middleware.js';
import {
    syncHeroBanner,
    fetchHeroBanners
} from '../controllers/heroBanner.controller.js';

const router = express.Router();

// fetch hero banners (for public use)
router.route('/get').get(fetchHeroBanners);

// admin: sync new hero banner
router.route('/sync').post(authorization, syncHeroBanner);

export default router;