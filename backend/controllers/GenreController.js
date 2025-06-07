// backend/controllers/GenreController.js
import Genre from '../models/Genre.js'; // Import your Genre model
import asyncHandler from 'express-async-handler';

// @desc    Get all genres
// @route   GET /api/genres
// @access  Public
export const getAllGenres = asyncHandler(async (req, res) => {
  const genres = await Genre.getAll();
  res.json(genres);
});

// @desc    Add a new genre
// @route   POST /api/genres
// @access  Admin
export const addGenre = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Please include a genre name');
  }

  // Check if genre already exists
  const genreExists = await Genre.findByName(name);

  if (genreExists) {
    res.status(400);
    throw new Error('Genre already exists');
  }

  const newGenre = await Genre.create(name);

  res.status(201).json(newGenre);
});

// @desc    Delete a genre
// @route   DELETE /api/genres/:id
// @access  Admin
export const deleteGenre = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const genre = await Genre.findById(id);

  if (!genre) {
    res.status(404);
    throw new Error('Genre not found');
  }

  const deleted = await Genre.delete(id);
  if (deleted) {
    res.json({ message: 'Genre removed' });
  } else {
    res.status(500);
    throw new Error('Failed to delete genre');
  }
});
