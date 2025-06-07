// backend/models/index.js
// This file doesn't need 'db' import directly, it just exports other models.
import User from './User.js';
import Anime from './Anime.js';
import Season from '././Season.js'; // Corrected path
import Episode from './Episode.js';
import Genre from './Genre.js';

export {
  User,
  Anime,
  Season,
  Episode,
  Genre
};
