const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, preferences } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash, preferences) VALUES ($1, $2, $3, $4) RETURNING id, name, email, preferences, created_at',
      [name, email, passwordHash, preferences || {}]
    );

    const userRet = newUser.rows[0];
    userRet.isAdmin = userRet.email === 'admin@smartdine.com';
    res.status(201).json(userRet);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/auth/login
// @desc    Login and return JWT
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check user
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Determine admin status (simple check)
    const isAdmin = user.email === 'admin@smartdine.com';

    // Sign JWT
    const payload = {
      id: user.id,
      email: user.email,
      isAdmin: isAdmin
    };

    const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key';
    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin } });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, name, email, preferences, created_at FROM users WHERE id = $1', [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userProfile = result.rows[0];
    userProfile.isAdmin = userProfile.email === 'admin@smartdine.com';
    res.json(userProfile);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/auth/profile
// @desc    Update current user preferences
// @access  Private
router.put('/profile', authenticateToken, async (req, res, next) => {
  try {
    const { preferences } = req.body;
    
    const result = await db.query(
      'UPDATE users SET preferences = $1 WHERE id = $2 RETURNING id, name, email, preferences, created_at',
      [preferences, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userUpdated = result.rows[0];
    userUpdated.isAdmin = userUpdated.email === 'admin@smartdine.com';
    res.json(userUpdated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
