// backend/controllers/AnimeController.js
import Anime from '../models/Anime.js'; // Import your Anime model
import Genre from '../models/Genre.js'; // Import Genre model to resolve genreNames to IDs
import asyncHandler from 'express-async-handler';

// @desc    Get all anime (with optional search)
// @route   GET /api/anime?search=:keyword
// @access  Public
export const getAllAnime = asyncHandler(async (req, res) => {
  const keyword = req.query.search; // Get search keyword from query
  const anime = await Anime.getAll(keyword); // Pass keyword to model
  res.json(anime);
});

// @desc    Get single anime by ID
// @route   GET /api/anime/:id
// @access  Public
export const getAnimeById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const anime = await Anime.findById(id);

  if (anime) {
    res.json(anime);
  } else {
    res.status(404);
    throw new Error('Anime not found');
  }
});

// @desc    Add new anime
// @route   POST /api/anime
// @access  Admin
export const addAnime = asyncHandler(async (req, res) => {
  // Removed homepageBanner, seasonPageBanner, type, release from destructuring
  const { title, description, poster, genreNames, allDetails } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Please include a title');
  }

  const animeExists = await Anime.findByTitle(title);
  if (animeExists) {
    res.status(400);
    throw new Error('Anime with this title already exists');
  }

  // Resolve genreNames to genre IDs
  const genreIds = [];
  if (genreNames && genreNames.length > 0) {
    for (const name of genreNames) {
      let genre = await Genre.findByName(name);
      if (!genre) {
        // If genre doesn't exist, create it (or throw error if not allowed)
        genre = await Genre.create(name);
      }
      genreIds.push(genre.id);
    }
  }

  // Passed only the fields that are expected by the frontend form and new schema
  const newAnime = await Anime.create(
    { title, description, poster, allDetails }, // Removed homepageBanner, seasonPageBanner, type, release
    genreIds
  );

  res.status(201).json(newAnime);
});

// @desc    Update anime
// @route   PUT /api/anime/:id
// @access  Admin
export const updateAnime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Removed homepageBanner, seasonPageBanner, type, release from destructuring
  const { title, description, poster, genreNames, allDetails } = req.body;

  const anime = await Anime.findById(id);
  if (!anime) {
    res.status(404);
    throw new Error('Anime not found');
  }

  // Resolve genreNames to genre IDs for update
  const genreIds = [];
  if (genreNames && genreNames.length > 0) {
    for (const name of genreNames) {
      let genre = await Genre.findByName(name);
      if (!genre) {
        genre = await Genre.create(name); // Create if not exists
      }
      genreIds.push(genre.id);
    }
  }

  // Passed only the fields that are expected by the frontend form and new schema
  const updatedAnime = await Anime.update(
    id,
    { title, description, poster, allDetails }, // Removed homepageBanner, seasonPageBanner, type, release
    genreIds
  );

  res.json(updatedAnime);
});

// @desc    Delete anime
// @route   DELETE /api/anime/:id
// @access  Admin
export const deleteAnime = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const anime = await Anime.findById(id);

  if (!anime) {
    res.status(404);
    throw new Error('Anime not found');
  }

  const deleted = await Anime.delete(id);
  if (deleted) {
    res.json({ message: 'Anime and all associated data removed' });
  } else {
    res.status(500);
    throw new Error('Failed to delete anime');
  }
});
