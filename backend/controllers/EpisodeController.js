// backend/controllers/EpisodeController.js
import Episode from '../models/Episode.js'; // Import your Episode model
import Season from '../models/Season.js'; // Import Season model to check existence
import asyncHandler from 'express-async-handler';

// @desc    Get all episodes (can be filtered by seasonId)
// @route   GET /api/episodes?seasonId=:seasonId
// @access  Public
export const getAllEpisodes = asyncHandler(async (req, res) => {
  const { seasonId } = req.query;
  const episodes = await Episode.getAll(seasonId);
  res.json(episodes);
});

// @desc    Get single episode by ID
// @route   GET /api/episodes/:id
// @access  Public
export const getEpisodeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const episode = await Episode.findById(id);

  if (episode) {
    res.json(episode);
  } else {
    res.status(404);
    throw new Error('Episode not found');
  }
});

// @desc    Add a new episode to a season
// @route   POST /api/seasons/:seasonId/episodes
// @access  Admin
export const addEpisode = asyncHandler(async (req, res) => {
  const { seasonId } = req.params; // From URL param
  const { title, link480p, link720p, link1080p } = req.body;

  if (!title || !seasonId) {
    res.status(400);
    throw new Error('Please include episode title and season ID');
  }

  const seasonExists = await Season.findById(seasonId);
  if (!seasonExists) {
    res.status(404);
    throw new Error('Season not found');
  }

  const episodeExists = await Episode.findByTitleAndSeasonId(title, seasonId);
  if (episodeExists) {
    res.status(400);
    throw new Error('Episode with this title already exists for this season');
  }

  // Pass seasonId as part of the episodeData object
  const newEpisode = await Episode.create({ seasonId, title, link480p, link720p, link1080p });

  res.status(201).json(newEpisode);
});

// @desc    Update an episode
// @route   PUT /api/episodes/:id
// @access  Admin
export const updateEpisode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, link480p, link720p, link1080p } = req.body;

  const episode = await Episode.findById(id);
  if (!episode) {
    res.status(404);
    throw new Error('Episode not found');
  }

  // If title is changed, check for uniqueness within the same season
  if (title && title !== episode.title) {
    const existingEpisodeWithTitle = await Episode.findByTitleAndSeasonId(title, episode.seasonId);
    if (existingEpisodeWithTitle) {
      res.status(400);
      throw new Error('Episode with this title already exists for this season');
    }
  }

  const updatedEpisode = await Episode.update(id, { title, link480p, link720p, link1080p });

  res.json(updatedEpisode);
});

// @desc    Delete an episode
// @route   DELETE /api/episodes/:id
// @access  Admin
export const deleteEpisode = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const episode = await Episode.findById(id);
  if (!episode) {
    res.status(404);
    throw new Error('Episode not found');
  }

  const deleted = await Episode.delete(id);
  if (deleted) {
    res.json({ message: 'Episode removed' });
  } else {
    res.status(500);
    throw new Error('Failed to delete episode');
  }
});
