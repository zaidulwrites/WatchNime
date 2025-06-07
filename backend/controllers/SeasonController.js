// backend/controllers/SeasonController.js
import Season from '../models/Season.js'; // Import your Season model
import Anime from '../models/Anime.js'; // To check if anime exists
import asyncHandler from 'express-async-handler';

// @desc    Get all seasons (can be filtered by animeId, not used in current frontend but good for completeness)
// @route   GET /api/seasons?animeId=:animeId
// @access  Public
export const getAllSeasons = asyncHandler(async (req, res) => {
  const { animeId } = req.query; // If you want to filter by animeId
  const seasons = await Season.getAll(animeId); // Assuming Season.getAll can take animeId
  res.json(seasons);
});

// @desc    Get single season by ID
// @route   GET /api/seasons/:id
// @access  Public
export const getSeasonById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const season = await Season.findById(id);

  if (season) {
    res.json(season);
  } else {
    res.status(404);
    throw new Error('Season not found');
  }
});


// @desc    Add new season to an anime
// @route   POST /api/anime/:animeId/seasons
// @access  Admin
export const addSeason = asyncHandler(async (req, res) => {
  const { animeId } = req.params;
  const { title } = req.body; // Removed poster

  if (!title) {
    res.status(400);
    throw new Error('Please include a title for the season');
  }

  const animeExists = await Anime.findById(animeId);
  if (!animeExists) {
    res.status(404);
    throw new Error('Anime not found for the given ID');
  }

  const newSeason = await Season.create({ animeId, title }); // Removed poster

  res.status(201).json(newSeason);
});

// @desc    Update season
// @route   PUT /api/seasons/:id
// @access  Admin
export const updateSeason = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body; // Removed poster

  const season = await Season.findById(id);
  if (!season) {
    res.status(404);
    throw new new Error('Season not found'); // Fixed syntax here
  }

  const updatedSeason = await Season.update(id, { title }); // Removed poster

  res.json(updatedSeason);
});

// @desc    Delete season
// @route   DELETE /api/seasons/:id
// @access  Admin
export const deleteSeason = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const season = await Season.findById(id);

  if (!season) {
    res.status(404);
    throw new Error('Season not found');
  }

  const deleted = await Season.delete(id);
  if (deleted) {
    res.json({ message: 'Season and all associated data removed' });
  } else {
    res.status(500);
    throw new Error('Failed to delete season');
  }
});
