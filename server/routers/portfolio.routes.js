import express from 'express';
import { authorization } from '../middlewares/auth.middleware.js';
import {
    addPortfolioItem,
    fetchPortfolioItems,
    updatePortfolioItem,
    deletePortfolioItem,
    syncPortfolioCategory,
    fetchPortfolioCategories
} from '../controllers/portfolio.controller.js';

const router = express.Router();

// fetch portfolio items (for public use)
router.route('/get').get(fetchPortfolioItems);

// admin: add new portfolio item
router.route('/add').post(authorization, addPortfolioItem);

// admin: update portfolio item
router.route('/update').patch(authorization, updatePortfolioItem);

// admin: delete portfolio item
router.route('/delete').delete(authorization, deletePortfolioItem);

// fetch portfolio items (for public use)
router.route('/categories/get').get(fetchPortfolioCategories);

// admin: sync portfolio category to the database
router.route('/categories/sync').put(authorization, syncPortfolioCategory);

export default router;