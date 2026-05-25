const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// @route   GET /api/menu
// @desc    Get all menu items (with optional filters)
router.get('/', async (req, res, next) => {
  try {
    const { category, maxPrice, maxCalories, dietType } = req.query;
    
    let query = 'SELECT * FROM menu_items WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (maxPrice) {
      query += ` AND price <= $${paramIndex}`;
      params.push(maxPrice);
      paramIndex++;
    }

    if (maxCalories) {
      query += ` AND calories <= $${paramIndex}`;
      params.push(maxCalories);
      paramIndex++;
    }

    if (dietType) {
      // Assuming dietType matches category exactly, or handle specific logic
      if (['Veg', 'Vegan', 'Non-Veg'].includes(dietType)) {
        query += ` AND category = $${paramIndex}`;
        params.push(dietType);
        paramIndex++;
      }
    }

    query += ' ORDER BY id ASC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM menu_items WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/menu
// @desc    Add a menu item
// @access  Admin only
router.post('/', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { name, category, price, image_url, description, calories, protein, carbs, fats, is_available } = req.body;

    const query = `
      INSERT INTO menu_items 
      (name, category, price, image_url, description, calories, protein, carbs, fats, is_available) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *
    `;
    
    const values = [
      name, category, price, image_url, description, 
      calories, protein, carbs, fats, 
      is_available !== undefined ? is_available : true
    ];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/menu/:id
// @desc    Edit a menu item
// @access  Admin only
router.put('/:id', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, price, image_url, description, calories, protein, carbs, fats, is_available, rating } = req.body;

    // First check if item exists
    const checkResult = await db.query('SELECT * FROM menu_items WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const query = `
      UPDATE menu_items 
      SET name = COALESCE($1, name),
          category = COALESCE($2, category),
          price = COALESCE($3, price),
          image_url = COALESCE($4, image_url),
          description = COALESCE($5, description),
          calories = COALESCE($6, calories),
          protein = COALESCE($7, protein),
          carbs = COALESCE($8, carbs),
          fats = COALESCE($9, fats),
          is_available = COALESCE($10, is_available),
          rating = COALESCE($11, rating)
      WHERE id = $12
      RETURNING *
    `;

    const values = [name, category, price, image_url, description, calories, protein, carbs, fats, is_available, rating, id];
    const result = await db.query(query, values);

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete an item
// @access  Admin only
router.delete('/:id', authenticateToken, isAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM menu_items WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully', id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
