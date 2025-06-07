// backend/routes/SeasonRoutes.js

import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

import {
  getSeasonById, // Import getSeasonById
  addSeason,
  updateSeason,
  deleteSeason,
} from '../controllers/SeasonController.js';

import { addEpisode } from '../controllers/EpisodeController.js'; // Import addEpisode from EpisodeController

const router = express.Router();

// Public route to get a single season by ID (for user frontend)
router.route('/:id').get(getSeasonById); // NEW: GET /api/seasons/:id

// Admin routes
// POST /api/anime/:animeId/seasons - Add a new season to an anime
router.route('/anime/:animeId/seasons').post(protect, authorize('admin'), addSeason);
// PUT /api/seasons/:id - Update an existing season
// DELETE /api/seasons/:id - Delete a season
router.route('/:id').put(protect, authorize('admin'), updateSeason).delete(protect, authorize('admin'), deleteSeason);

// Route for adding an episode to a specific season (POST /api/seasons/:seasonId/episodes)
router.route('/:seasonId/episodes').post(protect, authorize('admin'), addEpisode);

export default router;
