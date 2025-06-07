// backend/models/Genre.js
import { getDbClient } from '../config/db.js'; // Import the getter function
import { v4 as uuidv4 } from 'uuid';

const Genre = {
  getAll: async () => {
    const db = getDbClient(); // Get the initialized client
    try {
      const result = await db.execute("SELECT * FROM Genre ORDER BY name ASC;");
      return result.rows;
    } catch (error) {
      console.error('Error fetching all genres:', error);
      throw error;
    }
  },

  create: async (name) => {
    const db = getDbClient(); // Get the initialized client
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    try {
      await db.execute({
        sql: "INSERT INTO Genre (id, name, createdAt, updatedAt) VALUES (?, ?, ?, ?);",
        args: [id, name, createdAt, updatedAt]
      });
      return { id, name, createdAt, updatedAt };
    } catch (error) {
      console.error('Error creating genre:', error);
      throw error;
    }
  },

  findByName: async (name) => {
    const db = getDbClient(); // Get the initialized client
    try {
      const result = await db.execute({
        sql: "SELECT * FROM Genre WHERE name = ? LIMIT 1;",
        args: [name]
      });
      return result.rows[0];
    } catch (error) {
      console.error('Error finding genre by name:', error);
      throw error;
    }
  },

  findById: async (id) => {
    const db = getDbClient(); // Get the initialized client
    try {
      const result = await db.execute({
        sql: "SELECT * FROM Genre WHERE id = ? LIMIT 1;",
        args: [id]
      });
      return result.rows[0];
    } catch (error) {
      console.error('Error finding genre by ID:', error);
      throw error;
    }
  },

  delete: async (id) => {
    const db = getDbClient(); // Get the initialized client
    try {
      const result = await db.execute({
        sql: "DELETE FROM Genre WHERE id = ?;",
        args: [id]
      });
      return result.rowsAffected > 0;
    } catch (error) {
      console.error('Error deleting genre:', error);
      throw error;
    }
  }
};

export default Genre;
