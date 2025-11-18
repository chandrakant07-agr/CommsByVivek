import express from 'express';
import { authorization } from '../middlewares/auth.middleware.js';
import {
    fetchRatingByToken,
    generateRatingLink,
    updateRatingStatus,
    fetchTotalRatingsCount,
    fetchAllRatings,
    submitRating,
    deleteRating
} from '../controllers/rating.controller.js';

const router = express.Router();

// admin generate new rating link
router.route('/generate-link/:id').post(authorization, generateRatingLink);

// admin update rating status (single/bulk)
router.route('/update-status').put(authorization, updateRatingStatus);

// admin reject ratings (single/bulk)
router.route('/reject').delete(authorization, deleteRating);

// client submit rating
router.route('/submit').post(submitRating);

// get all ratings
router.route('/getAll').get(fetchAllRatings);

// get total ratings items count and overall average rating
router.route('/total-items').get(fetchTotalRatingsCount);

// get a rating by Token
router.route('/get-by-token/:token').get(fetchRatingByToken);

export default router;