// backend/models/User.js
import { getDbClient } from '../config/db.js'; // Import the getter function
import { v4 as uuidv4 } from 'uuid';

const User = {
  // Create a new user
  create: async (username, password, role = 'user') => {
    const db = getDbClient(); // Get the initialized client
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    try {
      await db.execute({
        sql: "INSERT INTO User (id, username, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?);",
        args: [id, username, password, role, createdAt, updatedAt]
      });
      return { id, username, role, createdAt, updatedAt };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Find a user by username
  findByUsername: async (username) => {
    const db = getDbClient(); // Get the initialized client
    try {
      const result = await db.execute({
        sql: "SELECT * FROM User WHERE username = ? LIMIT 1;",
        args: [username]
      });
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  },

  // Find a user by ID
  findById: async (id) => {
    const db = getDbClient(); // Get the initialized client
    try {
      const result = await db.execute({
        sql: "SELECT * FROM User WHERE id = ? LIMIT 1;",
        args: [id]
      });
      return result.rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }
};

export default User;
