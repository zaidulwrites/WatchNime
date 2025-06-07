// backend/config/db.js

import { createClient } from '@libsql/client';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) {
  console.error('ERROR: TURSO_DATABASE_URL is not defined in your .env file.');
  process.exit(1);
}

if (!tursoAuthToken) {
  console.error('ERROR: TURSO_AUTH_TOKEN is not defined in your .env file.');
  process.exit(1);
}

// Declare dbClientInstance here, but don't initialize it yet
let dbClientInstance = null; // Initialize with null

export const connectDB = async () => {
  try {
    if (dbClientInstance) {
      console.log('Turso DB client already initialized. Reusing existing instance.');
      return; // Already connected
    }
    console.log('Attempting to create libsql client...');
    dbClientInstance = createClient({ // Assign to the declared variable
      url: tursoUrl,
      authToken: tursoAuthToken,
    });
    console.log('libsql client created successfully.');

    // Enable foreign key constraints for this connection (important for SQLite)
    await dbClientInstance.execute("PRAGMA foreign_keys = ON;");

    // You can perform a simple query to verify connection
    await dbClientInstance.execute("SELECT 1;");
    console.log('Turso DB connected successfully with @libsql/client!');
  } catch (error) {
    console.error('Turso DB connection error:', error);
    console.error('Please check your TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.');
    process.exit(1);
  }
};

// Export a function that returns the initialized dbClientInstance
export const getDbClient = () => {
  if (!dbClientInstance) {
    // This should ideally not happen if connectDB() is awaited before routes are hit
    console.error("Attempted to access database client before it was initialized.");
    throw new Error("Database client not initialized. Ensure connectDB() is awaited at server startup.");
  }
  return dbClientInstance;
};

// We no longer need a default export from db.js for the client instance
// If server.js still imports 'db from "./config/db.js"', it will need to be removed.
