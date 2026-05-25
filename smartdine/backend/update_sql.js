const fs = require('fs');

const images = {
  // Veg
  'Paneer Butter Masala': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=800&q=80',
  'Palak Paneer': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  'Vegetable Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  'Dal Makhani': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  'Malai Kofta': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
  'Kadai Paneer': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&w=800&q=80',
  'Veg Pulao': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
  'Aloo Gobi': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
  'Chana Masala': 'https://images.unsplash.com/photo-1565557613262-b0eb9de7090b?auto=format&fit=crop&w=800&q=80',
  'Mutter Paneer': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',

  // Non-Veg
  'Chicken Tikka Masala': 'https://images.unsplash.com/photo-1565557613262-b0eb9de7090b?auto=format&fit=crop&w=800&q=80',
  'Butter Chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?auto=format&fit=crop&w=800&q=80',
  'Mutton Rogan Josh': 'https://images.unsplash.com/photo-1544025162-8113222a7f50?auto=format&fit=crop&w=800&q=80',
  'Chicken Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  'Fish Curry': 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=800&q=80',
  'Tandoori Chicken': 'https://images.unsplash.com/photo-1599487618113-6447e170868c?auto=format&fit=crop&w=800&q=80',
  'Prawn Masala': 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80',
  'Mutton Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  'Chicken Korma': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
  'Egg Curry': 'https://images.unsplash.com/photo-1565557613262-b0eb9de7090b?auto=format&fit=crop&w=800&q=80',

  // Vegan
  'Vegan Buddha Bowl': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  'Tofu Stir Fry': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'Lentil Soup': 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
  'Quinoa Salad': 'https://images.unsplash.com/photo-1490645935980-d41dfeaf26b5?auto=format&fit=crop&w=800&q=80',
  'Vegan Pasta': 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80',
  'Roasted Chickpeas': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
  'Vegan Burger': 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
  'Sweet Potato Wedges': 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80',
  'Mushroom Risotto': 'https://images.unsplash.com/photo-1476124369491-e59f5f0ceb07?auto=format&fit=crop&w=800&q=80',
  'Vegan Wrap': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',

  // Dessert
  'Gulab Jamun': 'https://images.unsplash.com/photo-1589114473210-91129beafdfb?auto=format&fit=crop&w=800&q=80',
  'Rasgulla': 'https://images.unsplash.com/photo-1605197132836-ce0196c80db0?auto=format&fit=crop&w=800&q=80',
  'Chocolate Brownie': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  'Cheesecake': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
  'Tiramisu': 'https://images.unsplash.com/photo-1571115177098-24c42d640fa9?auto=format&fit=crop&w=800&q=80',
  'Ice Cream Sundae': 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&w=800&q=80',
  'Fruit Tart': 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=800&q=80',
  'Chocolate Lava Cake': 'https://images.unsplash.com/photo-1611293388250-580b08c4a145?auto=format&fit=crop&w=800&q=80',
  'Panna Cotta': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  'Mango Mousse': 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&w=800&q=80',

  // Drinks
  'Mango Lassi': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  'Sweet Lassi': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
  'Cold Coffee': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
  'Masala Chai': 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  'Fresh Lime Soda': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  'Mojito': 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80',
  'Iced Tea': 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=800&q=80',
  'Orange Juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
  'Watermelon Juice': 'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?auto=format&fit=crop&w=800&q=80',
  'Milkshake': 'https://images.unsplash.com/photo-1572490122747-3968b75bb811?auto=format&fit=crop&w=800&q=80'
};

let sql = fs.readFileSync('db_schema.sql', 'utf8');

for (const [name, url] of Object.entries(images)) {
  const regex = new RegExp(`\\('${name}'.*?'(https://example\\.com/[^']+)'\\)`, 'g');
  sql = sql.replace(regex, (match, p1) => {
    return match.replace(p1, url);
  });
}

fs.writeFileSync('db_schema.sql', sql);
console.log('db_schema.sql updated with professional internet images one by one!');
