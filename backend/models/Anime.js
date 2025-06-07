// backend/models/Anime.js
import { getDbClient } from '../config/db.js'; // Import the getter function
import { v4 as uuidv4 } from 'uuid';

const Anime = {
  // Modified: accepts an optional keyword for searching by title
  getAll: async (keyword = '') => {
    const db = getDbClient(); // Get the initialized client
    try {
      let query = "SELECT id, title, description, poster, allDetails, createdAt, updatedAt FROM Anime";
      const args = [];

      if (keyword) {
        query += " WHERE title LIKE ?"; // Case-insensitive search
        args.push(`%${keyword}%`);
      }
      query += " ORDER BY createdAt DESC;";

      // Fetch all anime
      const animeResult = await db.execute({ sql: query, args });
      const animes = animeResult.rows;

      // Fetch all genres for all animes
      const animeGenreResult = await db.execute(`
        SELECT
          ag.animeId,
          g.id AS genreId,
          g.name AS genreName
        FROM AnimeGenre ag
        JOIN Genre g ON ag.genreId = g.id;
      `);
      const animeGenres = animeGenreResult.rows;

      // Fetch all seasons for all animes (no poster on season)
      const seasonResult = await db.execute("SELECT id, title, animeId, createdAt, updatedAt FROM Season ORDER BY createdAt ASC;");
      const seasons = seasonResult.rows;

      // Fetch all episodes for all seasons
      const episodeResult = await db.execute("SELECT * FROM Episode ORDER BY createdAt ASC;");
      const episodes = episodeResult.rows;

      // Manually "populate" the data
      return animes.map(anime => {
        const animeSeasons = seasons.filter(s => s.animeId === anime.id).map(season => {
          const seasonEpisodes = episodes.filter(e => e.seasonId === season.id);
          return { ...season, episodes: seasonEpisodes };
        });
        const animeLinkedGenres = animeGenres.filter(ag => ag.animeId === anime.id).map(ag => ({
          id: ag.genreId,
          name: ag.genreName
        }));
        return {
          ...anime,
          genres: animeLinkedGenres,
          seasons: animeSeasons
        };
      });

    } catch (error) {
      console.error('Error fetching all anime:', error);
      throw error;
    }
  },

  findById: async (id) => {
    const db = getDbClient(); // Get the initialized client
    try {
      // Fetch single anime (selecting only relevant columns)
      const animeResult = await db.execute({
        sql: "SELECT id, title, description, poster, allDetails, createdAt, updatedAt FROM Anime WHERE id = ? LIMIT 1;",
        args: [id]
      });
      const anime = animeResult.rows[0];

      if (!anime) return null;

      // Fetch seasons for this anime (no poster on season)
      const seasonResult = await db.execute({
        sql: "SELECT id, title, animeId, createdAt, updatedAt FROM Season WHERE animeId = ? ORDER BY createdAt ASC;",
        args: [anime.id]
      });
      const seasons = seasonResult.rows;

      // Fetch episodes for these seasons
      const seasonIds = seasons.map(s => s.id);
      let episodes = [];
      if (seasonIds.length > 0) {
        const allEpisodesResult = await db.execute("SELECT * FROM Episode ORDER BY createdAt ASC;");
        episodes = allEpisodesResult.rows.filter(e => seasonIds.includes(e.seasonId));
      }

      // Fetch genres for this anime
      const genreResult = await db.execute({
        sql: `
          SELECT g.id, g.name
          FROM Genre g
          JOIN AnimeGenre ag ON g.id = ag.genreId
          WHERE ag.animeId = ?;
        `,
        args: [anime.id]
      });
      const genres = genreResult.rows;

      // Populate seasons with episodes
      const populatedSeasons = seasons.map(season => ({
        ...season,
        episodes: episodes.filter(e => e.seasonId === season.id)
      }));

      return {
        ...anime,
        genres,
        seasons: populatedSeasons
      };

    } catch (error) {
      console.error('Error fetching anime by ID:', error);
      throw error;
    }
  },

  create: async (animeData, genreIds) => {
    const db = getDbClient(); // Get the initialized client
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    // Destructure only relevant fields
    const { title, description, poster, allDetails } = animeData;

    try {
      // Updated INSERT statement to match the new schema
      await db.execute({
        sql: `INSERT INTO Anime (id, title, description, poster, allDetails, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?);`,
        args: [id, title, description, poster, allDetails, createdAt, updatedAt]
      });

      // Link genres
      for (const genreId of genreIds) {
        await db.execute({
          sql: "INSERT INTO AnimeGenre (animeId, genreId) VALUES (?, ?);",
          args: [id, genreId]
        });
      }

      const newAnime = await Anime.findById(id);
      return newAnime;

    } catch (error) {
      console.error('Error creating anime:', error);
      throw error;
    }
  },

  update: async (id, animeData, genreIds) => {
    const db = getDbClient(); // Get the initialized client
    const updatedAt = new Date().toISOString();
    // Destructure only relevant fields
    const { title, description, poster, allDetails } = animeData;

    try {
      // Updated UPDATE statement to match the new schema
      await db.execute({
        sql: `UPDATE Anime SET title = ?, description = ?, poster = ?, allDetails = ?, updatedAt = ?
              WHERE id = ?;`,
        args: [title, description, poster, allDetails, updatedAt, id]
      });

      // Update genres: first remove all existing links, then add new ones
      await db.execute({
        sql: "DELETE FROM AnimeGenre WHERE animeId = ?;",
        args: [id]
      });

      for (const genreId of genreIds) {
        await db.execute({
          sql: "INSERT INTO AnimeGenre (animeId, genreId) VALUES (?, ?);",
          args: [id, genreId]
        });
      }

      const updatedAnime = await Anime.findById(id);
      return updatedAnime;

    } catch (error) {
      console.error('Error updating anime:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const db = getDbClient(); // Get the initialized client
    try {
      const result = await db.execute({
        sql: "DELETE FROM Anime WHERE id = ?;",
        args: [id]
      });
      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error deleting anime:', error);
      throw error;
    }
  },

  findByTitle: async (title) => {
    const db = getDbClient(); // Get the initialized client
    try {
      const result = await db.execute({
        sql: "SELECT * FROM Anime WHERE title = ? LIMIT 1;",
        args: [title]
      });
      return result.rows[0];
    } catch (error) {
      console.error('Error finding anime by title:', error);
      throw error;
    }
  }
};

export default Anime;
