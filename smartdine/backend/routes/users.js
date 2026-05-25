const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users with order counts
// @access  Admin only
router.get('/', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const query = `
      SELECT 
        u.id, u.name, u.email, u.preferences, u.created_at,
        COUNT(o.id) as total_orders
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
