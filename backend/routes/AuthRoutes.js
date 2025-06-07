// backend/routes/AuthRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/register', registerUser); // Optional: if you want to allow new user registrations
router.post('/login', loginUser);

export default router;
