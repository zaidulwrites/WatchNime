// backend/routes/AnimeRoutes.js
import express from 'express';
import { getAllAnime, getAnimeById, addAnime, updateAnime, deleteAnime } from '../controllers/AnimeController.js';
import { addSeason } from '../controllers/SeasonController.js'; // Import addSeason for nested route
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getAllAnime);
router.route('/:id').get(getAnimeById);

// Admin-only routes
router.route('/').post(protect, authorize('admin'), addAnime);
router.route('/:id')
  .put(protect, authorize('admin'), updateAnime)
  .delete(protect, authorize('admin'), deleteAnime);

// Nested route for adding season to a specific anime
router.route('/:animeId/seasons').post(protect, authorize('admin'), addSeason);

export default router;
