const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Place a new order
// @access  Private
router.post('/', authenticateToken, async (req, res, next) => {
  try {
    const { items, total_price } = req.body;
    const user_id = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order items are required' });
    }

    if (!total_price) {
      return res.status(400).json({ error: 'Total price is required' });
    }

    // Start a transaction
    await db.query('BEGIN');

    // Create the order
    const orderResult = await db.query(
      'INSERT INTO orders (user_id, items, total_price, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, JSON.stringify(items), total_price, 'pending']
    );

    const orderId = orderResult.rows[0].id;

    // Insert into order_items
    const orderItemsQuery = 'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ($1, $2, $3, $4)';
    
    for (let item of items) {
      await db.query(orderItemsQuery, [orderId, item.menu_item_id, item.quantity, item.price]);
    }

    // Commit transaction
    await db.query('COMMIT');

    res.status(201).json(orderResult.rows[0]);
  } catch (err) {
    // Rollback on error
    await db.query('ROLLBACK');
    next(err);
  }
});

// @route   GET /api/orders/:userId
// @desc    Get user order history
// @access  Private
router.get('/:userId', authenticateToken, async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Ensure the user is requesting their own orders, or they are an admin
    if (req.user.id !== parseInt(userId) && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Access denied. You can only view your own orders.' });
    }

    const result = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/orders
// @desc    Get all orders (global)
// @access  Admin only
router.get('/', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const query = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Admin only (or specific logic)
router.put('/:id/status', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await db.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
