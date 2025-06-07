// backend/routes/EpisodeRoutes.js
import express from 'express';
import {
  getAllEpisodes,
  getEpisodeById,
  // addEpisode, // REMOVED from here, moved to SeasonRoutes.js
  updateEpisode,
  deleteEpisode
} from '../controllers/EpisodeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Public routes for fetching episodes (if applicable to user frontend)
router.route('/').get(getAllEpisodes); // e.g., /api/episodes?seasonId=xyz
router.route('/:id').get(getEpisodeById); // e.g., /api/episodes/abc

// Admin-only routes
// PUT /api/episodes/:id - Update an episode (Admin)
// DELETE /api/episodes/:id - Delete an episode (Admin)
router.route('/:id')
  .put(protect, authorize('admin'), updateEpisode) 
  .delete(protect, authorize('admin'), deleteEpisode); 

export default router;
