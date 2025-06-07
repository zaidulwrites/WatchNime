// backend/server.js

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/AuthRoutes.js';
import genreRoutes from './routes/GenreRoutes.js';
import animeRoutes from './routes/AnimeRoutes.js';
import seasonRoutes from './routes/SeasonRoutes.js'; // Season routes will now handle adding episodes
import episodeRoutes from './routes/EpisodeRoutes.js'; // Episode routes will handle GET/PUT/DELETE for individual episodes

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/seasons', seasonRoutes); // Mount season routes at /api/seasons
app.use('/api/episodes', episodeRoutes); // Mount episode routes at /api/episodes

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      console.error("CRITICAL ERROR: Essential Turso environment variables are missing. They must be set externally.");
      process.exit(1);
    }
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to database or start server:', error);
    process.exit(1);
  }
}

startServer();
