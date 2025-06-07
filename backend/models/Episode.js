// backend/models/Episode.js
import { getDbClient } from '../config/db.js'; // Import the getter function
import { v4 as uuidv4 } from 'uuid';

const Episode = {
  getAll: async (seasonId) => {
    const db = getDbClient(); // Get the initialized client
    try {
      let query = "SELECT * FROM Episode";
      let args = [];
      if (seasonId) {
        query += " WHERE seasonId = ?";
        args.push(seasonId);
      }
      query += " ORDER BY createdAt ASC;";

      const result = await db.execute({ sql: query, args });
      return result.rows;
    } catch (error) {
      console.error('Error fetching episodes:', error);
      throw error;
    }
  },

  findById: async (id) => {
    const db = getDbClient(); // Get the initialized client
    try {
      const result = await db.execute({
        sql: "SELECT * FROM Episode WHERE id = ? LIMIT 1;",
        args: [id]
      });
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching episode by ID:', error);
      throw error;
    }
  },

  // Modified: Accepts episodeData object directly (including seasonId)
  create: async (episodeData) => {
    const db = getDbClient(); // Get the initialized client
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    // Destructure all expected fields directly from episodeData
    const { title, link480p, link720p, link1080p, seasonId } = episodeData;
    try {
      await db.execute({
        sql: `INSERT INTO Episode (id, title, link480p, link720p, link1080p, seasonId, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        args: [id, title, link480p || null, link720p || null, link1080p || null, seasonId, createdAt, updatedAt]
      });
      // Return the newly created episode (fetch by ID for consistency)
      return await Episode.findById(id);
    } catch (error) {
      console.error('Error creating episode:', error);
      throw error;
    }
  },

  update: async (id, episodeData) => {
    const db = getDbClient(); // Get the initialized client
    const updatedAt = new Date().toISOString();
    const { title, link480p, link720p, link1080p } = episodeData;
    try {
      await db.execute({
        sql: `UPDATE Episode SET title = ?, link480p = ?, link720p = ?, link1080p = ?, updatedAt = ?
              WHERE id = ?;`,
        args: [title, link480p || null, link720p || null, link1080p || null, updatedAt, id]
      });
      const updatedEpisode = await Episode.findById(id);
      return updatedEpisode;
    } catch (error) {
      console.error('Error updating episode:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const db = getDbClient(); // Get the initialized client
    try {
      const result = await db.execute({
        sql: "DELETE FROM Episode WHERE id = ?;",
        args: [id]
      });
      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error deleting episode:', error);
      throw error;
    }
  },

  findByTitleAndSeasonId: async (title, seasonId) => {
    const db = getDbClient(); // Get the initialized client
    try {
      const result = await db.execute({
        sql: "SELECT * FROM Episode WHERE title = ? AND seasonId = ? LIMIT 1;",
        args: [title, seasonId]
      });
      return result.rows[0];
    } catch (error) {
      console.error('Error finding episode by title and season ID:', error);
      throw error;
    }
  }
};

export default Episode;
