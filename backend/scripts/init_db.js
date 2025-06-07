// backend/scripts/init_db.js
// This script will create the necessary tables in your Turso database.
// Run it once using: npm run init-db

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoAuthToken) {
  console.error('ERROR: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not set in your .env file.');
  process.exit(1);
}

const db = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
});

async function initializeDatabase() {
  try {
    console.log('Connecting to Turso database to initialize schema...');
    // Enable foreign keys for this connection
    await db.execute("PRAGMA foreign_keys = ON;");

    // Create User table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "User" ensured.');

    // Create Genre table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Genre (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT UNIQUE NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "Genre" ensured.');

    // Create Anime table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Anime (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT UNIQUE NOT NULL,
        description TEXT,
        poster TEXT,
        homepageBanner TEXT,
        seasonPageBanner TEXT,
        type TEXT DEFAULT 'TV Series',
        release TEXT,
        allDetails TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "Anime" ensured.');

    // Create Season table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Season (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        poster TEXT,
        animeId TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (animeId) REFERENCES Anime(id) ON DELETE CASCADE,
        UNIQUE (title, animeId)
      );
    `);
    console.log('Table "Season" ensured.');

    // Create Episode table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Episode (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        link480p TEXT,
        link720p TEXT,
        link1080p TEXT,
        seasonId TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (seasonId) REFERENCES Season(id) ON DELETE CASCADE,
        UNIQUE (title, seasonId)
      );
    `);
    console.log('Table "Episode" ensured.');

    // Create AnimeGenre (Join Table for Many-to-Many)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS AnimeGenre (
        animeId TEXT NOT NULL,
        genreId TEXT NOT NULL,
        PRIMARY KEY (animeId, genreId),
        FOREIGN KEY (animeId) REFERENCES Anime(id) ON DELETE CASCADE,
        FOREIGN KEY (genreId) REFERENCES Genre(id) ON DELETE CASCADE
      );
    `);
    console.log('Table "AnimeGenre" ensured.');

    console.log('Database schema initialization complete!');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    process.exit(1);
  } finally {
    // No explicit close needed for libsql client in Node.js,
    // it manages connections.
  }
}

initializeDatabase();
