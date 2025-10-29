import express from 'express';
import { authorization } from '../middlewares/auth.middleware.js';
import {
    addGalleryItem,
    fetchGalleryItems,
    updateGalleryItem,
    deleteGalleryItem,
    syncGalleryCategory,
    fetchGalleryCategories
} from '../controllers/gallery.controller.js';

const router = express.Router();

// fetch gallery items (for public use)
router.route('/get').get(fetchGalleryItems);

// admin: add new gallery item
router.route('/add').post(authorization, addGalleryItem);

// admin: update gallery item
router.route('/update').patch(authorization, updateGalleryItem);

// admin: delete gallery item
router.route('/delete').delete(authorization, deleteGalleryItem);

// fetch gallery items (for public use)
router.route('/categories/get').get(fetchGalleryCategories);

// admin: sync gallery category to the database
router.route('/categories/sync').put(authorization, syncGalleryCategory);

export default router;