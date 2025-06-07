// backend/controllers/AuthController.js
import User from '../models/User.js'; // Import your User model
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ user: { id, role } }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (or Admin if you want to restrict)
export const registerUser = asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error('Please enter all fields');
  }

  // Check if user exists using your User model
  const userExists = await User.findByUsername(username);

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user using your User model
  const user = await User.create(username, hashedPassword, role);

  if (user) {
    res.status(201).json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check for user using your User model
  const user = await User.findByUsername(username);

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});
