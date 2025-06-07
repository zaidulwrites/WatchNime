// backend/models/Season.js
import { getDbClient } from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const Season = {
  getAll: async () => {
    const db = getDbClient();
    try {
      const result = await db.execute("SELECT id, title, animeId, createdAt, updatedAt FROM Season ORDER BY createdAt DESC;");
      return result.rows;
    } catch (error) {
      console.error('Error fetching all seasons:', error);
      throw error;
    }
  },

  findById: async (id) => {
    const db = getDbClient();
    try {
      const seasonResult = await db.execute({
        sql: "SELECT id, title, animeId, createdAt, updatedAt FROM Season WHERE id = ? LIMIT 1;",
        args: [id]
      });
      const season = seasonResult.rows[0];

      if (!season) return null;

      // NEW: Fetch episodes for this specific season
      const episodesResult = await db.execute({
        sql: "SELECT * FROM Episode WHERE seasonId = ? ORDER BY createdAt ASC;",
        args: [season.id]
      });
      const episodes = episodesResult.rows;

      // Return season with populated episodes
      return {
        ...season,
        episodes: episodes
      };

    } catch (error) {
      console.error('Error finding season by ID:', error);
      throw error;
    }
  },

  create: async (seasonData) => {
    const db = getDbClient();
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const { title, animeId } = seasonData;

    try {
      await db.execute({
        sql: `INSERT INTO Season (id, title, animeId, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?);`,
        args: [id, title, animeId, createdAt, updatedAt]
      });
      const newSeason = await Season.findById(id); // Fetch the created season with populated episodes
      return newSeason;
    } catch (error) {
      console.error('Error creating season:', error);
      throw error;
    }
  },

  update: async (id, seasonData) => {
    const db = getDbClient();
    const updatedAt = new Date().toISOString();
    const { title } = seasonData;

    try {
      await db.execute({
        sql: `UPDATE Season SET title = ?, updatedAt = ?
              WHERE id = ?;`,
        args: [title, updatedAt, id]
      });
      const updatedSeason = await Season.findById(id); // Fetch the updated season with populated episodes
      return updatedSeason;
    } catch (error) {
      console.error('Error updating season:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const db = getDbClient();
    try {
      const result = await db.execute({
        sql: "DELETE FROM Season WHERE id = ?;",
        args: [id]
      });
      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error deleting season:', error);
      throw error;
    }
  }
};

export default Season;
