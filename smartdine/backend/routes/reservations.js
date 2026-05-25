const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// @route   POST /api/reservations
// @desc    Create a new table reservation
// @access  Private
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { name, email, phone, date, time, guests, special_requests } = req.body;
    
    const query = `
      INSERT INTO reservations 
      (user_id, name, email, phone, date, time, guests, special_requests) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
      RETURNING *
    `;
    
    const values = [req.user.id, name, email, phone, date, time, guests, special_requests];
    const result = await db.query(query, values);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reservations/my
// @desc    Get logged in user's reservations
// @access  Private
router.get('/my', authenticateToken, async (req, res, next) => {
  try {
    const query = 'SELECT * FROM reservations WHERE user_id = $1 ORDER BY date DESC, time DESC';
    const result = await db.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reservations
// @desc    Get all reservations
// @access  Private/Admin
router.get('/', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const query = 'SELECT * FROM reservations ORDER BY created_at DESC';
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/reservations/:id/status
// @desc    Update reservation status
// @access  Private/Admin
router.put('/:id/status', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await db.query(
      'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
