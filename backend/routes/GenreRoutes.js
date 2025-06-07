// backend/routes/GenreRoutes.js
import express from 'express';
import { getAllGenres, addGenre, deleteGenre } from '../controllers/GenreController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllGenres); // Public access to get all genres
router.route('/').post(protect, authorize('admin'), addGenre); // Admin only to add genre
router.route('/:id').delete(protect, authorize('admin'), deleteGenre); // Admin only to delete genre

export default router;
