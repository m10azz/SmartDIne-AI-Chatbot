const express = require('express');
const router = express.Router();
const db = require('../db');

// Advanced heuristic intent parsing
const parseIntent = (message) => {
  const text = message.toLowerCase();
  
  let conditions = ['is_available = TRUE'];
  let orderings = [];
  
  // 1. Price Limit
  const priceMatch = text.match(/(?:under|below|less than)\s*(?:₹|rs\.?|rupees)?\s*(\d+)/) || text.match(/(?:₹|rs\.?|rupees)\s*(\d+)\s*(?:or less|or under)/);
  if (priceMatch && priceMatch[1]) {
    conditions.push(`price <= ${parseInt(priceMatch[1])}`);
  }

  // 2. Calorie Limit
  const calMatch = text.match(/(?:under|below|less than)\s*(\d+)\s*cal/);
  if (calMatch && calMatch[1]) {
    conditions.push(`calories <= ${parseInt(calMatch[1])}`);
  } else if (text.includes('low calorie') || text.includes('low cal')) {
    conditions.push(`calories <= 400`);
    orderings.push('calories ASC');
  }

  // 3. Diet Type
  if (text.includes('vegan')) {
    conditions.push("category = 'Vegan'");
  } else if (text.includes('non veg') || text.includes('non-veg') || text.includes('chicken') || text.includes('mutton') || text.includes('fish')) {
    conditions.push("category = 'Non-Veg'");
  } else if (text.match(/\bveg\b/) || text.includes('vegetarian')) {
    conditions.push("category = 'Veg'");
  }

  // 4. Nutrition Goal
  if (text.includes('high protein')) {
    orderings.push('protein DESC');
  }

  // 5. Category / Keywords
  if (text.includes('dessert') || text.includes('sweet')) {
    conditions.push("category = 'Dessert'");
  } else if (text.includes('drink') || text.includes('beverage')) {
    conditions.push("category = 'Drinks'");
  } else if (text.includes('south indian') || text.includes('breakfast')) {
    conditions.push("(name ILIKE '%dosa%' OR name ILIKE '%idli%' OR name ILIKE '%upma%' OR name ILIKE '%pongal%' OR name ILIKE '%vada%' OR name ILIKE '%appam%')");
  } else if (text.includes('biryani')) {
    conditions.push("name ILIKE '%biryani%'");
  }

  // 6. Spice Preference
  if (text.includes('spicy')) {
    conditions.push("(description ILIKE '%spicy%' OR name ILIKE '%masala%' OR name ILIKE '%chettinad%')");
  }

  return { conditions, orderings };
};

// @route   POST /api/chatbot
// @desc    Receive user message, parse intent, query menu, return top 3
router.post('/', async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { conditions, orderings } = parseIntent(message);
    
    let query = 'SELECT * FROM menu_items WHERE ' + conditions.join(' AND ');
    
    if (orderings.length > 0) {
      query += ' ORDER BY ' + orderings.join(', ');
    } else {
      query += ' ORDER BY rating DESC';
    }
    
    query += ' LIMIT 3';

    const result = await db.query(query);

    let reply = "";
    if (result.rows.length > 0) {
      reply = "Here are some perfect matches I found for you! 🍽️";
    } else {
      reply = "I couldn't find any dishes matching exactly what you're looking for. Could you try adjusting your filters (e.g. increase the price or change category)?";
    }

    res.json({
      reply,
      items: result.rows
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
